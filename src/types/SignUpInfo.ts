type UserSignUpInfo = {
  [index: string]: string;
  username: string;
  password: string;
  checkPassword: string;
};

type UserAdditionalSignUpInfo = UserSignUpInfo & {
  [index: string]: string;
  name: string;
  nickname: string;
  email: string;
};

export type { UserSignUpInfo, UserAdditionalSignUpInfo };
