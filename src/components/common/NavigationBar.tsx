'use client';

import React, { FormEvent, useEffect, useState } from 'react';
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Button,
  Avatar,
  Input,
  Link,
} from '@nextui-org/react';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import membersAPI from '@/services/members';
import { useModal } from '@/hooks/useModal';
import LocalStorage from '@/constants/LocalStorage';
import { userState } from '@/recoils/userAtom';
import { useRecoilState } from 'recoil';
import { FaSearch } from 'react-icons/fa';
import LoginModal from '../modals/LoginModal';

export default function NavigationBar() {
  const [isMounted, setIsMounted] = useState(false);
  const [loginUserState, setLoginUserState] = useRecoilState(userState);

  const path = usePathname();
  const router = useRouter();
  const { modals, openModal, closeModal } = useModal();

  const handleLogout = async () => {
    const response = await membersAPI.logout();
    if (response.status === 200) {
      LocalStorage.removeItem('access');
      setLoginUserState(null);
      router.refresh();
    }
  };

  const handleLoginClick = () => {
    openModal(<LoginModal onClick={closeModal} />);
  };

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const searchInput = (event.target as HTMLFormElement).elements.namedItem(
      'search'
    ) as HTMLInputElement;
    const searchQuery = searchInput.value;
    if (searchQuery.length > 0) {
      router.push(`/gamelist?keyword=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <>
      {modals.length > 0 &&
        modals.map(({ component, id }) => {
          return <div key={id}>{component}</div>;
        })}
      {path !== '/signup' && path !== '/select-category' && (
        <Navbar
          className="bg-primary flex justify-center items-center"
          maxWidth="xl"
        >
          <div className="flex items-center gap-8">
            <NavbarBrand as={Link} href="/">
              <Image
                src="/svgs/logo.svg"
                width={32}
                height={32}
                alt="logo on navigation bar"
              />
            </NavbarBrand>
            <NavbarContent className="hidden sm:flex gap-4" justify="start">
              {path === '/' ? (
                <NavbarItem isActive>
                  <Link href="/" color="secondary" className="text-sm">
                    홈
                  </Link>
                </NavbarItem>
              ) : (
                <NavbarItem>
                  <Link href="/" color="foreground" className="text-sm">
                    홈
                  </Link>
                </NavbarItem>
              )}
              {path === '/article' ? (
                <NavbarItem isActive>
                  <Link href="/article" color="secondary" className="text-sm">
                    커뮤니티
                  </Link>
                </NavbarItem>
              ) : (
                <NavbarItem>
                  <Link href="/article" color="foreground" className="text-sm">
                    커뮤니티
                  </Link>
                </NavbarItem>
              )}

              {path === '/gamelist' ? (
                <NavbarItem isActive>
                  <Link
                    href="/gamelist?page=1"
                    color="secondary"
                    className="text-sm"
                  >
                    게임 목록
                  </Link>
                </NavbarItem>
              ) : (
                <NavbarItem>
                  <Link
                    href="/gamelist?page=1"
                    color="foreground"
                    className="text-sm"
                  >
                    게임 목록
                  </Link>
                </NavbarItem>
              )}
            </NavbarContent>
          </div>
          <div className="flex items-center gap-8">
            <form
              onSubmit={handleSearch}
              className="flex items-center space-x-1"
            >
              <Input
                name="search"
                classNames={{
                  base: 'max-w-full sm:max-w-48 ',
                  mainWrapper: 'h-full',
                  input: 'text-small',
                }}
                radius="full"
                size="md"
                placeholder="검색"
                type="search"
              />
              <Button
                type="submit"
                className="p-0 flex justify-center items-center rounded-full"
                isIconOnly
                color="default"
                variant="light"
                style={{ width: '35px', height: '35px' }}
              >
                <FaSearch color="white" size={22} />
              </Button>
            </form>
            {isMounted && loginUserState && (
              <NavbarContent className="text-sm">
                <NavbarItem>
                  <button
                    type="button"
                    className="text-white text-sm"
                    onClick={handleLogout}
                  >
                    로그아웃
                  </button>
                </NavbarItem>
                <NavbarItem>
                  <Link href="/member" className="text-white text-sm">
                    마이페이지
                  </Link>
                </NavbarItem>
                <div className="flex items-center gap-4">
                  <span className="text-white">
                    {loginUserState?.nickname || loginUserState?.name || '유저'}
                  </span>
                  {loginUserState?.imagePath !== null && isMounted ? (
                    <Avatar
                      src={loginUserState.imagePath}
                      size="sm"
                      style={{ width: 32, height: 32 }}
                    />
                  ) : (
                    <Avatar
                      src="/svgs/person.svg"
                      size="sm"
                      className="bg-lightGray"
                      style={{ width: 32, height: 32 }}
                    />
                  )}
                </div>
              </NavbarContent>
            )}
            {isMounted && !loginUserState && (
              <div className="flex gap-2">
                <Button
                  className="bg-white text-primary border-primary border-0 rounded-full"
                  onPress={handleLoginClick}
                >
                  로그인
                </Button>
                <Button className="bg-white text-primary border-primary border-0 rounded-full">
                  <Link
                    href="/signup"
                    className="w-full h-full text-sm flex justify-center items-center"
                  >
                    회원가입
                  </Link>
                </Button>
              </div>
            )}
          </div>
        </Navbar>
      )}
    </>
  );
}
