export type HomeGame = {
  id: number;
  name: string;
  headerImagePath: string;
  getGameCategoryDTOList: { id: number; name: string }[];
  price: number;
  koIsPosible: boolean;
};
