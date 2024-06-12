type UserInfo = {
  [index: string]: string;
  username: string;
  id: string;
  nickname: null | string;
  steamId: null | string;
  imagePath: null | string;
};

type UserGameInfo = {
  [index: string]: number;
  appid: number;
  playtime_forever: number;
};

type UserAllGameInfo = {
  game_count: number;
  games: UserGameInfo[];
};

type UserGameAchievementDataInfo = {
  apiname: string;
  achieved: number;
  unlocktime: number;
};

type PlayerStats = {
  steamId: string;
  gameName: string;
  achievements: UserGameAchievementDataInfo[];
  success: boolean;
};

type UserGameAchievementDataList = {
  data: {
    playerstats: PlayerStats;
  };
};

type AchievementInfo = {
  name: string;
  description: string;
  imagePath: string;
  achieved: boolean;
  unlockTime: string;
};

type UserGameAchievementList = {
  name: string;
  imagePath: string;
  achievements: AchievementInfo[];
};

export type {
  UserInfo,
  UserGameInfo,
  UserAllGameInfo,
  UserGameAchievementDataInfo,
  UserGameAchievementDataList,
  AchievementInfo,
  UserGameAchievementList,
};
