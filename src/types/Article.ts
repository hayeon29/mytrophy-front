type ArticleType = {
  id: number;
  header: string;
  name: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  imagePath?: string;
  cntUp: number;
  appId: number;
  memberId: number;
  username: string;
  nickname: string;
  memberImage?: string;
  comments: string[];
  commentCount: number;
};

type ArticleListType = {
  content: Array<ArticleType>;
  empty: boolean;
  first: boolean;
  last: boolean;
  number: number;
  numberOfElements: number;
  size: number;
  totalElements: number;
  totalPages: number;
};

export type { ArticleType, ArticleListType };
