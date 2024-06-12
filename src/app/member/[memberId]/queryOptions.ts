import gameAPI from '@/services/game';
import membersAPI from '@/services/members';

const queryKeys = {
  game: (id: string) => ['member_games', id] as const,
  achievement: (id: string, appId: string) =>
    ['member_achievement', id, appId] as const,
  gameDetail: (appId: string) => ['game_detail', appId] as const,
};

const queryOptions = {
  game: (id: string) => ({
    queryKey: queryKeys.game(id),
    queryFn: () => {
      if (id === undefined) {
        return Promise.resolve({});
      }
      return membersAPI.getUserGame(id);
    },
    select: (data) => data.data.response,
  }),
  achievement: (id: string, appId?: string) => ({
    queryKey: queryKeys.achievement(id, appId),
    queryFn: () => {
      if (appId === undefined) {
        return Promise.resolve({});
      }
      return membersAPI.getUserGameAchievement(id, appId);
    },
    enabled: appId !== undefined,
  }),
  gameDetail: (appId?: string) => ({
    queryKey: queryKeys.gameDetail(appId),
    queryFn: () => {
      if (appId === null) {
        return Promise.resolve({});
      }
      return gameAPI.getGameDetail(appId);
    },
    enabled: appId !== undefined,
  }),
};

export default queryOptions;
