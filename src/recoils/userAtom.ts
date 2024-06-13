import { UserInfo } from '@/types/UserInfo';
import { useEffect, useState } from 'react';
import { atom, useRecoilState } from 'recoil';
import { recoilPersist } from 'recoil-persist';

const { persistAtom } = recoilPersist();

const userState = atom<UserInfo>({
  key: 'userinfo',
  default: null,
  effects_UNSTABLE: [persistAtom],
});

function useUserStateSSR() {
  const [isInitial, setIsInitial] = useState(true);
  const [value, setValue] = useRecoilState(userState);

  useEffect(() => {
    setIsInitial(false);
  }, []);

  return [isInitial ? null : value, setValue] as const;
}

export { userState, useUserStateSSR };
