'use client';

import PageSelectButton from '@/components/common/PageSelectButton';
import UserArticle from '@/components/mypage/UserArticle';
import UserGameAchievement from '@/components/mypage/UserGameAchievement';
import UserGameRating from '@/components/mypage/UserGameRating';
import UserRecommend from '@/components/mypage/UserRecommend';
import { userState } from '@/recoils/userAtom';
import membersAPI from '@/services/members';
import { Button, Card, CardBody, CardHeader } from '@nextui-org/react';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { UserInfo } from '@/types/UserInfo';
import { AxiosResponse } from '@/types/AxiosResponse';
import { AxiosError } from 'axios';
import { handleAxiosError } from '@/utils/handleAxiosError';
import { useRecoilState } from 'recoil';
import { useGameDetail, useMemberGameQuery } from './queries';

export default function MyPage() {
  const [selectedTab, setSelectedTab] = useState(0);
  const [userInfo, setUserInfo] = useRecoilState(userState);
  const handleClickTab = (event: React.MouseEvent<HTMLDivElement>) => {
    const eventTarget = event.target;
    if (eventTarget instanceof HTMLSpanElement) {
      setSelectedTab(Number(eventTarget.ariaValueText));
    }
  };
  const { data: memberGame, isLoading: memberGameLoading } = useMemberGameQuery(
    userInfo.id
  );

  // const memberGameAchievement = useMemberGameAchievementQueries(
  //   userInfo.id,
  //   memberGame?.games
  // )?.map(({ data }) => {
  //   if (data !== undefined) {
  //     const achievementData = data as UserGameAchievementList;
  //     return achievementData.data.playerstats.achievements;
  //   }
  //   return data;
  // });

  const gameDetailInfo = useGameDetail(memberGame?.games)?.map(({ data }) => {
    return data;
  });

  useEffect(() => {
    async function handleUserInfo() {
      try {
        const newUserInfo = (
          (await membersAPI.getUserInfo()) as AxiosResponse<UserInfo>
        ).data;
        setUserInfo(newUserInfo);
      } catch (error) {
        if (error instanceof AxiosError) {
          handleAxiosError(error);
        }
      }
    }

    handleUserInfo();
  }, [setUserInfo]);

  useEffect(() => {
    async function handleUserInfo() {
      try {
        const newUserInfo = (
          (await membersAPI.getUserInfo()) as AxiosResponse<UserInfo>
        ).data;
        setUserInfo(newUserInfo);
      } catch (error) {
        if (error instanceof AxiosError) {
          handleAxiosError(error);
        }
      }
    }

    handleUserInfo();
  }, [setUserInfo]);

  const handleSteamLogin = async (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    event.preventDefault();
    const steamLoginForm = document.getElementById(
      'steamLoginForm'
    ) as HTMLFormElement;

    const realm = document.createElement('input');
    realm.setAttribute('name', 'openid.realm');
    realm.setAttribute('value', process.env.NEXT_PUBLIC_BACK_URL);

    const returnTo = document.createElement('input');
    returnTo.setAttribute('name', 'openid.return_to');
    returnTo.setAttribute(
      'value',
      `${process.env.NEXT_PUBLIC_BACK_URL}/api/members/steam/login/redirect?access=${encodeURIComponent(localStorage.getItem('access'))}`
    );

    steamLoginForm.appendChild(realm);
    steamLoginForm.appendChild(returnTo);

    steamLoginForm.submit();
  };

  return (
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
          <Image
            src="/image/sample_icon.jpg"
            alt="mypage user profile"
            width={128}
            height={128}
          />
          <span className="text-black font-black mt-3 mb-8">이름</span>
          <Button color="primary" className="text-white">
            프로필 수정
          </Button>
        </CardHeader>
        <CardBody
          className="text-primary grid grid-cols-4 items-center justify-center"
          onClick={handleClickTab}
        >
          {userInfo?.steamId === null ? (
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
                스팀으로 로그인하기
              </Button>
            </div>
          ) : (
            <>
              <div
                className={`flex flex-col items-center cursor-pointer  ${selectedTab === 0 ? '!text-secondary' : ''}`}
              >
                <span className="text-5xl font-bold mb-2 " aria-valuetext="0">
                  {memberGame === undefined || memberGameLoading
                    ? ''
                    : memberGame.game_count}
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
                <span className="text-5xl font-bold mb-2" aria-valuetext="1">
                  1031
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
              12
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
              40
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
      {selectedTab === 0 && (
        <UserGameRating
          gameInfo={gameDetailInfo}
          userGameInfo={memberGame}
          isLoading={memberGameLoading}
        />
      )}
      {selectedTab === 1 && <UserGameAchievement />}
      {selectedTab === 2 && <UserArticle />}
      {selectedTab === 3 && <UserRecommend />}
      {selectedTab !== 0 && <PageSelectButton currentPage={1} />}
    </div>
  );
}
