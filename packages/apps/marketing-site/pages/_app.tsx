import { useEffect, useState } from 'react';
import App, { AppContext, AppProps } from 'next/app';
import { dehydrate, Hydrate, QueryClient, QueryClientProvider } from 'react-query';
import AOS from 'aos';
import { AxiosRequestHeaders } from 'axios';
import { useMerge, ThemeProvider, GET_ME, getMe, CommonContextProvider, GoogleTagManager } from '@wimet/apps-shared';
import { ReactQueryDevtools } from 'react-query/devtools';
import { IntercomProvider } from 'react-use-intercom';
import { getHeader, GET_HEADER } from '../hooks/api/useGetHeader';
import { getFooter, GET_FOOTER } from '../hooks/api/useGetFooter';
import 'aos/dist/aos.css';
import 'swiper/css/bundle';
import { ContextProvider } from '../hooks/useContext';

const MyApp = ({ Component, pageProps: { dehydratedState = {}, dehydratedAppState = {}, ...pageProps } }: AppProps) => {
  const mergedState = useMerge([dehydratedState, dehydratedAppState]);
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: { staleTime: Infinity, refetchOnWindowFocus: 'always' },
        },
      })
  );

  useEffect(() => {
    navigator.serviceWorker?.register('/sw.js');
    AOS.init({ easing: 'ease-out-cubic', once: true, offset: 120, duration: 600 });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <QueryClientProvider client={queryClient} contextSharing={true}>
      <IntercomProvider
        apiBase={process.env.NEXT_PUBLIC_INTERCOM_APP_URL}
        appId={process.env.NEXT_PUBLIC_INTERCOM_APP_ID as string}>
        <GoogleTagManager />
        <Hydrate state={mergedState}>
          <CommonContextProvider>
            <ContextProvider>
              <ThemeProvider>
                <Component {...pageProps} />
              </ThemeProvider>
            </ContextProvider>
          </CommonContextProvider>
        </Hydrate>
        <ReactQueryDevtools initialIsOpen={process.env.NODE_ENV !== 'production'} />
      </IntercomProvider>
    </QueryClientProvider>
  );
};

MyApp.getInitialProps = async (context: AppContext) => {
  const queryClient = new QueryClient();
  const { ctx } = context;
  const { locale } = ctx;

  const [props] = await Promise.all([
    App.getInitialProps(context),
    queryClient.prefetchQuery([GET_HEADER, locale || ''], () => getHeader({ locale })),
    queryClient.prefetchQuery([GET_FOOTER, locale || ''], () => getFooter({ locale })),
    queryClient.prefetchQuery(GET_ME, () => getMe(ctx.req?.headers as AxiosRequestHeaders)),
  ]);

  return {
    ...props,
    pageProps: {
      dehydratedAppState: dehydrate(queryClient),
      locale,
    },
  };
};

export default MyApp;
