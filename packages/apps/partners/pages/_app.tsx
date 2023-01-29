import App, { AppContext, AppProps } from 'next/app';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { AxiosError, AxiosRequestHeaders } from 'axios';
import { dehydrate, Hydrate, QueryClient, QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';
import { toast, ToastContainer } from 'react-toastify';
import {
  useMerge,
  ThemeProvider,
  GET_ME,
  getMe,
  CommonContextProvider,
  UserType,
  MobileChecker,
  GoogleTagManager,
} from '@wimet/apps-shared';
import { ContextProvider } from '../hooks/useContext';

const MyApp = ({ Component, pageProps: { dehydratedState = {}, dehydratedAppState = {}, ...pageProps } }: AppProps) => {
  const router = useRouter();
  const mergedState = useMerge([dehydratedState, dehydratedAppState]);
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          mutations: {
            onError: error => {
              toast.error((error as AxiosError)?.message || 'There was an error.');
            },
          },
          queries: {
            staleTime: Infinity,
            retry: false,
            onError: e => {
              const err = e as AxiosError;
              if (err.request.status !== 401) return;
              router.replace(`${process.env.NEXT_PUBLIC_LOGIN_URL}`);
            },
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient} contextSharing={true}>
      <GoogleTagManager />
      <Hydrate state={mergedState}>
        <CommonContextProvider>
          <ContextProvider>
            <ThemeProvider>
              <ToastContainer />
              <MobileChecker>
                <Component {...pageProps} />
              </MobileChecker>
            </ThemeProvider>
          </ContextProvider>
        </CommonContextProvider>
      </Hydrate>
      <ReactQueryDevtools initialIsOpen={process.env.NODE_ENV !== 'production'} />
    </QueryClientProvider>
  );
};

MyApp.getInitialProps = async (context: AppContext) => {
  const queryClient = new QueryClient();
  const { ctx } = context;

  if (!ctx.req) return { ...(await App.getInitialProps(context)) };

  try {
    const [props, user] = await Promise.all([
      App.getInitialProps(context),
      queryClient.fetchQuery(GET_ME, () => getMe(ctx.req?.headers as AxiosRequestHeaders)),
    ]);

    if (user && user.userType.value !== UserType.PARTNER) {
      ctx.res?.writeHead(307, { Location: user.profileUrl });
      return ctx.res?.end();
    }

    return {
      ...props,
      pageProps: {
        dehydratedAppState: dehydrate(queryClient),
      },
    };
  } catch (_) {
    ctx.res?.writeHead(307, { Location: `${process.env.NEXT_PUBLIC_LOGIN_URL}` });
    return ctx.res?.end();
  }
};

export default MyApp;
