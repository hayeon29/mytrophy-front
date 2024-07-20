'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import membersAPI from '@/services/members';
import LocalStorage from '@/constants/LocalStorage';
import { userState } from '@/recoils/userAtom';
import { useRecoilState } from 'recoil';
import Link from 'next/link';

export default function NavigationBar() {
  const [isMounted, setIsMounted] = useState(false);
  const [loginUserState, setLoginUserState] = useRecoilState(userState);

  const path = usePathname();

  const handleLogout = async () => {
    await membersAPI.logout();
    LocalStorage.removeItem('access');
    setLoginUserState(null);
    if (typeof window !== undefined) {
      window.location.reload();
    }
  };

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <div>
      {path !== '/signup' && path !== '/select-category' && (
        <nav className="w-full bg-white h-20 border-b-1 border-blueGray">
          <div className="w-full min-w-1024 max-w-1280 mx-auto h-full flex flex-row items-center">
            <Link href="/" className="p-6">
              <Image
                src="/svgs/logo.svg"
                width={127}
                height={32}
                alt="logo on navigation bar"
              />
            </Link>
            <div className="h-full flex flex-row items-center justify-center gap-12 grow text-sm font-black">
              <Link
                href="/"
                className={`h-full flex items-center border-b-4 ${path === '/' ? 'text-primary border-primary' : 'text-black border-white'}`}
              >
                홈
              </Link>
              <Link
                href="/article"
                className={`h-full flex items-center border-b-4 ${path === '/article' ? 'text-primary border-primary' : 'text-black border-white'}`}
              >
                커뮤니티
              </Link>
              <Link
                href="/gamelist?page=1"
                className={`h-full flex items-center border-b-4 ${path === '/gamelist' ? 'text-primary border-primary' : 'text-black border-white'}`}
              >
                게임 목록
              </Link>
            </div>
            <div className="h-full flex items-center gap-8 p-8 text-sm">
              {isMounted && loginUserState && (
                <span className="flex flex-row gap-4 text-black">
                  <Link href="/member" className="self-center">
                    마이페이지
                  </Link>
                  <button type="button" onClick={handleLogout}>
                    로그아웃
                  </button>
                  <div className="flex items-center gap-4">
                    <span>{loginUserState?.nickname || '유저'}</span>
                    <Image
                      width={32}
                      height={32}
                      alt="profile photo"
                      src={`${loginUserState?.imagePath !== null ? loginUserState.imagePath : '/svgs/person.svg'}`}
                      className="rounded-full"
                    />
                  </div>
                </span>
              )}
              {isMounted && !loginUserState && (
                <div className="flex gap-4">
                  <Link className=" text-black border-0" href="/login">
                    로그인
                  </Link>
                  <button type="button" className="text-black border-0">
                    <Link
                      href="/signup"
                      className="w-full h-full flex justify-center items-center"
                    >
                      회원가입
                    </Link>
                  </button>
                </div>
              )}
            </div>
          </div>
        </nav>
      )}
    </div>
  );
}
