/* eslint-disable @typescript-eslint/no-unused-vars */
import { AxiosError } from 'axios';
import App, { AppContext, AppProps } from 'next/app';
import { useState } from 'react';
import { Hydrate, QueryClient, QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';
import { toast, ToastContainer } from 'react-toastify';
import { GoogleTagManager, MobileChecker, ThemeProvider } from '@wimet/apps-shared';

const MyApp = ({ Component, pageProps }: AppProps) => {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          mutations: {
            onError: error => {
              toast.error((error as AxiosError)?.message);
            },
          },
          queries: { staleTime: Infinity, retry: false },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient} contextSharing={true}>
      <GoogleTagManager />
      <Hydrate state={pageProps.dehydratedState}>
        <ThemeProvider>
          <ToastContainer />
          <MobileChecker>
            <Component {...pageProps} />
          </MobileChecker>
        </ThemeProvider>
      </Hydrate>
      <ReactQueryDevtools initialIsOpen={process.env.NODE_ENV !== 'production'} />
    </QueryClientProvider>
  );
};

MyApp.getInitialProps = async (appContext: AppContext) => ({
  ...(await App.getInitialProps(appContext)),
});

export default MyApp;
