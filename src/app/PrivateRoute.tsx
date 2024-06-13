import LocalStorage from '@/constants/LocalStorage';
import { userState } from '@/recoils/userAtom';
import { NextPage } from 'next';
import { useRecoilValue } from 'recoil';
import { useRouter } from 'next/navigation';

const withAuth = (Component: NextPage | React.FC) => {
  function Auth() {
    const isLoggedIn = useRecoilValue(userState);
    const accessToken = LocalStorage.getItem('access');
    const router = useRouter();

    if (!isLoggedIn || !accessToken) {
      router.replace('/');
      router.refresh();
    }
    return <Component />;
  }

  return Auth;
};

export default withAuth;
