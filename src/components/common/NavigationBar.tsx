'use client';

import React, { FormEvent, useMemo, useState } from 'react';
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Link,
  Button,
  // Avatar,
  Input,
  Modal,
  useDisclosure,
  ModalContent,
  ModalHeader,
  ModalBody,
} from '@nextui-org/react';
import Image from 'next/image';
import Validation from '@/constants/validation';
import { usePathname } from 'next/navigation';
import { UserLoginInfo } from '@/types/LoginInfo';

export default function NavigationBar() {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const [userInfo, setUserInfo] = useState<UserLoginInfo>({
    username: '',
    password: '',
  });

  const [checkMessage, setCheckMessage] = useState<UserLoginInfo>({
    username: '',
    password: '',
  });

  const path = usePathname();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const handlePasswordCheck = () => {
    setIsPasswordVisible((prev) => !prev);
  };

  const handleInput = (event: FormEvent<HTMLInputElement>) => {
    const { name, value } = event.target as HTMLInputElement;
    const newValidationMessage = Validation[name]
      .filter((eachCondition) => !eachCondition.validateFunction(value))
      .map((eachCondition) => eachCondition.name)
      .join(', ');
    setCheckMessage({ ...checkMessage, [name]: newValidationMessage });
    setUserInfo({ ...userInfo, [name]: value });
  };

  const isLoginAvailable = useMemo(() => {
    const keyOfConditions: string[] = Object.keys(checkMessage);
    return keyOfConditions.every((key: string) => {
      return checkMessage[key].length === 0 && userInfo[key].length > 0;
    });
  }, [checkMessage, userInfo]);

  return (
    path !== '/signup' && (
      <Navbar
        className="bg-primary flex justify-center items-center"
        maxWidth="xl"
      >
        <div className="flex items-center gap-8">
          <NavbarBrand>
            <Image
              src={`${process.env.NEXT_PUBLIC_FRONT_URL}/svgs/logo.svg`}
              width={32}
              height={32}
              alt="logo on navigation bar"
            />
          </NavbarBrand>
          <NavbarContent className="hidden sm:flex gap-4" justify="start">
            <NavbarItem isActive>
              <Link href="/" color="secondary" className="text-sm">
                홈
              </Link>
            </NavbarItem>
            <NavbarItem>
              <Link href="/" color="foreground" className="text-sm">
                커뮤니티
              </Link>
            </NavbarItem>
            <NavbarItem>
              <Link href="/" color="foreground" className="text-sm">
                게임 추천
              </Link>
            </NavbarItem>
            <NavbarItem>
              <Link href="/" color="foreground" className="text-sm">
                게임 목록
              </Link>
            </NavbarItem>
            <NavbarItem>
              <Link href="/" color="foreground" className="text-sm">
                게임 평가
              </Link>
            </NavbarItem>
          </NavbarContent>
        </div>
        <div className="flex items-center gap-8">
          <Input
            classNames={{
              base: 'max-w-full sm:max-w-48 ',
              mainWrapper: 'h-full',
              input: 'text-small',
            }}
            radius="full"
            size="md"
            placeholder="검색"
            startContent={
              <Image
                src={`${process.env.NEXT_PUBLIC_FRONT_URL}/svgs/search.svg`}
                alt="search icon"
                width={18}
                height={18}
              />
            }
            type="search"
          />
          {/* 로그인 유저 */}
          {/* 
    <NavbarContent>
      <NavbarItem>
        <Link href="#" className="text-white">
          로그아웃
        </Link>
      </NavbarItem>
      <NavbarItem>
        <Link href="#" className="text-white">
          마이페이지
        </Link>
      </NavbarItem>
      <div className="flex items-center gap-4">
        <span className="text-white">유저</span>
        <Avatar
          src={`${process.env.NEXT_PUBLIC_FRONT_URL}/image/sample_icon.jpg`}
          size="sm"
        />
      </div>
    </NavbarContent>
    */}
          {/* 비로그인 유저 */}
          <div className="flex gap-2">
            <Button
              className="bg-white text-primary border-primary border-0 rounded-full"
              onPress={onOpen}
            >
              로그인
            </Button>
            <Button className="bg-white text-primary border-primary border-0 rounded-full">
              <Link href="/signup" className="w-full h-full">
                회원가입
              </Link>
            </Button>
          </div>
          <Modal
            size="2xl"
            isOpen={isOpen}
            onOpenChange={onOpenChange}
            isDismissable={false}
            isKeyboardDismissDisabled
          >
            <ModalContent className="flex items-center">
              {() => (
                <>
                  <div className="w-full">
                    <ModalHeader>로그인</ModalHeader>
                  </div>
                  <div className="w-96">
                    <ModalBody className="flex flex-col items-center justify-center gap-6 mt-6 mb-16">
                      <Image
                        src={`${process.env.NEXT_PUBLIC_FRONT_URL}/svgs/logo.svg`}
                        alt="logo on login modal"
                        width={64}
                        height={64}
                      />
                      <div className="w-full">
                        <label
                          className="font-bold block mb-3"
                          htmlFor="username"
                        >
                          아이디
                        </label>
                        <Input
                          id="username"
                          name="username"
                          classNames={{
                            inputWrapper: [
                              'group-data-[focus=true]:border-primary',
                              'h-12',
                            ],
                            input: [
                              'autofill:transition-colors autofill:shadow-disabled',
                            ],
                          }}
                          variant="bordered"
                          placeholder="아이디를 입력해주세요"
                          onChange={handleInput}
                          isInvalid={
                            checkMessage.username.length > 0 &&
                            userInfo.username.length > 0
                          }
                          errorMessage={checkMessage.username}
                        />
                      </div>
                      <div className="w-full">
                        <label
                          className="font-bold block mb-3"
                          htmlFor="password"
                        >
                          비밀번호
                        </label>
                        <Input
                          id="password"
                          name="password"
                          variant="bordered"
                          classNames={{
                            inputWrapper: [
                              'group-data-[focus=true]:border-primary',
                              'h-12',
                            ],
                            input: [
                              'autofill:transition-colors autofill:shadow-disabled',
                            ],
                          }}
                          type={isPasswordVisible ? 'text' : 'password'}
                          endContent={
                            <Image
                              src={
                                isPasswordVisible
                                  ? `${process.env.NEXT_PUBLIC_FRONT_URL}/svgs/visibility_off_24dp.svg`
                                  : `${process.env.NEXT_PUBLIC_FRONT_URL}/svgs/visibility_24dp.svg`
                              }
                              alt="password visibility icon"
                              width={28}
                              height={24}
                              className="absolute top-2/4 right-3 translate-y-[-50%] cursor-pointer w-7 h-6"
                              onClick={handlePasswordCheck}
                            />
                          }
                          placeholder="비밀번호를 입력해주세요"
                          onChange={handleInput}
                          isInvalid={
                            checkMessage.password.length > 0 &&
                            userInfo.password.length > 0
                          }
                          errorMessage={checkMessage.password}
                        />
                      </div>
                      <Button
                        className="bg-primary text-white rounded-xl w-full py-4 text-sm font-bold"
                        size="lg"
                        isDisabled={!isLoginAvailable}
                      >
                        로그인
                      </Button>
                      <Button
                        className="bg-white text-blueBlack rounded-xl border-blueGray border w-full py-4 text-sm font-bold"
                        size="lg"
                        startContent={
                          <Image
                            src={`${process.env.NEXT_PUBLIC_FRONT_URL}/svgs/google_logo.svg`}
                            alt="google logo on login"
                            width={24}
                            height={24}
                          />
                        }
                      >
                        구글로 로그인하기
                      </Button>
                      <Button
                        className="bg-kakao text-kakaoText rounded-xl w-full py-4 text-sm font-bold"
                        size="lg"
                        startContent={
                          <Image
                            src={`${process.env.NEXT_PUBLIC_FRONT_URL}/image/kakaotalk_icon.png`}
                            alt="kakaotalk icon"
                            width={24}
                            height={24}
                          />
                        }
                      >
                        카카오로 로그인하기
                      </Button>
                    </ModalBody>
                  </div>
                </>
              )}
            </ModalContent>
          </Modal>
        </div>
      </Navbar>
    )
  );
}
