'use client';

import clsx from 'clsx';
import VALIDATION from '@/constants/validation';
import Image from 'next/image';
import { FormEvent, useMemo, useState } from 'react';
import { UserSignUpInfo, UserAdditionalSignUpInfo } from '@/types/SignUpInfo';
import membersAPI from '@/services/members';
import { useModal } from '@/hooks/useModal';
import { useRouter } from 'next/navigation';
import OkModal from '@/components/modals/OkModal';
import LocalStorage from '@/constants/LocalStorage';
import { UserInfo } from '@/types/UserInfo';
import { useSetRecoilState } from 'recoil';
import { userState } from '@/recoils/userAtom';
import { AxiosError } from 'axios';
import { handleAxiosError } from '@/utils/handleAxiosError';

export default function SignUp() {
  const router = useRouter();

  const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false);
  const [isCheckPasswordVisible, setIsCheckPasswordVisible] =
    useState<boolean>(false);
  const [isUsernameExistChecked, setIsUsernameExistChecked] =
    useState<boolean>(false);
  const { openModal, modals, closeModal } = useModal();
  const setLoginUserState = useSetRecoilState(userState);

  const [userInfo, setUserInfo] = useState<UserAdditionalSignUpInfo>({
    username: '',
    password: '',
    checkPassword: '',
    name: '',
    nickname: '',
    email: '',
  });

  const [checkMessage, setCheckMessage] = useState<UserSignUpInfo>({
    username: '',
    password: '',
    checkPassword: '',
    email: '',
  });

  const isSignUpAvailable = useMemo(() => {
    const keyOfConditions: string[] = Object.keys(checkMessage);
    return keyOfConditions.every((key: string) => {
      if (key === 'email') {
        return VALIDATION.email[0].validateFunction(userInfo.email);
      }
      return checkMessage[key].length === 0 && userInfo[key].length > 0;
    });
  }, [checkMessage, userInfo]);

  const handleUserExistClick = async () => {
    try {
      const isMemberExist = await membersAPI
        .isMemberExist(userInfo.username)
        .then((response) => response.data);
      if (isMemberExist) {
        openModal(
          <OkModal message="중복된 아이디입니다." onClick={closeModal} />
        );
        setCheckMessage({ ...checkMessage, username: '아이디가 중복됩니다.' });
      } else {
        openModal(
          <OkModal message="사용 가능한 아이디입니다." onClick={closeModal} />
        );
        setIsUsernameExistChecked(true);
      }
    } catch (error) {
      // 에러 메시지 모달창 출력
    }
  };

  const handleSignUpClick = async () => {
    try {
      const response = await membersAPI.signUp(userInfo);
      if (response.status === 201) {
        try {
          const loginResponse = await membersAPI.login({
            username: userInfo.username,
            password: userInfo.password,
          });
          if (loginResponse.status === 200) {
            LocalStorage.setItem('access', loginResponse.headers.access);
            openModal(
              <OkModal
                title="로그인 결과"
                message="로그인에 성공했습니다."
                onClick={closeModal}
              />
            );
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
            router.refresh();
          }
        } catch (error) {
          if (error instanceof AxiosError) {
            openModal(
              <OkModal
                title="로그인 결과"
                message="로그인에 실패했습니다."
                onClick={closeModal}
              />
            );
          }
        }
        openModal(
          <OkModal
            message="회원가입이 성공하였습니다."
            onClick={() => {
              closeModal();
              router.push('/select-category');
            }}
          />
        );
      } else {
        openModal(
          <OkModal message="회원가입이 실패하였습니다." onClick={closeModal} />
        );
      }
    } catch (error) {
      handleAxiosError(error);
    }
  };

  const handleInput = (event: FormEvent<HTMLInputElement>) => {
    const { name, value } = event.target as HTMLInputElement;
    if (VALIDATION[name] !== undefined) {
      const newValidationMessage = VALIDATION[name]
        .filter((eachCondition) => !eachCondition.validateFunction(value))
        .map((eachCondition) => eachCondition.name)
        .join(', ');
      setCheckMessage({ ...checkMessage, [name]: newValidationMessage });
    } else if (name === 'checkPassword') {
      if (value !== userInfo.password) {
        setCheckMessage({ ...checkMessage, checkPassword: '비밀번호  불일치' });
      } else {
        setCheckMessage({ ...checkMessage, checkPassword: '' });
      }
    }
    setUserInfo({ ...userInfo, [name]: value });
  };

  const handlePasswordCheck = () => {
    setIsPasswordVisible((prev) => !prev);
  };

  const handleCheckPasswordCheck = () => {
    setIsCheckPasswordVisible((prev) => !prev);
  };

  const inputClassName: string = clsx(
    `w-full p-3 border border-gray rounded text-xs autofill:transition-colors autofill:shadow-disabled outline-none focus:border-primary focus:border-2`
  );

  const buttonClassName: string = clsx(
    `bg-primary rounded text-white py-3 px-[10px] text-xs whitespace-nowrap disabled:bg-disable disabled:cursor-not-allowed`
  );

  return (
    <>
      {modals.map(({ component, id }) => {
        return <div key={id}>{component}</div>;
      })}
      <div className="w-screen min-h-dvh bg-gradient-to-br from-primary to-second flex items-center justify-center">
        <div className="bg-white rounded-3xl py-6 px-32 z-10 flex flex-col items-center max-w-[535px] ">
          <Image
            src="/svgs/logo.svg"
            alt="my trophy logo"
            width={64}
            height={64}
            priority
            className="w-16 h-16"
          />
          <form className="pb-2 w-full">
            <label
              className="font-black text-sm pb-2 inline-block"
              htmlFor="username"
            >
              아이디
              <span className="text-secondary"> *</span>
            </label>
            <div className="flex justify-between gap-x-2">
              <input
                type="text"
                className={`${inputClassName} ${checkMessage.username.length > 0 && '!border-second'}`}
                placeholder="아이디를 입력해주세요."
                name="username"
                id="username"
                maxLength={12}
                onChange={handleInput}
              />
              <button
                type="button"
                className={buttonClassName}
                onClick={handleUserExistClick}
                disabled={
                  userInfo.username.length === 0 ||
                  checkMessage.username.length > 0 ||
                  isUsernameExistChecked
                }
              >
                아이디 확인
              </button>
            </div>
            <p className="text-second text-xs pt-1 break-keep">
              {checkMessage.username}
            </p>
          </form>
          <div className="pb-2 w-full">
            <label
              className="font-black text-sm pb-2 inline-block"
              htmlFor="password"
            >
              비밀번호
              <span className="text-secondary"> *</span>
            </label>
            <div className="flex justify-between gap-x-2 relative ">
              <input
                type={isPasswordVisible ? 'text' : 'password'}
                className={`${inputClassName} ${checkMessage.password.length > 0 && '!border-second'}`}
                placeholder="비밀번호를 입력해주세요."
                name="password"
                id="password"
                onInput={handleInput}
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
            </div>
            <p className="text-second text-xs pt-1 break-keep">
              {checkMessage.password.length > 0 && checkMessage.password}
            </p>
          </div>
          <div className="pb-2 w-full">
            <label
              className="font-black text-sm pb-2 inline-block"
              htmlFor="checkPassword"
            >
              비밀번호 확인
              <span className="text-secondary"> *</span>
            </label>
            <div className="flex justify-between gap-x-2 relative ">
              <input
                type={isCheckPasswordVisible ? 'text' : 'password'}
                className={`${inputClassName} ${checkMessage.checkPassword.length > 0 && '!border-second'}`}
                placeholder="비밀번호를 다시 한 번 입력해주세요."
                name="checkPassword"
                id="checkPassword"
                onInput={handleInput}
              />
              <Image
                src="/svgs/visibility_24dp.svg"
                alt="password check visibility icon"
                width={28}
                height={24}
                className=" absolute top-2/4 right-3 translate-y-[-50%] cursor-pointer w-7 h-6"
                onClick={handleCheckPasswordCheck}
              />
            </div>
            <p className="text-second text-xs pt-1 break-keep">
              {checkMessage.checkPassword}
            </p>
          </div>
          <div className="pb-2 w-full">
            <label
              className="font-black text-sm pb-2 inline-block"
              htmlFor="name"
            >
              이름
            </label>
            <div className="flex justify-between gap-x-2 relative ">
              <input
                type="text"
                className={inputClassName}
                placeholder="이름을 입력해주세요."
                name="name"
                id="name"
                onInput={handleInput}
              />
            </div>
          </div>
          <div className="pb-2 w-full">
            <label
              className="font-black text-sm pb-2 inline-block"
              htmlFor="nickname"
            >
              닉네임
            </label>
            <div className="flex justify-between gap-x-2 relative ">
              <input
                type="text"
                className={inputClassName}
                placeholder="닉네임을 입력해주세요."
                name="nickname"
                id="nickname"
                onInput={handleInput}
              />
            </div>
          </div>
          <div className="pb-2 w-full">
            <label
              className="font-black text-sm pb-2 inline-block"
              htmlFor="email"
            >
              이메일
            </label>
            <div className="flex justify-between gap-x-2 relative ">
              <input
                type="email"
                className={`${inputClassName} ${checkMessage.email.length > 0 && '!border-second'}`}
                placeholder="이메일을 입력해주세요."
                name="email"
                id="email"
                onInput={handleInput}
              />
            </div>
            <p className="text-second text-xs pt-1 break-keep">
              {checkMessage.email}
            </p>
          </div>
          <button
            type="button"
            className={`w-full ${buttonClassName}`}
            onClick={handleSignUpClick}
            disabled={!isSignUpAvailable || !isUsernameExistChecked}
          >
            회원가입
          </button>
        </div>
      </div>
    </>
  );
}
