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

type UserGameAchievementInfo = {
  apiname: string;
  achieved: number;
  unlocktime: number;
};

type PlayerStats = {
  steamId: string;
  gameName: string;
  achievements: UserGameAchievementInfo[];
  success: boolean;
};

type UserGameAchievementList = {
  data: {
    playerstats: PlayerStats;
  };
};

export type {
  UserInfo,
  UserGameInfo,
  UserAllGameInfo,
  UserGameAchievementInfo,
  UserGameAchievementList,
};
