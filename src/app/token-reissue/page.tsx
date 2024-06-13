'use client';

import LocalStorage from '@/constants/LocalStorage';
import { userState } from '@/recoils/userAtom';
import authAPI from '@/services/auth';
import membersAPI from '@/services/members';
import { UserInfo } from '@/types/UserInfo';
import { handleAxiosError } from '@/utils/handleAxiosError';
import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useSetRecoilState } from 'recoil';

export default function Reissue() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const isFirstLogin = searchParams.get('firstLogin');
  const setLoginUserState = useSetRecoilState(userState);
  useEffect(() => {
    const handleReissue = async () => {
      try {
        const response = await authAPI.reissue();
        if (response.status === 200) {
          LocalStorage.setItem('access', response.headers.access);
          const memberInfo = await membersAPI.getUserInfo();
          const { username, id, nickname, steamId, imagePath } =
            memberInfo.data as UserInfo;
          setLoginUserState({ username, id, nickname, steamId, imagePath });
          if (isFirstLogin) {
            router.replace('/select-category');
          } else {
            router.replace('/');
          }
        }
      } catch (error) {
        handleAxiosError(error);
      }
    };
    handleReissue();
  }, [isFirstLogin, setLoginUserState, router]);

  return <div />;
}
