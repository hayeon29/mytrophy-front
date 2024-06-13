type UserInfo = {
  [index: string]: string;
  username: string;
  id: string;
  loginType: 'mytrophy' | 'naver' | 'steam' | 'google';
  nickname?: null | string;
  name?: null | string;
  email?: null | string;
  steamId?: null | string;
  imagePath?: null | string;
};

type UserEditInfo = {
  username: string;
  nickname?: null | string;
  name?: null | string;
  email?: null | string;
  imagePath?: null | string;
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
  UserEditInfo,
  UserGameInfo,
  UserAllGameInfo,
  UserGameAchievementDataInfo,
  UserGameAchievementDataList,
  AchievementInfo,
  UserGameAchievementList,
};
