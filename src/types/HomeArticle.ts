export interface HomeArticle {
    id: number;
    header: string;
    name: string;
    content: string;
    imagePath: string | null;
    appId: number;
    memberId: number;
    username: string;
    comments: string[];
    commentCount: number;
  }
  