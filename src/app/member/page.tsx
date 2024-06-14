'use client';

import UserArticle from '@/components/mypage/UserArticle';
import UserGameAchievement from '@/components/mypage/UserGameAchievement';
import UserGameRating from '@/components/mypage/UserGameRating';
import UserRecommend from '@/components/mypage/UserRecommend';
import articleAPI from '@/services/article';
import { Button, Card, CardBody, CardHeader } from '@nextui-org/react';
import Image from 'next/image';
import { useEffect, useMemo, useState } from 'react';
import {
  AchievementInfo,
  UserGameAchievementDataInfo,
  UserGameAchievementDataList,
  UserGameAchievementList,
} from '@/types/UserInfo';
import { GetGameDetailDTO } from '@/types/GameDetail';
import dayjs from 'dayjs';
import { useModal } from '@/hooks/useModal';
import ProfileEdit from '@/components/modals/ProfileEdit';
import PageSelectButton from '@/components/common/PageSelectButton';
import {
  useGameDetail,
  useMemberGameAchievementQueries,
  useMemberGameQuery,
  useUserInfo,
} from './queries';
import withAuth from '../PrivateRoute';

function MyPage() {
  const [selectedTab, setSelectedTab] = useState(0);
  const [isMounted, setIsMounted] = useState(false);
  const { modals, openModal, closeModal } = useModal();
  const [totalArticles, setTotalArticles] = useState(0);
  const [totalMyArticles, setTotalMyArticles] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  const { data: userInfo, isLoading: userInfoLoading } = useUserInfo();

  const handleClickTab = (event: React.MouseEvent<HTMLDivElement>) => {
    const eventTarget = event.target;
    if (eventTarget instanceof HTMLSpanElement) {
      setSelectedTab(Number(eventTarget.ariaValueText));
    }
  };

  const { data: memberGame, isLoading: memberGameLoading } = useMemberGameQuery(
    userInfo?.id
  );

  const gameDetailInfo = useGameDetail(memberGame?.games)?.map(({ data }) => {
    return data;
  }) as GetGameDetailDTO[];

  const memberGameAchievementData = useMemberGameAchievementQueries(
    userInfo?.id,
    memberGame?.games
  )?.map(({ data }) => {
    if (data !== undefined) {
      const achievementData = data as UserGameAchievementDataList;
      return achievementData.data.playerstats.achievements;
    }
    return data;
  }) as UserGameAchievementDataInfo[][];

  const memberGameAchievement = gameDetailInfo
    .map((eachDetail, index) => {
      if (
        eachDetail !== undefined &&
        memberGameAchievementData[index] !== undefined
      ) {
        return {
          name: eachDetail.name,
          imagePath: eachDetail.headerImagePath,
          achievements: gameDetailInfo[index].getGameAchievementDTOList.map(
            (eachAchievement, eachAchievementIndex) => {
              const { name, description, imagePath } = eachAchievement;
              return {
                name,
                description,
                imagePath,
                achieved:
                  memberGameAchievementData[index][eachAchievementIndex]
                    .achieved === 1,
                unlockTime: dayjs(
                  memberGameAchievementData[index][eachAchievementIndex]
                    .unlocktime * 1000
                ).format('YYYY년 MM월 DD일'),
              };
            }
          ) as AchievementInfo[],
        } as UserGameAchievementList;
      }
      return undefined;
    })
    .filter((value) => {
      return value !== undefined;
    });

  const totalGameCount = useMemo(() => {
    return memberGameAchievement.reduce(
      (prev, cur) => prev + cur.achievements.length,
      0
    );
  }, [memberGameAchievement]);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      if (userInfo === undefined) {
        setTotalArticles(0);
        setTotalMyArticles(0);
      } else {
        const likedResponse = await articleAPI.getLikedArticlesByMemberId(
          userInfo?.id,
          currentPage - 1,
          10
        );
        const likedCount = likedResponse.content.length;
        setTotalArticles(likedCount);

        const myArticlesResponse = await articleAPI.getArticleList(
          currentPage - 1,
          10,
          userInfo?.id
        );
        const myArticlesCount = myArticlesResponse.content.length;
        setTotalMyArticles(myArticlesCount);
      }
    };
    fetchData();
  }, [currentPage, userInfo]);

  const handleProfileEdit = () => {
    openModal(<ProfileEdit onClick={closeModal} />);
  };

  const handleSteamLogin = async (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    event.preventDefault();
    const steamLoginForm = document.getElementById(
      'steamLoginForm'
    ) as HTMLFormElement;

    const realm = document.createElement('input');
    realm.setAttribute('name', 'openid.realm');
    realm.setAttribute('value', process.env.NEXT_PUBLIC_API_URL);

    const returnTo = document.createElement('input');
    returnTo.setAttribute('name', 'openid.return_to');
    returnTo.setAttribute(
      'value',
      `${process.env.NEXT_PUBLIC_API_URL}/api/members/steam/login/redirect?access=${encodeURIComponent(localStorage.getItem('access'))}`
    );

    steamLoginForm.appendChild(realm);
    steamLoginForm.appendChild(returnTo);

    steamLoginForm.submit();
  };

  return (
    <>
      {modals.length > 0 &&
        modals.map(({ component, id }) => {
          return <div key={id}>{component}</div>;
        })}
      {!userInfoLoading && userInfo !== undefined && isMounted && (
        <div className="p-6 max-w-[1216px] m-auto flex flex-col gap-8">
          <form
            id="steamLoginForm"
            action="https://steamcommunity.com/openid/login"
            method="post"
            className="hidden"
          >
            <input
              type="hidden"
              name="openid.identity"
              value="http://specs.openid.net/auth/2.0/identifier_select"
            />
            <input
              type="hidden"
              name="openid.claimed_id"
              value="http://specs.openid.net/auth/2.0/identifier_select"
            />
            <input
              type="hidden"
              name="openid.ns"
              value="http://specs.openid.net/auth/2.0"
            />
            <input type="hidden" name="openid.mode" value="checkid_setup" />
            <input
              type="image"
              name="submit"
              src="https://steamcdn-a.akamaihd.net/steamcommunity/public/images/steamworks_docs/brazilian/sits_small.png"
              alt="Submit"
            />
          </form>
          <Card className="p-6 shadow-none border-1 border-primary flex flex-row">
            <CardHeader className="flex flex-col w-fit border-primary border-r-1 rounded-none pr-16 pl-8">
              {isMounted && (
                <Image
                  src={
                    userInfo.imagePath !== null &&
                    userInfo.imagePath !== undefined
                      ? userInfo.imagePath
                      : '/svgs/person.svg'
                  }
                  alt="mypage user profile"
                  width={128}
                  height={128}
                  style={{ width: 128, height: 128 }}
                  priority
                  className="bg-lightGray rounded-full"
                />
              )}
              <span className="text-black font-black mt-3 mb-8">
                {userInfo !== null &&
                userInfo !== undefined &&
                userInfo.nickname?.length > 0 &&
                isMounted
                  ? userInfo.nickname
                  : '유저'}
              </span>
              <Button
                color="primary"
                className="text-white"
                onClick={handleProfileEdit}
              >
                프로필 수정
              </Button>
            </CardHeader>
            <CardBody
              className="text-primary grid grid-cols-4 items-center justify-center"
              onClick={handleClickTab}
            >
              {userInfo.steamId === null && isMounted && (
                <div className="col-span-2 gap-y-8 flex flex-col justify-center">
                  <p className="text-sm text-black font-bold text-center">
                    스팀 계정 연동이 필요합니다.
                  </p>
                  <Button
                    className="bg-gradient-to-br from-steamGradientFrom via-steamGradientVia to-steamGradientTo rounded-xl w-full py-4 text-white text-sm font-bold"
                    size="lg"
                    onClick={(event) => handleSteamLogin(event)}
                    startContent={
                      <Image
                        src="/svgs/steam_logo.svg"
                        alt="steam logo on login"
                        width={24}
                        height={24}
                      />
                    }
                  >
                    스팀 계정 연동하기
                  </Button>
                </div>
              )}
              {userInfo.steamId !== null && isMounted && (
                <>
                  <div
                    className={`flex flex-col items-center cursor-pointer  ${selectedTab === 0 ? '!text-secondary' : ''}`}
                  >
                    <span
                      className="text-5xl font-bold mb-2 "
                      aria-valuetext="0"
                    >
                      {memberGame &&
                      !memberGameLoading &&
                      isMounted &&
                      memberGame.game_count !== undefined
                        ? memberGame.game_count
                        : 0}
                    </span>
                    <span
                      className={selectedTab !== 0 ? 'text-black' : ''}
                      aria-valuetext="0"
                    >
                      보유 게임 수
                    </span>
                  </div>
                  <div
                    className={`flex flex-col items-center cursor-pointer ${selectedTab === 1 ? '!text-secondary' : ''}`}
                  >
                    <span
                      className="text-5xl font-bold mb-2"
                      aria-valuetext="1"
                    >
                      {memberGame && !memberGameLoading && isMounted
                        ? totalGameCount
                        : 0}
                    </span>
                    <span
                      className={selectedTab !== 1 ? 'text-black' : ''}
                      aria-valuetext="1"
                    >
                      달성 업적 수
                    </span>
                  </div>
                </>
              )}

              <div
                className={`flex flex-col items-center cursor-pointer ${selectedTab === 2 ? '!text-secondary' : ''}`}
              >
                <span className="text-5xl font-bold mb-2" aria-valuetext="2">
                  {userInfo ? totalMyArticles : 0}
                </span>
                <span
                  className={selectedTab !== 2 ? 'text-black' : ''}
                  aria-valuetext="2"
                >
                  게시글
                </span>
              </div>
              <div
                className={`flex flex-col items-center cursor-pointer ${selectedTab === 3 ? '!text-secondary' : ''}`}
              >
                <span className="text-5xl font-bold mb-2" aria-valuetext="3">
                  {userInfo ? totalArticles : 0}
                </span>
                <span
                  className={selectedTab !== 3 ? 'text-black' : ''}
                  aria-valuetext="3"
                >
                  추천수
                </span>
              </div>
            </CardBody>
          </Card>
          {selectedTab === 0 &&
            userInfo.steamId !== null &&
            memberGame !== undefined &&
            isMounted && (
              <UserGameRating
                gameInfo={gameDetailInfo}
                userGameInfo={memberGame}
                isLoading={memberGameLoading}
              />
            )}
          {selectedTab === 1 && userInfo.steamId !== null && isMounted && (
            <UserGameAchievement
              achievement={memberGameAchievement}
              totalCount={totalGameCount !== undefined ? totalGameCount : 0}
            />
          )}
          {selectedTab === 2 && <UserArticle />}
          {selectedTab === 3 && <UserRecommend />}
          {selectedTab !== 0 && (
            <PageSelectButton
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
            />
          )}
        </div>
      )}
    </>
  );
}

export default withAuth(MyPage);
