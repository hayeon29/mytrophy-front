import LocalStorage from '@/constants/LocalStorage';
import { userState } from '@/recoils/userAtom';
import { NextPage } from 'next';
import { useRecoilValue } from 'recoil';
import { useRouter } from 'next/navigation';
import OkModal from '@/components/modals/OkModal';
import { useEffect, useState } from 'react';

const withAuth = (Component: NextPage | React.FC) => {
  function Auth() {
    const isLoggedIn = useRecoilValue(userState);
    const accessToken = LocalStorage.getItem('access');
    const router = useRouter();
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
      setIsMounted(true);
    }, []);

    return (
      <>
        {(!isLoggedIn || !accessToken) && isMounted && (
          <OkModal
            onClick={() => {
              router.replace('/login');
              router.refresh();
            }}
            message="로그인이 필요합니다."
          />
        )}
        <Component />
      </>
    );
  }

  return Auth;
};

export default withAuth;
