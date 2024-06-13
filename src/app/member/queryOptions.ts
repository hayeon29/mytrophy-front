import gameAPI from '@/services/game';
import membersAPI from '@/services/members';
import { UserAllGameInfo } from '@/types/UserInfo';

const queryKeys = {
  userInfo: ['member_info'] as const,
  game: (id: string) => ['member_games', id] as const,
  achievement: (id: string, appId: string) =>
    ['member_achievement', id, appId] as const,
  gameDetail: (appId: string) => ['game_detail', appId] as const,
};

const queryOptions = {
  userInfo: () => ({
    queryKey: queryKeys.userInfo,
    queryFn: () => membersAPI.getUserInfo(),
    select: (data) => data.data,
  }),
  game: (id: string) => ({
    queryKey: queryKeys.game(id),
    queryFn: () => {
      if (id === undefined) {
        return Promise.resolve({});
      }
      return membersAPI.getUserGame(id);
    },
    select: (data) => data.data.response as UserAllGameInfo,
    enabled: id !== null && id !== undefined,
  }),
  achievement: (id: string, appId?: string) => ({
    queryKey: queryKeys.achievement(id, appId),
    queryFn: () => {
      if (appId === undefined) {
        return Promise.resolve({});
      }
      return membersAPI.getUserGameAchievement(id, appId);
    },
    enabled:
      id !== null && id !== undefined && appId !== null && appId !== undefined,
  }),
  gameDetail: (appId?: string) => ({
    queryKey: queryKeys.gameDetail(appId),
    queryFn: () => {
      if (appId === null) {
        return Promise.resolve({});
      }
      return gameAPI.getGameDetail(appId);
    },
    enabled: appId !== null && appId !== undefined,
  }),
};

export default queryOptions;
