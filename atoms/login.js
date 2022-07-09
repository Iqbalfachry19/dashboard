import { atom } from 'recoil';
import { recoilPersist } from 'recoil-persist';

const { persistAtom } = recoilPersist();
export const loginState = atom({
  key: 'isLogin', // unique ID (with respect to other atoms/selectors)
  default: false, // default value (aka initial value)
  effects_UNSTABLE: [persistAtom],
});
export const userState = atom({
  key: 'user', // unique ID (with respect to other atoms/selectors)
  default: {
    id: '',
    name: '',
    nim: '',
  }, // default value (aka initial value)
  effects_UNSTABLE: [persistAtom],
});
