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
  comments: CommentType[];
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

type CommentType = {
  id: number;
  content: string;
  memberId: number;
  articleId: number;
  likes: number;
  parentCommentId?: number;
  createdAt: Date;
  updatedAt: Date;
  imagePath?: string;
  nickname: string;
};

export type { ArticleType, ArticleListType, CommentType };
