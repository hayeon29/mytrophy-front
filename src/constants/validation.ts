import { AuthCondition } from '@/types/AuthCondition';

const Validation: { [key: string]: Array<AuthCondition> } = {
  id: [
    {
      name: '첫 글자 숫자 제외, 6자 이상 12자 이하',
      validateFunction: (message: string) => {
        return /^[a-z][a-z0-9]{5,11}$/i.test(message);
      },
    },
  ],
  password: [
    {
      name: '영문자 포함',
      validateFunction: (message: string) => {
        return /(?=.*[a-zA-Z])/.test(message);
      },
    },
    {
      name: '숫자 포함',
      validateFunction: (message: string) => {
        return /(?=.*[0-9])/.test(message);
      },
    },
    {
      name: '특수문자 포함',
      validateFunction: (message: string) => {
        return /(?=.*[!@#$%^&*?_])/.test(message);
      },
    },
    {
      name: '8자 이상',
      validateFunction: (message: string) => {
        return message.length >= 8;
      },
    },
  ],
  email: [
    {
      name: '이메일 형식에 맞지 않습니다.',
      validateFunction: (message: string) => {
        return /^$|[a-z0-9]+@[a-z]+\.[a-z]{2,3}/.test(message);
      },
    },
  ],
};

export default Validation;
