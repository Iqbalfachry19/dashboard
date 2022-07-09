import { useEffect, useState } from 'react';
import { trpc } from '../utils/trpc';
import { NextPageWithLayout } from './_app';
import { useRouter } from 'next/router';
import toast, { Toaster } from 'react-hot-toast';
const style = {
  wrapper: 'flex flex-col items-center justify-center h-screen bg-blue-300',
};

const Admin: NextPageWithLayout = () => {
  const utils = trpc.useContext();
  const [isLogin, setIsLogin] = useState(false);
  const [nim, setNim] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();
  const addUser = trpc.useMutation(['login.create']);

  return (
    <>
      <div className={style.wrapper}>
        <h1 className="text-center text-2xl">Admin Dashboard Perkuliahan</h1>
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
            const input = {
              nim: $nim.value,
              password: $password.value,
            };
            try {
              await addUser.mutateAsync(input);

              $nim.value = '';
              $password.value = '';
              toast('add successfully');
            } catch {
              toast('add failed');
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

export default Admin;
