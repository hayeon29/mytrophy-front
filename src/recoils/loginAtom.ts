import { atom } from 'recoil';
import { recoilPersist } from 'recoil-persist';

const { persistAtom } = recoilPersist();

const loginState = atom<boolean>({
  key: 'login-info',
  default: false,
  effects_UNSTABLE: [persistAtom],
});

export { loginState };
