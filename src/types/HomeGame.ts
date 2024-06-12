export type HomeGame = {
  id: number;
  appId: number;
  name: string;
  headerImagePath: string;
  getGameCategoryDTOList: { id: number; name: string }[];
  price: number;
  koIsPossible: boolean;
  positive: string;
};
