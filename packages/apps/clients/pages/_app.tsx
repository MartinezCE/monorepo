import { useRouter } from 'next/router';
import { AxiosError, AxiosRequestHeaders } from 'axios';
import App, { AppContext, AppProps } from 'next/app';
import { useState } from 'react';
import { dehydrate, Hydrate, QueryClient, QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';
import { toast, ToastContainer } from 'react-toastify';
import { NextPage } from 'next';
import 'swiper/css/bundle';

import {
  ThemeProvider,
  CommonContextProvider,
  GET_ME,
  getMe,
  UserType,
  useMerge,
  MobileChecker,
  GoogleTagManager,
  ClientLocation,
  UserStatus,
  api,
} from '@wimet/apps-shared';
import { ContextProvider } from '../hooks/useContext';
import 'leaflet/dist/leaflet.css';
import { AllowedPathRouteChecker, isAllowedPath } from '../hooks/useAllowedPath';
import { getAllClientLocations, GET_ALL_CLIENT_LOCATIONS } from '../hooks/api/useGetAllClientLocations';

type NextPageWithLayout = NextPage & {
  getLayout?: (page: React.ReactElement) => React.ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

const MyApp = ({
  Component,
  pageProps: { headers, dehydratedState = {}, dehydratedAppState = {}, ...pageProps },
}: AppProps & AppPropsWithLayout) => {
  if (typeof headers === 'object' && 'authorization' in headers) {
    api.defaults.headers.common.Authorization = headers.authorization;
  }
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

  const getLayout = Component.getLayout ?? (page => page);

  return (
    <QueryClientProvider client={queryClient} contextSharing={true}>
      <GoogleTagManager />
      <Hydrate state={mergedState}>
        <AllowedPathRouteChecker>
          <CommonContextProvider>
            <ContextProvider>
              <ThemeProvider>
                <ToastContainer />
                <MobileChecker ignoreBreakpoint={router.pathname.includes('/blueprint-reservations')}>
                  {getLayout(<Component {...pageProps} />)}
                </MobileChecker>
              </ThemeProvider>
            </ContextProvider>
          </CommonContextProvider>
        </AllowedPathRouteChecker>
      </Hydrate>
      <ReactQueryDevtools initialIsOpen={process.env.NODE_ENV !== 'production'} />
    </QueryClientProvider>
  );
};

MyApp.getInitialProps = async (context: AppContext) => {
  const queryClient = new QueryClient();
  const { ctx } = context;

  if (!ctx.req) return { ...(await App.getInitialProps(context)) };

  const headers = ctx.req?.headers as AxiosRequestHeaders;
  const path = ctx.asPath;

  if (typeof headers === 'object' && 'authorization' in headers) {
    api.defaults.headers.common.Authorization = headers.authorization;
  }

  try {
    const [props, user] = await Promise.all([
      App.getInitialProps(context),
      queryClient.fetchQuery(GET_ME, () => getMe(headers)),
    ]);

    if (user?.userType?.value !== UserType.CLIENT) {
      ctx.res?.writeHead(307, { Location: user.profileUrl });
      return ctx.res?.end();
    }

    let locations: ClientLocation[] = [];
    if (user?.status === UserStatus.APPROVED) {
      locations = await queryClient.fetchQuery(GET_ALL_CLIENT_LOCATIONS, () => getAllClientLocations({}, headers));
    }

    if (path) {
      const { allowed, redirect } = isAllowedPath({ user, locations, path });
      if (!allowed) {
        ctx.res?.writeHead(307, { Location: redirect });
        return ctx.res?.end();
      }
    }

    return {
      ...props,
      pageProps: {
        headers,
        dehydratedAppState: dehydrate(queryClient),
      },
    };
  } catch (err) {
    if (!ctx.asPath?.includes('blueprint-reservations')) {
      ctx.res?.writeHead(307, { Location: `${process.env.NEXT_PUBLIC_LOGIN_URL}` });
    }
    return ctx.res?.end();
  }
};
export default MyApp;
