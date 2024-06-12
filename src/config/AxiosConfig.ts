import axios, {
  AxiosError,
  AxiosInstance,
  AxiosResponse,
  InternalAxiosRequestConfig,
  isAxiosError,
} from 'axios';

const api: AxiosInstance = axios.create({
  timeout: 20000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const newConfig: InternalAxiosRequestConfig = { ...config };
    if (config.data instanceof FormData) {
      newConfig.headers['Content-Type'] = 'multipart/form-data';
    }

    return newConfig;
  },
  (error: AxiosError | Error): Promise<AxiosError> => {
    if (isAxiosError(error)) {
      // const { method, url } = error.config as InternalAxiosRequestConfig;
      if (error.response) {
        // const { statusCode, message } = error.response.data;
        // console.log(
        //   `[API - ERROR] ${method?.toUpperCase()} ${url} | ${statusCode} : ${message}`
        // );
      }
    } else {
      // console.log(`[API] | Error ${error.message}`);
    }

    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (res: AxiosResponse): AxiosResponse => {
    // const { method, url } = res.config;
    // const { status, ...data } = res;

    // if (status >= 200 && status < 300) {
    // console.log(
    //   `[API - RESPONSE] ${method?.toUpperCase()} ${url} | ${status} :`,
    //   data.data
    // );
    // } else {
    // console.log(
    //   `[API-ERROR] ${method?.toUpperCase()} ${url} | ${status} :`,
    //   data.data
    // );
    // }

    return res;
  },
  (error: AxiosError | Error): Promise<AxiosError> => {
    if (isAxiosError(error)) {
      // const { method, url } = error.config as InternalAxiosRequestConfig;
      // console.log(`[API - ERROR]`, error);
      if (error.response) {
        // const { status, statusText } = error.response;
        // console.log(
        //   `[API - ERROR] ${method?.toUpperCase()} ${url} | ${status}: ${statusText}`
        // );
        return Promise.reject(error);
      }
    } else {
      // console.log(`[API] | Error ${error.message}`);
    }

    return Promise.reject(error);
  }
);

export default api;
