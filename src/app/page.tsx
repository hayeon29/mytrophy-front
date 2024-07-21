'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { HomeGame } from '@/types/HomeGame';
import { HomeCategory } from '@/types/HomeCategory';
import Category from '@/components/home/Category';
import { HomeArticle } from '@/types/HomeArticle';
import ArticleCard from '@/components/home/ArticleCard';
import { GoArrowUpRight } from 'react-icons/go';
import { Spinner } from '@nextui-org/react';
import Link from 'next/link';
import GameCardSlider from '@/components/home/GameCardSlider';
import gameAPI from '@/services/game';
import articleAPI from '@/services/article';
import membersAPI from '@/services/members';
import { handleAxiosError } from '@/utils/handleAxiosError';

export default function Home() {
  const [topGames, setTopGames] = useState<HomeGame[]>([]);
  const [topArticles, setTopArticles] = useState<HomeArticle[]>([]);
  const [myRecommendedGames, setMyRecommendedGames] = useState<HomeGame[]>([]);
  const [recommendedGames, setRecommendedGames] = useState<HomeGame[]>([]);
  const [newGames, setNewGames] = useState<HomeGame[]>([]); // 최근 출시 게임
  const [positiveGames, setPositiveGames] = useState<HomeGame[]>([]); // 압도적으로 긍정적인 게임
  const [loadingGames, setLoadingGames] = useState(true);
  const [loadingArticles, setLoadingArticles] = useState(true);
  const [loadingMyRecommendedGames, setLoadingMyRecommendedGames] =
    useState(true);
  const [loadingNewGames, setLoadingNewGames] = useState(true);
  const [loadingPositiveGames, setLoadingPositiveGames] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userCategoryIds, setUserCategoryIds] = useState<number[]>([]);

  useEffect(() => {
    const getTopGames = async () => {
      setLoadingGames(true);
      try {
        const response = await gameAPI.getGameDetailsByTop(1, 10);
        setTopGames(response.content.filter((game) => game.id !== null));
      } catch (error) {
        handleAxiosError(error);
      } finally {
        setLoadingGames(false);
      }
    };

    const getTopArticles = async () => {
      setLoadingArticles(true);
      try {
        const response = await articleAPI.getTopArticles();
        setTopArticles(response.data.content);
      } catch (error) {
        handleAxiosError(error);
      } finally {
        setLoadingArticles(false);
      }
    };

    const getMyRecommendedGames = async () => {
      setLoadingMyRecommendedGames(true);
      try {
        const response = await gameAPI.getMyRecommendedGames();
        setMyRecommendedGames(response.data.filter((game) => game.id !== null));
      } catch (error) {
        handleAxiosError(error);
      } finally {
        setLoadingMyRecommendedGames(false);
      }
    };

    // 마이트로피에서 추천하는게임
    const getRecommendedGames = async () => {
      try {
        const response = await gameAPI.getRecommendedGames(0, 10);
        setRecommendedGames(
          response.data.content.filter((game) => game.id !== null)
        );
      } catch (error) {
        handleAxiosError(error);
      }
    };

    // 신규출시게임
    const getNewGames = async () => {
      setLoadingNewGames(true);
      try {
        const response = await gameAPI.getGameDetailsByRelease();
        setNewGames(response.content);
      } catch (error) {
        handleAxiosError(error);
      } finally {
        setLoadingNewGames(false);
      }
    };

    const getPositiveGames = async () => {
      setLoadingPositiveGames(true);
      try {
        const response = await gameAPI.getGameDetailsByPositive();
        setPositiveGames(response.content);
      } catch (error) {
        handleAxiosError(error);
      } finally {
        setLoadingPositiveGames(false);
      }
    };

    const fetchUserCategoryIds = async () => {
      try {
        const response = await membersAPI.getUserInfo();
        const { data } = response;

        const categoryIds: number[] = Array.isArray(data.categoryIds)
          ? data.categoryIds
              .map((id: unknown) => {
                const numberId = Number(id);
                return !Number.isNaN(numberId) ? numberId : NaN;
              })
              .filter((id) => !Number.isNaN(id))
          : [];

        setUserCategoryIds(categoryIds);
      } catch (error) {
        handleAxiosError(error);
      }
    };

    getTopGames();
    getTopArticles();
    getNewGames();
    getPositiveGames();

    const token = localStorage.getItem('access');
    if (token) {
      setIsLoggedIn(true);
      getMyRecommendedGames();
      getRecommendedGames();
      fetchUserCategoryIds();
    } else {
      setIsLoggedIn(false);
    }
  }, []);

  const [topGame, ...remainingGames] = topGames;

  const renderMyRecommendedGames = () => {
    if (loadingMyRecommendedGames) {
      return (
        <div className="flex justify-center items-center h-full w-full">
          <Spinner color="primary" size="lg" />
        </div>
      );
    }

    if (myRecommendedGames && myRecommendedGames.length > 0) {
      return <GameCardSlider games={myRecommendedGames} idKey="appId" />;
    }

    return (
      <div className="flex justify-center items-center h-full w-full">
        <p className="text-lg font-semibold text-center text-gray-700">
          평가를 남겨보세요
        </p>
      </div>
    );
  };

  const positiveMappings = {
    OVERWHELMING_POSITIVE: '압도적으로 긍정적',
    VERY_POSITIVE: '매우 긍정적',
    MOSTLY_POSITIVE: '대체로 긍정적',
    MIXED: '중립적',
    MOSTLY_NEGATIVE: '대체로 부정적',
    VERY_NEGATIVE: '매우 부정적',
    UNKNOWN: '알 수 없음',
  };

  const positiveText = (positive) => positiveMappings[positive] || positive;

  return (
    <main className="w-full flex min-h-screen bg-lightGray flex-col items-center justify-start">
      <div className="max-w-1280 min-w-1024 flex justify-center p-9">
        <div className="max-w-1280 min-w-1024 grid grid-cols-10 gap-8">
          {/* 데일리랭킹 */}
          <div className="h-full col-span-6 bg-white border-1 border-blueGray text-black drop-shadow-primary rounded-xl flex-col justify-start">
            {!loadingGames && (
              <div className="h-full grid grid-cols-2 flex-row gap-x-12 p-6">
                <div className="flex flex-col gap-y-6">
                  <h2 className="text-2xl font-bold">데일리 랭킹</h2>
                  {topGame && (
                    <div className="flex flex-col items-start">
                      <p className="text-xl font-bold mb-2">1위</p>
                      <Link
                        href={`/game/${topGame.id}`}
                        className="flex flex-col gap-3 mb-2"
                      >
                        <Image
                          src={topGame.headerImagePath}
                          alt={topGame.name}
                          width={306}
                          height={128}
                          className="rounded-3xl shrink"
                        />
                        <span className="text-xl font-bold whitespace-nowrap overflow-hidden text-ellipsis">
                          {topGame.name}
                        </span>
                      </Link>
                      <div className="w-full mb-3">
                        <Category
                          categories={
                            topGame.getGameCategoryDTOList as HomeCategory[]
                          }
                        />
                      </div>
                      <div className="flex flex-col gap-y-1 text-sm">
                        <p className="flex flex-row gap-x-2.5">
                          <span className="font-bold">가격</span>
                          <span>
                            {topGame.price === 0
                              ? '무료'
                              : `${topGame.price}원`}
                          </span>
                        </p>
                        <p className="flex flex-row gap-x-2.5">
                          <span className="font-bold">평가</span>
                          <span>{positiveText(topGame.positive)}</span>
                        </p>
                        <p className="flex flex-row gap-x-2.5">
                          <span className="font-bold">한국어 지원 여부</span>
                          <span>{topGame.koIsPosible ? '가능' : '불가능'}</span>
                        </p>
                      </div>
                    </div>
                  )}
                </div>
                <ol className="w-full h-full flex flex-col flex-grow justify-between">
                  {remainingGames.map((game, index) => (
                    <li
                      key={game.id ?? `game-${index}`}
                      className="w-full flex gap-x-3 items-center justify-start"
                    >
                      <span className="font-bold">{index + 2}</span>
                      <Link
                        href={`/game/${game.id}`}
                        className="w-full shrink text-sm whitespace-nowrap overflow-hidden text-ellipsis"
                      >
                        {game.name}
                      </Link>
                      <span className="shrink-0">
                        <Category
                          categories={[game.getGameCategoryDTOList[1]]}
                        />
                      </span>
                    </li>
                  ))}
                </ol>
              </div>
            )}
          </div>
          <div className="h-full col-span-4 flex flex-col gap-8">
            {/* 공략 */}
            <Link href="/article" className="h-full">
              <div className="h-full bg-white border-1 border-blueGray rounded-xl drop-shadow-primary flex flex-row justify-between p-6">
                <div>
                  <h2 className="text-2xl font-bold mb-3">공략</h2>
                  <div className="text-black text-base">
                    <p>유저들이 작성한 공략을 확인하고</p>
                    <p>게임을 더 재밌게 즐겨보세요!</p>
                  </div>
                </div>
                <Image
                  src="/svgs/target.svg"
                  alt="Target"
                  width={138}
                  height={138}
                  className="shrink-0"
                />
              </div>
            </Link>
            <Link href="/article" className="h-full">
              <div className="h-full bg-white border-1 border-blueGray rounded-xl drop-shadow-primary flex flex-row justify-between p-6">
                <div>
                  <h2 className="text-2xl font-bold mb-3">게임 메이트 모집</h2>
                  <div className="text-black text-base">
                    <p>같이 게임할 사람을 구하시나요?</p>
                    <p>모집 글을 올리고 함께 게임을 즐겨보세요!</p>
                  </div>
                </div>
                <Image
                  src="/svgs/telescope.svg"
                  alt="Telescope"
                  width={138}
                  height={138}
                  className="shrink-0"
                />
              </div>
            </Link>
          </div>
        </div>
      </div>

      {/* 게임추천 */}
      <div className="w-full max-w-1280 min-w-1024 flex justify-center p-9">
        <div className="w-full">
          <h2 className="text-2xl font-bold mb-6">게임 추천</h2>
          {!isLoggedIn && (
            <div className="flex flex-col items-center justify-center w-full h-full">
              <p className="text-center mb-4">
                나에게 딱 맞는 게임을 발견하고 새로운 모험을 시작하세요!
              </p>
              <Link href="/login">
                <button
                  type="button"
                  className="flex flex-row items-center px-4 py-2 bg-second text-white rounded-xl gap-x-2"
                >
                  로그인
                  <GoArrowUpRight />
                </button>
              </Link>
            </div>
          )}
          {isLoggedIn && userCategoryIds.length === 0 && (
            <div className="flex flex-col items-center justify-center w-full h-full">
              <p className="text-center mb-4">관심 카테고리를 선택하세요</p>
              <Link href="/select-category">
                <button
                  type="button"
                  className="flex flex-row items-center px-4 py-2 bg-second text-white rounded-xl gap-x-2"
                >
                  카테고리 선택
                  <GoArrowUpRight />
                </button>
              </Link>
            </div>
          )}
          {isLoggedIn && userCategoryIds.length > 0 && (
            <GameCardSlider
              games={recommendedGames.filter((game) => game.id !== null)}
              idKey="id"
            />
          )}
        </div>
      </div>

      {/* 인기게시글 */}
      <div className="w-full max-w-1280 min-w-1024 flex justify-center p-9">
        <div className="w-full">
          <h2 className="text-2xl font-bold mb-6">인기 게시글</h2>
          {!loadingArticles && (
            <div className="grid grid-cols-3 gap-x-8">
              {topArticles.map((article) => (
                <ArticleCard key={article.id} article={article} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 좋은평가를남긴게임 */}
      {isLoggedIn && (
        <div className="w-full max-w-1280 min-w-1024 flex justify-center items-center p-9">
          <div className="w-full flex flex-col items-start justify-start gap-y-6">
            <h2 className="text-2xl font-bold">좋은 평가를 남긴 게임</h2>
            {renderMyRecommendedGames()}
          </div>
        </div>
      )}

      {/* 신규출시게임 */}
      <div className="w-full max-w-1280 min-w-1024 flex justify-center items-center p-9">
        <div className="w-full flex flex-col items-start justify-start">
          <h2 className="text-2xl font-bold mb-6">신규 출시 게임</h2>
          {!loadingNewGames && (
            <GameCardSlider
              games={newGames.filter((game) => game.id !== null)}
              idKey="id"
            />
          )}
        </div>
      </div>

      {/* 압도적으로 긍정적인 게임 */}
      <div className="w-full max-w-1280 min-w-1024 flex justify-center items-center p-9">
        <div className="w-full flex flex-col items-start justify-start relative">
          <h2 className="text-2xl font-bold mb-6">압도적으로 긍정적인 게임</h2>
          <div className="w-full relative">
            {!loadingPositiveGames && (
              <GameCardSlider
                games={positiveGames.filter((game) => game.id !== null)}
                idKey="id"
              />
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
