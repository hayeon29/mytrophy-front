import { AxiosRequestConfig, AxiosResponseHeaders } from 'axios';

type AxiosResponse<T, D = unknown> = {
  data: T;
  status: number;
  statusText: string;
  headers: AxiosResponseHeaders;
  config: AxiosRequestConfig<D>;
  request?: unknown;
};

export type { AxiosResponse };
