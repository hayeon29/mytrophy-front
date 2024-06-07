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
import VALIDATION from '@/constants/validation';
import { usePathname, useRouter } from 'next/navigation';
import { UserLoginInfo } from '@/types/LoginInfo';
import membersAPI from '@/services/members';
import { useModal } from '@/hooks/useModal';
import OkModal from '@/components/modals/OkModal';

export default function NavigationBar() {
  const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false);

  const [userInfo, setUserInfo] = useState<UserLoginInfo>({
    username: '',
    password: '',
  });

  const [checkMessage, setCheckMessage] = useState<UserLoginInfo>({
    username: '',
    password: '',
  });

  const path = usePathname();
  const router = useRouter();
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const { modals, openModal } = useModal();

  const handlePasswordCheck = () => {
    setIsPasswordVisible((prev) => !prev);
  };

  const handleInput = (event: FormEvent<HTMLInputElement>) => {
    const { name, value } = event.target as HTMLInputElement;
    const newValidationMessage = VALIDATION[name]
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

  const handleLogin = async () => {
    const response = await membersAPI.login(userInfo);
    if (response.status === 200) {
      localStorage.setItem('access', response.headers.access);
      openModal(
        <OkModal title="로그인 결과" message="로그인에 성공했습니다." />
      );
      onClose();
      router.refresh();
    } else {
      openModal(
        <OkModal title="로그인 결과" message="로그인에 실패했습니다." />
      );
    }
  };

  const handleSteamLogin = async (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    event.preventDefault();
    const steamLoginForm = document.getElementById(
      'steamLoginForm'
    ) as HTMLFormElement;

    const realm = document.createElement('input');
    realm.setAttribute('name', 'openid.realm');
    realm.setAttribute('value', process.env.NEXT_PUBLIC_BACK_URL);

    const returnTo = document.createElement('input');
    returnTo.setAttribute('name', 'openid.return_to');
    returnTo.setAttribute(
      'value',
      `${process.env.NEXT_PUBLIC_BACK_URL}/api/members/steam/login/redirect?access=${encodeURIComponent(localStorage.getItem('access'))}`
    );

    steamLoginForm.appendChild(realm);
    steamLoginForm.appendChild(returnTo);

    steamLoginForm.submit();
  };

  return (
    <>
      {modals.map(({ component, id }) => {
        return <div key={id}>{component}</div>;
      })}
      <form
        id="steamLoginForm"
        action="https://steamcommunity.com/openid/login"
        method="post"
        className="hidden"
      >
        <input
          type="hidden"
          name="openid.identity"
          value="http://specs.openid.net/auth/2.0/identifier_select"
        />
        <input
          type="hidden"
          name="openid.claimed_id"
          value="http://specs.openid.net/auth/2.0/identifier_select"
        />
        <input
          type="hidden"
          name="openid.ns"
          value="http://specs.openid.net/auth/2.0"
        />
        <input type="hidden" name="openid.mode" value="checkid_setup" />
        <input
          type="image"
          name="submit"
          src="https://steamcdn-a.akamaihd.net/steamcommunity/public/images/steamworks_docs/brazilian/sits_small.png"
          alt="Submit"
        />
      </form>
      {path !== '/signup' && path !== '/select-category' && (
        <Navbar
          className="bg-primary flex justify-center items-center"
          maxWidth="xl"
        >
          <div className="flex items-center gap-8">
            <NavbarBrand>
              <Image
                src="/svgs/logo.svg"
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
                  src="/svgs/search.svg"
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
        src={`/image/sample_icon.jpg`}
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
                <Link href="/signup" className="w-full h-full text-sm">
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
                          src="/svgs/logo.svg"
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
                                    ? `/svgs/visibility_off_24dp.svg`
                                    : `/svgs/visibility_24dp.svg`
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
                          onClick={handleLogin}
                        >
                          로그인
                        </Button>
                        <Link
                          href={`${process.env.NEXT_PUBLIC_BACK_URL}/oauth2/authorization/google`}
                          className="w-full h-full text-white text-center"
                        >
                          <Button
                            className="bg-white text-blueBlack rounded-xl border-blueGray border w-full py-4 text-sm font-bold"
                            size="lg"
                            startContent={
                              <Image
                                src="/svgs/google_logo.svg"
                                alt="google logo on login"
                                width={24}
                                height={24}
                              />
                            }
                          >
                            구글로 로그인하기
                          </Button>
                        </Link>
                        <Button
                          className="bg-kakao text-kakaoText rounded-xl w-full py-4 text-sm font-bold"
                          size="lg"
                          startContent={
                            <Image
                              src="/image/kakaotalk_icon.png"
                              alt="kakaotalk"
                              width={24}
                              height={24}
                            />
                          }
                        >
                          카카오로 로그인하기
                        </Button>
                        <Button
                          className="bg-gradient-to-br from-steamGradientFrom via-steamGradientVia to-steamGradientTo rounded-xl w-full py-4 text-white text-sm font-bold"
                          size="lg"
                          onClick={(event) => handleSteamLogin(event)}
                          startContent={
                            <Image
                              src="/svgs/steam_logo.svg"
                              alt="steam logo on login"
                              width={24}
                              height={24}
                            />
                          }
                        >
                          스팀으로 로그인하기
                        </Button>

                        <Link
                          href={`${process.env.NEXT_PUBLIC_BACK_URL}/oauth2/authorization/naver`}
                          className="w-full h-full text-white text-center"
                        >
                          <Button
                            id="naverIdLogin"
                            className="bg-naver rounded-xl w-full py-4 text-white text-sm font-bold"
                            size="lg"
                            startContent={
                              <Image
                                src="/image/naver.png"
                                alt="naver logo on login"
                                width={24}
                                height={24}
                              />
                            }
                          >
                            네이버로 로그인하기
                          </Button>
                        </Link>
                      </ModalBody>
                    </div>
                  </>
                )}
              </ModalContent>
            </Modal>
          </div>
        </Navbar>
      )}
    </>
  );
}
