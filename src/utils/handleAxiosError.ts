import authAPI from '@/services/auth';
import { AxiosError } from 'axios';

export async function handleAxiosError(error: AxiosError | Error) {
  if (error instanceof AxiosError) {

    const { status, data } = error.response;
    if (status === 401 && data === 'access token expired') {
      try {
        const response = await authAPI.reissue();
        localStorage.setItem('access', response.headers.access);
      } catch (reissueError) {
        // 리프레시 토큰 만료 시
        localStorage.removeItem('access');
        window.location.href = '/';
      }
    }
  }
}
