import axios, {
  AxiosInstance,
  InternalAxiosRequestConfig,
  isAxiosError,
} from 'axios';

const api: AxiosInstance = axios.create({
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
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
