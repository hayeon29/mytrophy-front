type GetGameDetailDTO = {
  id: number;
  name: string;
  description: string;
  developer: string;
  publisher: string;
  requirement: string;
  price: number | null;
  releaseDate: string; // 또는 Date 형식으로 변환해서 사용
  recommendation: number;
  positive: string; // 또는 Positive 열거형으로 변환해서 사용
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

type GetTopGameDTO = {
  id: number;
  name: string;
  description: string;
  developer: string;
  publisher: string;
  requirement: string;
  price: number | null;
  releaseDate: string; // 또는 Date 형식으로 변환해서 사용
  recommendation: number;
  positive: string; // 또는 Positive 열거형으로 변환해서 사용
  headerImagePath: string;
  koIsPossible: boolean;
  enIsPossible: boolean;
  jpIsPossible: boolean;
  getGameCategoryDTOList: GetGameCategoryDTO[];
  getGameScreenshotDTOList: GetGameScreenshotDTO[];
  getGameAchievementDTOList: GetGameAchievementDTO[];
  rank: number;
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
};
