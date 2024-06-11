type GetGameDetailDTO = {
  id: number;
  name: string;
  description: string;
  developer: string;
  publisher: string;
  requirement: string;
  price: number | null;
  releaseDate: string;
  recommendation: number;
  positive: string;
  headerImagePath: string;
  koIsPossible: boolean;
  enIsPossible: boolean;
  jpIsPossible: boolean;
  getGameCategoryDTOList: GetGameCategoryDTO[];
  getGameScreenshotDTOList: GetGameScreenshotDTO[];
  getGameAchievementDTOList: GetGameAchievementDTO[];
};

type GetGameCategoryDTO = {
  id: number;
  name: string;
};

type GetGameAchievementDTO = {
  id: number;
  name: string;
  imagePath: string;
  hidden: boolean;
  description: string;
};

type GetGameScreenshotDTO = {
  id: number;
  thumbnailImagePath: string;
  fullImagePath: string;
};

type GameArticleDTO = {
  id: number;
  nickname: string;
  header: string;
  name: string;
  content: string;
  imagePath: string | null;
  appId: number;
  memberId: number;
  username: string;
  comments: string[];
  commentCount: number;
};

type GetGamePlayerNumberDTO = {
  playerNumber: string;
};

export type {
  GetGameAchievementDTO,
  GetGameCategoryDTO,
  GetGameDetailDTO,
  GetGamePlayerNumberDTO,
  GetGameScreenshotDTO,
  GameArticleDTO,
};
