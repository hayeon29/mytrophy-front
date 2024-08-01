import authAPI from '@/services/auth';
import membersAPI from '@/services/members';
import { AxiosError } from 'axios';

export async function handleAxiosError(error: AxiosError | Error) {
  if (error instanceof AxiosError) {
    switch (error?.response?.status) {
      case 401: {
        if (error?.response.data === 'access token expired') {
          try {
            const response = await authAPI.reissue();
            localStorage.setItem('access', response.headers.access);
            if (typeof window !== 'undefined') {
              window.location.reload();
            }
          } catch (reissueError) {
            // 리프레시 토큰 만료 시
            await membersAPI.logout();
          }
        }
        break;
      }
      default: {
        //
      }
    }
  }
}
