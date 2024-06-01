'use client';

import Validation from '@/constants/validation';
import Image from 'next/image';
import { FormEvent, useMemo, useState } from 'react';
import { UserSignUpInfo, UserAdditionalSignUpInfo } from '@/types/SignUpInfo';

export default function SignUp() {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [checkPasswordVisible, setCheckPasswordVisible] = useState(false);

  const [userInfo, setUserInfo] = useState<UserAdditionalSignUpInfo>({
    id: '',
    password: '',
    checkPassword: '',
    name: '',
    nickname: '',
    email: '',
  });

  const [checkMessage, setCheckMessage] = useState<UserSignUpInfo>({
    id: '',
    password: '',
    checkPassword: '',
    email: '',
  });

  const handleInput = (event: FormEvent<HTMLInputElement>): void => {
    const { name, value } = event.target as HTMLInputElement;
    if (Validation[name] !== undefined) {
      const newValidationMessage = Validation[name]
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

  const isSignUpAvailable = useMemo(() => {
    const keyOfConditions: string[] = Object.keys(checkMessage);
    return keyOfConditions.every((key: string) => {
      if (key === 'email') {
        return Validation.email[0].validateFunction(userInfo.email);
      }
      return checkMessage[key].length === 0 && userInfo[key].length > 0;
    });
  }, [checkMessage, userInfo]);

  return (
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
          <label className="font-black text-sm pb-2 inline-block" htmlFor="id">
            아이디
          </label>
          <div className="flex justify-between gap-x-2">
            <input
              type="text"
              className={`w-full p-3 border border-gray rounded text-xs autofill:transition-colors autofill:shadow-disabled outline-none focus:border-primary focus:border-2 ${checkMessage.id.length > 0 && '!border-second'}`}
              placeholder="아이디를 입력해주세요."
              name="id"
              id="id"
              maxLength={12}
              onInput={handleInput}
            />
            <button
              type="button"
              className={`bg-primary rounded text-white py-3 px-[10px] text-xs whitespace-nowrap ${(userInfo.id.length === 0 || checkMessage.id.length > 0) && '!bg-disable'}`}
            >
              아이디 확인
            </button>
          </div>
          <p className="text-second text-xs pt-1 break-keep">
            {checkMessage.id}
          </p>
        </form>
        <div className="pb-2 w-full">
          <label
            className="font-black text-sm pb-2 inline-block"
            htmlFor="password"
          >
            비밀번호
          </label>
          <div className="flex justify-between gap-x-2 relative ">
            <input
              type={passwordVisible ? 'text' : 'password'}
              className={`w-full p-3 border border-gray rounded text-xs autofill:transition-colors autofill:shadow-disabled outline-none focus:border-primary focus:border-2 ${checkMessage.password.length > 0 && '!border-second'}`}
              placeholder="비밀번호를 입력해주세요."
              name="password"
              id="password"
              onInput={handleInput}
            />
            <Image
              src={
                passwordVisible
                  ? '../svgs/visibility_off_24dp.svg'
                  : '../svgs/visibility_24dp.svg'
              }
              alt="password visibility icon"
              width={28}
              height={24}
              className="absolute top-2/4 right-3 translate-y-[-50%] cursor-pointer w-7 h-6"
              onClick={() => setPasswordVisible((prev) => !prev)}
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
          </label>
          <div className="flex justify-between gap-x-2 relative ">
            <input
              type={checkPasswordVisible ? 'text' : 'password'}
              className={`w-full p-3 border border-gray rounded text-xs autofill:transition-colors autofill:shadow-disabled outline-none focus:border-primary focus:border-2 ${checkMessage.checkPassword.length > 0 && '!border-second'}`}
              placeholder="비밀번호를 다시 한 번 입력해주세요."
              name="checkPassword"
              id="checkPassword"
              onInput={handleInput}
            />
            <Image
              src="../svgs/visibility_24dp.svg"
              alt="password check visibility icon"
              width={28}
              height={24}
              className=" absolute top-2/4 right-3 translate-y-[-50%] cursor-pointer w-7 h-6"
              onClick={() => setCheckPasswordVisible((prev) => !prev)}
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
              className="w-full p-3 border border-gray rounded text-xs autofill:transition-colors autofill:shadow-disabled outline-none focus:border-primary focus:border-2"
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
              className="w-full p-3 border border-gray rounded text-xs autofill:transition-colors autofill:shadow-disabled outline-none focus:border-primary focus:border-2"
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
              className={`w-full p-3 border border-gray rounded text-xs autofill:transition-colors autofill:shadow-disabled outline-none focus:border-primary focus:border-2 ${checkMessage.email.length > 0 && '!border-second'}`}
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
          className={`w-full bg-primary rounded text-white py-3 px-[10px] mt-4 text-xs whitespace-nowrap ${!isSignUpAvailable && '!bg-disable'}`}
        >
          회원가입
        </button>
      </div>
    </div>
  );
}
