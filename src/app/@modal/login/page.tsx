'use client';

import RouterModal from '@/components/modals/RouterModal';
import LocalStorage from '@/constants/LocalStorage';
import VALIDATION from '@/constants/validation';
import { userState } from '@/recoils/userAtom';
import membersAPI from '@/services/members';
import { UserLoginInfo } from '@/types/LoginInfo';
import { UserInfo } from '@/types/UserInfo';
import { handleAxiosError } from '@/utils/handleAxiosError';
import { AxiosError } from 'axios';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';
import { useSetRecoilState } from 'recoil';

export default function LoginModal() {
  const router = useRouter();

  // 로그인 후 유저 정보를 저장하기 위한 상태
  const setLoginUserState = useSetRecoilState(userState);

  // 비밀번호가 보이는 여부를 결정하는 상태
  const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false);

  // 입력한 값을 저장하는 상태
  const [userInfo, setUserInfo] = useState<UserLoginInfo>({
    username: '',
    password: '',
  });

  // 입력 시 나타나는 메시지
  const [checkMessage, setCheckMessage] = useState<UserLoginInfo>({
    username: '',
    password: '',
  });

  // 비밀번호 보이게 하기/숨기기 버튼 클릭시 발생하는 이벤트 함수
  const handlePasswordCheck = () => {
    setIsPasswordVisible((prev) => !prev);
  };

  // 입력 창에 데이터 입력 시마다 발생하는 이벤트 함수
  const handleInput = (event: React.FormEvent<HTMLInputElement>) => {
    const { name, value } = event.target as HTMLInputElement;
    const newValidationMessage = VALIDATION[name]
      .filter((eachCondition) => !eachCondition.validateFunction(value))
      .map((eachCondition) => eachCondition.name)
      .join(', ');
    setCheckMessage({ ...checkMessage, [name]: newValidationMessage });
    setUserInfo({ ...userInfo, [name]: value });
  };

  // 로그인 가능 여부 확인 함수
  const isLoginAvailable = useMemo(() => {
    const keyOfConditions: string[] = Object.keys(checkMessage);
    return keyOfConditions.every((key: string) => {
      return checkMessage[key].length === 0 && userInfo[key].length > 0;
    });
  }, [checkMessage, userInfo]);

  // 로그인 클릭 시 처리 함수
  const handleLogin = async () => {
    try {
      const response = await membersAPI.login(userInfo);
      if (response.status === 200) {
        LocalStorage.setItem('access', response.headers.access);
        try {
          const memberInfo = await membersAPI.getUserInfo();
          const {
            username,
            nickname,
            id,
            steamId,
            name,
            email,
            imagePath,
            loginType,
          } = memberInfo.data as UserInfo;
          setLoginUserState({
            username,
            nickname,
            id,
            steamId,
            name,
            email,
            imagePath,
            loginType,
          });
          if (typeof window !== undefined) {
            window.location.reload();
          }
        } catch (error) {
          handleAxiosError(error);
        }
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        //
      }
    }
  };

  // 스팀 로그인 처리 함수
  const handleSteamLogin = async (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    event.preventDefault();
    const steamLoginForm = document.getElementById(
      'steamLoginForm'
    ) as HTMLFormElement;

    const realm = document.createElement('input');
    realm.setAttribute('name', 'openid.realm');
    realm.setAttribute('value', process.env.NEXT_PUBLIC_API_URL);

    const returnTo = document.createElement('input');
    returnTo.setAttribute('name', 'openid.return_to');
    returnTo.setAttribute(
      'value',
      `${process.env.NEXT_PUBLIC_API_URL}/api/members/steam/login/redirect?access=${encodeURIComponent(LocalStorage.getItem('access'))}`
    );

    steamLoginForm.appendChild(realm);
    steamLoginForm.appendChild(returnTo);

    steamLoginForm.submit();
  };

  // 네이버 로그인 처리 함수
  const handleNaverLoginClick = () => {
    router.push(
      `${process.env.NEXT_PUBLIC_API_URL}/oauth2/authorization/naver`
    );
  };

  // 구글 로그인 처리 함수
  const handleGoogleLoginClick = () => {
    router.push(
      `${process.env.NEXT_PUBLIC_API_URL}/oauth2/authorization/google`
    );
  };

  return (
    <div className="w-full">
      {/* 스팀 로그인 폼 */}
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
      <div className="w-screen h-dvh fixed bg-black bg-opacity-50 top-0 left-0 z-10" />
      <RouterModal title="로그인">
        <div className="w-96 flex flex-col items-center justify-center gap-y-5 mx-auto p-6">
          {/* 로고 */}
          <Image
            src="/svgs/symbol.svg"
            alt="logo on login modal"
            width={64}
            height={64}
          />
          {/* 아이디 입력창 */}
          <div className="w-full">
            <label className="font-bold block mb-3" htmlFor="username">
              아이디
            </label>
            <input
              type="text"
              id="username"
              name="username"
              placeholder="아이디를 입력해주세요"
              className="w-full p-3 border border-blueGray rounded text-sm autofill:transition-colors autofill:shadow-disabled outline-none focus:border-primary focus:border-2"
              onChange={handleInput}
            />
            <p className="text-second text-xs pt-1 break-keep">
              {checkMessage.username}
            </p>
          </div>
          {/* 비밀번호 입력창 */}
          <div className="w-full">
            <label className="font-bold block mb-3" htmlFor="password">
              비밀번호
            </label>
            <div className="w-full relative">
              <input
                type={isPasswordVisible ? 'text' : 'password'}
                id="password"
                name="password"
                placeholder="비밀번호를 입력해주세요"
                className="w-full p-3 border border-blueGray rounded text-sm autofill:transition-colors autofill:shadow-disabled outline-none focus:border-primary focus:border-2"
                onChange={handleInput}
              />
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
              <p className="text-second text-xs pt-1 break-keep">
                {checkMessage.password}
              </p>
            </div>
          </div>
          <div className="w-full flex flex-col gap-y-4">
            {/* 일반 로그인 버튼 */}
            <button
              type="button"
              className="w-full bg-primary text-sm font-bold text-white rounded-xl py-4 whitespace-nowrap disabled:bg-disable disabled:cursor-not-allowed"
              disabled={!isLoginAvailable}
              onClick={handleLogin}
            >
              로그인
            </button>
            {/* 스팀 로그인 버튼 */}
            <button
              type="button"
              className="w-full bg-gradient-to-br to-steamGradientTo via-steamGradientVia from-steamGradientFrom bg-clip-text text-sm font-bold border-1 border-lightBlue rounded-xl py-3 flex flex-row justify-center items-center gap-x-2.5"
              onClick={handleSteamLogin}
            >
              <Image
                src="/image/steam.png"
                alt="steam logo on login modal"
                width={24}
                height={24}
              />
              스팀으로 로그인하기
            </button>
            {/* 구글 로그인 버튼 */}
            <button
              type="button"
              className="w-full text-sm text-blueBlack font-bold border-1 border-lightBlue rounded-xl py-3 flex flex-row justify-center items-center gap-x-2.5"
              onClick={handleGoogleLoginClick}
            >
              <Image
                src="/svgs/google_logo.svg"
                alt="google logo on login modal"
                width={24}
                height={24}
              />
              구글로 로그인하기
            </button>
            {/* 네이버 로그인 버튼 */}
            <button
              type="button"
              className="w-full text-sm text-white font-bold border-1 border-naver bg-naver rounded-xl py-3 flex flex-row justify-center items-center gap-x-2.5"
              onClick={handleNaverLoginClick}
            >
              <Image
                src="/image/naver.png"
                alt="naver logo on login modal"
                width={24}
                height={24}
              />
              네이버로 로그인하기
            </button>
          </div>
        </div>
      </RouterModal>
    </div>
  );
}
