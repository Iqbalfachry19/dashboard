import { useEffect, useState } from 'react';
import { trpc } from '../utils/trpc';
import { NextPageWithLayout } from './_app';
import { useRouter } from 'next/router';
import { ReactSession } from 'react-client-session';
import toast, { Toaster } from 'react-hot-toast';
import { useRecoilState } from 'recoil';
import { loginState, userState } from 'atoms/login';
const style = {
  wrapper: 'flex flex-col items-center justify-center h-screen bg-blue-300',
};
const Login: NextPageWithLayout = () => {
  const [isLogin, setIsLogin] = useRecoilState(loginState);
  const [user, setUser] = useRecoilState(userState);
  const [nim, setNim] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();
  const checkUser = trpc.useQuery(['login.byNim', { nim }]);
  useEffect(() => {
    console.log(isLogin);
    if (isLogin) {
      router.push({ pathname: '/' });
    }
  }, [isLogin, router]);
  return (
    <>
      <div className={style.wrapper}>
        <h1 className="text-center text-2xl">Dashboard Perkuliahan</h1>
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            /**
             * In a real app you probably don't want to use this manually
             * Checkout React Hook Form - it works great with tRPC
             * @link https://react-hook-form.com/
             */

            const $nim: HTMLInputElement = (e as any).target.elements.nim;
            const $password: HTMLInputElement = (e as any).target.elements
              .password;

            try {
              if (
                checkUser.data?.nim == $nim.value &&
                checkUser.data?.password == $password.value
              ) {
                toast('login successfully');
                $password.value = '';
                $nim.value = '';
                setIsLogin(true);
                setUser({
                  nama: checkUser.data.nama,
                  nim: checkUser.data.nim,
                  id: checkUser.data.id,
                });
              } else {
                toast('login failed');
              }
            } catch {
              toast('login failed');
            }
          }}
          className="flex justify-center flex-col"
        >
          <label>nim</label>
          <input
            type="text"
            name="nim"
            value={nim}
            onChange={(e) => setNim(e.target.value)}
          />
          <label>password</label>
          <input
            type="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <input
            className="bg-white my-2 cursor-pointer"
            disabled={nim == '' || password == '' ? true : false}
            type="submit"
            value="Login"
          />
        </form>
      </div>
    </>
  );
};

export default Login;
