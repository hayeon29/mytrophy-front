type AuthCondition = {
  name: string;
  validateFunction: (message: string) => boolean;
};

export type { AuthCondition };
