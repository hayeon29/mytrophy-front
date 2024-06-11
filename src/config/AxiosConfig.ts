import axios, {
    AxiosError,
    AxiosInstance,
    InternalAxiosRequestConfig,
    isAxiosError,
} from 'axios';

const api: AxiosInstance = axios.create({
  timeout: 20000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
  baseURL: process.env.NEXT_PUBLIC_BACK_URL,
});

api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const newConfig: InternalAxiosRequestConfig = { ...config };
    if (config.data instanceof FormData) {
      newConfig.headers['Content-Type'] = 'multipart/form-data';
    }

    return newConfig;
  },
  (error) => {
    if (isAxiosError(error)) {
      // 에러 핸들링 추가
    }

    return Promise.reject(error);
  }
);

export default api;
