import { useQueries, useQuery, UseQueryResult } from '@tanstack/react-query';
import { UserGameInfo, UserInfo } from '@/types/UserInfo';
import queryOptions from './queryOptions';

export function useMemberGameQuery(id: string) {
  return useQuery(queryOptions.game(id));
}

export function useMemberGameAchievementQueries(
  id: string,
  gameInfo: UserGameInfo[]
) {
  const queries =
    gameInfo !== undefined && id !== undefined
      ? gameInfo.map(({ appid }) => {
          return queryOptions.achievement(id, appid.toString());
        })
      : [queryOptions.achievement(id)];

  return useQueries({ queries });
}

export function useGameDetail(arrayOfAppId: UserGameInfo[]) {
  const queries =
    arrayOfAppId !== undefined
      ? arrayOfAppId.map(({ appid }) => {
          return queryOptions.gameDetail(appid.toString());
        })
      : [queryOptions.gameDetail()];
  return useQueries({ queries });
}

export function useUserInfo(): UseQueryResult<UserInfo, Error> {
  return useQuery(queryOptions.userInfo());
}
