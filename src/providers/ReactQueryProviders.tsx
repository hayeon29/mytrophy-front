'use client';

import { useState } from 'react';
import {
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';
import { handleAxiosError } from '@/utils/handleAxiosError';

export default function ReactQueryProviders({
  children,
}: React.PropsWithChildren) {
  const [queryClient] = useState(() => {
    return new QueryClient({
      defaultOptions: {
        queries: {
          staleTime: 60 * 1000,
          refetchOnMount: false,
          refetchOnWindowFocus: false,
        },
        mutations: {
          onError: handleAxiosError,
        },
      },
      queryCache: new QueryCache({
        onError: handleAxiosError,
      }),
    });
  });

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {/* <ReactQueryDevtools initialIsOpen={false} /> */}
    </QueryClientProvider>
  );
}
