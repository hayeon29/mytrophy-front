import api from '@/config/AxiosConfig';
import { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';

export const Get = async <T>(
  url: string,
  config?: AxiosRequestConfig
): Promise<AxiosResponse<T>> => {
  const response = await api.get(url, config).catch((error) => {
    if (error instanceof AxiosError) {
      throw error;
    }
  });
  return response as AxiosResponse<T>;
};

export const Post = async <T>(
  url: string,
  data?: unknown,
  config?: AxiosRequestConfig
): Promise<AxiosResponse<T>> => {
  const response = await api.post(url, data, config);
  return response;
};
