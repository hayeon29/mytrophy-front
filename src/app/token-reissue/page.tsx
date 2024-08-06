'use client';

import LocalStorage from '@/constants/LocalStorage';
import { userState } from '@/recoils/userAtom';
import authAPI from '@/services/auth';
import membersAPI from '@/services/members';
import { UserInfo } from '@/types/UserInfo';
import { handleAxiosError } from '@/utils/handleAxiosError';
import { CircularProgress } from '@nextui-org/react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Suspense, useEffect } from 'react';
import { useSetRecoilState } from 'recoil';

function Reissue() {
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
          const {
            username,
            nickname,
            id,
            steamId,
            name,
            email,
            imagePath,
            loginType,
          } = memberInfo.data as UserInfo;
          setLoginUserState({
            username,
            nickname,
            id,
            steamId,
            name,
            email,
            imagePath,
            loginType,
          });
          if (isFirstLogin) {
            if (typeof window !== undefined) {
              window.location.href = '/select-category';
            }
          } else if (typeof window !== undefined) {
            window.location.href = '/';
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

function ReissuePage() {
  return (
    <Suspense fallback={<CircularProgress aria-label="로딩중" />}>
      <Reissue />
    </Suspense>
  );
}

export default ReissuePage;
