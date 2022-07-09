import { userState } from 'atoms/login';
import React, { useEffect } from 'react';
import { useRecoilValue } from 'recoil';
const style = {
  header: 'flex flex-col bg-blue-300',
  title: 'flex text-2xl justify-center',
  subtitle: 'flex justify-center',
};
const Header = () => {
  const user = useRecoilValue(userState);
  console.log(user);

  return (
    <div className={style.header}>
      <h1 className={style.title}>Dashboard Perkuliahan UNRI</h1>
      <p className={style.subtitle}>
        Selamat datang {user.nama} di dashboard perkuliahan UNRI
      </p>
    </div>
  );
};

export default Header;
