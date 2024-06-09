export interface HomeArticle {
  id: number;
  header: string;
  name: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  imagePath: string | null;
  cntUp: number;
  appId: number;
  memberId: number;
  username: string;
  nickname: string;
  memberImage: string | null;
  comments: string[];
  commentCount: number;
}
