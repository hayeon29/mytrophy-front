'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { HomeGame } from '@/types/HomeGame';
import { HomeCategory } from '@/types/HomeCategory';
import Category from '@/components/home/Category';
import { HomeArticle } from '@/types/HomeArticle';
import ArticleCard from '@/components/home/ArticleCard';
import { FaCheck, FaTimes } from 'react-icons/fa';
import { GoArrowUpRight } from 'react-icons/go';
import { TbRosetteNumber1 } from 'react-icons/tb';
import {
  Spinner,
  Card,
  CardHeader,
  CardBody,
  Button,
  Tooltip,
} from '@nextui-org/react';
import Link from 'next/link';
import GameCardSlider from '@/components/home/GameCardSlider';
import gameAPI from '@/services/game';
import GAME_CATEGORY from '@/constants/gameCategory';
import LoginModal from '@/components/modals/LoginModal';
import { useModal } from '@/hooks/useModal';
import articleAPI from '@/services/article';
import membersAPI from '@/services/members';
import { handleAxiosError } from '@/utils/handleAxiosError';

export default function Home() {
  const { modals, openModal, closeModal } = useModal();
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
  const [loadingRecommendedGames, setLoadingRecommendedGames] = useState(true); // 게임추천섹션
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
      setLoadingRecommendedGames(true);
      try {
        const response = await gameAPI.getRecommendedGames(0, 10);
        setRecommendedGames(
          response.data.content.filter((game) => game.id !== null)
        );
      } catch (error) {
        handleAxiosError(error);
      } finally {
        setLoadingRecommendedGames(false);
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

  const handleLoginClick = () => {
    openModal(<LoginModal onClick={closeModal} />);
  };

  const topGame = topGames[0];
  const remainingGames = topGames.slice(1);

  const renderGameRecommendation = () => {
    if (!isLoggedIn) {
      return (
        <div className="flex flex-col items-center justify-center w-full h-full">
          <p className="text-lg font-semibold text-center mb-4">
            나에게 딱 맞는 게임을 발견하고 새로운 모험을 시작하세요!
          </p>
          <Button
            type="button"
            className="flex flex-row items-center px-4 py-2 bg-[#FF8289] text-white rounded-xl hover:bg-[#FB5A91] transition duration-200"
            onClick={handleLoginClick}
          >
            로그인
            <GoArrowUpRight />
          </Button>
        </div>
      );
    }

    if (loadingRecommendedGames) {
      return (
        <div className="flex justify-center items-center w-full h-full">
          <Spinner color="primary" size="lg" />
        </div>
      );
    }

    if (userCategoryIds.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center w-full h-full">
          <p className="text-lg font-semibold text-center mb-4">
            관심 카테고리를 선택하세요
          </p>
          <Link href="/select-category">
            <button
              type="button"
              className="flex flex-row items-center px-4 py-2 bg-[#FF8289] text-white rounded-xl hover:bg-[#FB5A91] transition duration-200"
            >
              카테고리 선택
              <GoArrowUpRight className="ml-2" />
            </button>
          </Link>
        </div>
      );
    }

    return (
      <GameCardSlider
        games={recommendedGames.filter((game) => game.id !== null)}
        idKey="id"
      />
    );
  };

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
    <>
      {modals.length > 0 &&
        modals.map(({ component, id }) => {
          return <div key={id}>{component}</div>;
        })}
      <main className="flex min-h-screen flex-col items-center justify-start">
        <div
          className="w-full flex justify-center cursor-pointer"
          onClick={() => {
            if (typeof window !== 'undefined') {
              window.open(
                'https://store.steampowered.com/sale/nextfest',
                '_blank'
              );
            }
          }}
          onKeyDown={(e) => {
            if (
              e.key === 'Enter' ||
              (e.key === ' ' && typeof window !== 'undefined')
            ) {
              window.open(
                'https://store.steampowered.com/sale/nextfest',
                '_blank'
              );
            }
          }}
          role="button" // Div 역할을 버튼으로 지정
          tabIndex={0} // Tab을 사용하여 접근할 수 있게 지정
        >
          <Image
            src="/image/event_header.png"
            alt="Event Header"
            width={1280}
            height={300}
            priority
            className="w-full h-auto"
          />
        </div>

        <div className="w-full h-[600px] flex justify-center items-center bg-[#6078EA]">
          <div className="w-full max-w-7xl h-[500px] flex items-center justify-center">
            {/* 데일리랭킹 */}
            <div className="flex-[0.6] h-full bg-white rounded-xl flex-col justify-start">
              <h2 className="text-[1.6rem] font-bold m-6 ml-8">데일리 랭킹</h2>
              {loadingGames ? (
                <div className="flex justify-center items-center w-full h-[400px]">
                  <Spinner color="primary" size="lg" />
                </div>
              ) : (
                <div className="flex">
                  <div className="flex-[0.5] max-h-[400px] ml-10">
                    {topGame && (
                      <div className="flex flex-col items-start w-[300px]">
                        <Link
                          href={`/game/${String(topGame.id)}`}
                          className="flex flex-col items-start w-[300px]"
                        >
                          <div className="relative w-[300px]">
                            <Image
                              src={topGame.headerImagePath}
                              alt={topGame.name}
                              width={300}
                              height={200}
                              className="mt-4 mb-4 rounded-3xl transition-transform duration-300 hover:shadow-xl"
                            />
                            <TbRosetteNumber1 className="absolute top-4 left-1 text-yellow-500 text-6xl" />
                          </div>
                          <span
                            className="max-w-full w-auto text-xl font-bold mb-1 text-gray-900 transition-colors duration-300 hover:text-[#2E396C] whitespace-nowrap overflow-hidden text-ellipsis"
                            style={{
                              display: 'inline-block',
                              width: 'auto',
                            }}
                          >
                            {topGame.name}
                          </span>
                        </Link>
                        <Category
                          categories={
                            topGame.getGameCategoryDTOList as HomeCategory[]
                          }
                        />
                        <p className="text-base mt-1 mb-1">
                          <span className="font-bold">가격</span>
                          <span className="font-normal ml-3">
                            {topGame.price === 0
                              ? '무료'
                              : `${topGame.price}원`}
                          </span>
                        </p>
                        <p className="text-base mb-1">
                          <span className="font-bold">평가</span>
                          <span className="font-normal ml-3">
                            {positiveText(topGame.positive)}
                          </span>
                        </p>
                        <p className="text-base flex items-center">
                          <span className="font-bold">한국어 지원 여부</span>
                          <span className="font-normal">
                            {topGame.koIsPosible ? (
                              <FaCheck className="text-green-500 ml-3" />
                            ) : (
                              <FaTimes className="text-red-500 ml-3" />
                            )}
                          </span>
                        </p>
                      </div>
                    )}
                  </div>
                  <div className="flex-[0.5] h-full flex flex-col justify-between">
                    <ol className="list-decimal list-inside w-[300px] h-full flex flex-col justify-between">
                      {remainingGames.map((game, index) => (
                        <li
                          key={game.id ?? `game-${index}`}
                          className="text-lg mb-3 flex justify-between items-center"
                        >
                          <span className="font-bold w-[20px] text-right">
                            {index + 2}
                          </span>
                          <Link
                            href={`/game/${game.id}`}
                            className="w-[100px] ml-4 flex-grow whitespace-nowrap overflow-hidden text-ellipsis hover:text-[#2E396C]"
                          >
                            {game.name}
                          </Link>
                          <span className="ml-4 flex">
                            {Array.isArray(game.getGameCategoryDTOList) &&
                              game.getGameCategoryDTOList.length > 0 && (
                                <Category
                                  categories={[game.getGameCategoryDTOList[1]]}
                                />
                              )}
                          </span>
                        </li>
                      ))}
                    </ol>
                  </div>
                </div>
              )}
            </div>

            <div className="h-full flex flex-col justify-between flex-[0.4] ml-8 space-y-4">
              {/* 공략 */}
              <Card className="h-[230px] bg-white rounded-xl p-0 flex flex-col transition-transform duration-200 hover:shadow-2xl">
                <Link href="/article">
                  <CardHeader className="text-2xl font-bold text-black p-8 pb-0 cursor-pointer">
                    <h2>공략</h2>
                  </CardHeader>
                  <CardBody className="flex p-0 cursor-pointer">
                    <div className="flex justify-between items-center">
                      <div className="flex-[0.6] flex flex-col pl-8">
                        <div className="text-black text-base leading-6">
                          <p>유저들이 작성한 공략을 확인하고</p>
                          <p>게임을 더 재밌게 즐겨보세요!</p>
                        </div>
                      </div>
                      <div className="flex-[0.4] flex justify-center items-center h-full">
                        <Image
                          src="/svgs/target.svg"
                          alt="Target"
                          width={150}
                          height={150}
                          className="object-contain"
                        />
                      </div>
                    </div>
                  </CardBody>
                </Link>
              </Card>

              <Card className="h-[230px] bg-white rounded-xl p-0 flex flex-col transition-transform duration-200 hover:shadow-2xl">
                <Link href="/article">
                  <CardHeader className="text-2xl font-bold text-black p-8 pb-0 cursor-pointer">
                    <h2>게임 메이트 모집</h2>
                  </CardHeader>
                  <CardBody className="flex p-0 cursor-pointer">
                    <div className="flex justify-between items-center">
                      <div className="flex-[0.6] flex flex-col pl-8">
                        <div className="text-black text-base leading-6">
                          <p>같이 게임할 사람을 구하시나요?</p>
                          <p>모집 글을 올리고 함께 게임을 즐겨보세요!</p>
                        </div>
                      </div>
                      <div className="flex-[0.4] flex justify-center items-center h-full">
                        <Image
                          src="/svgs/telescope.svg"
                          alt="Telescope"
                          width={150}
                          height={150}
                          className="object-contain"
                        />
                      </div>
                    </div>
                  </CardBody>
                </Link>
              </Card>
            </div>
          </div>
        </div>

        {/* 인기게시글 */}
        <div className="w-full flex justify-center items-center bg-white pt-6 pb-6">
          <div className="w-full max-w-7xl p-6">
            <h2 className="text-2xl font-bold mb-6">인기 게시글</h2>
            {loadingArticles ? (
              <div className="flex justify-center items-center h-[350px] w-full">
                <Spinner color="primary" size="lg" />
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 w-full">
                {topArticles.map((article) => (
                  <div key={article.id} className="flex justify-center w-full">
                    <ArticleCard article={article} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* 게임추천 */}
        <div className="w-full h-[600px] flex justify-center items-center bg-[#D2DAF8]">
          <div className="w-full max-w-7xl h-[500px] flex flex-col items-start justify-start">
            <Tooltip
              content={
                userCategoryIds.length > 0 ? (
                  <div className="p-2">
                    <p className="mb-2">
                      관심 카테고리를 기반으로 추천된 게임이에요
                    </p>
                    <Category
                      categories={userCategoryIds
                        .map((id) =>
                          GAME_CATEGORY.find((category) => category.id === id)
                        )
                        .filter((category) => category)}
                    />
                  </div>
                ) : (
                  '관심 카테고리를 기반으로 추천된 게임이에요'
                )
              }
              isDisabled={userCategoryIds.length === 0}
              placement="right"
              offset={20} // 오른쪽으로 약간 이동
              showArrow
            >
              <h2 className="text-2xl font-bold mb-6">게임 추천</h2>
            </Tooltip>
            {renderGameRecommendation()}
          </div>
        </div>

        {/* 좋은평가를남긴게임 */}
        {isLoggedIn && (
          <div className="w-full h-[600px] flex justify-center items-center bg-[#F3F4FD]">
            <div className="w-full max-w-7xl h-[500px] flex flex-col items-start justify-start">
              <h2 className="text-2xl font-bold mb-6">좋은 평가를 남긴 게임</h2>
              {renderMyRecommendedGames()}
            </div>
          </div>
        )}

        {/* 신규출시게임 */}
        <div className="w-full h-[600px] flex justify-center items-center bg-white">
          <div className="w-full max-w-7xl h-[500px] flex flex-col items-start justify-start">
            <h2 className="text-2xl font-bold mb-6">신규 출시</h2>
            {loadingNewGames ? (
              <div className="flex justify-center items-center w-full h-full">
                <Spinner color="primary" size="lg" />
              </div>
            ) : (
              <GameCardSlider
                games={newGames.filter((game) => game.id !== null)}
                idKey="id"
              />
            )}
          </div>
        </div>

        {/* 압도적으로 긍정적인 게임 */}
        <div className="w-full h-[600px] flex justify-center items-center bg-[#E6E8FA]">
          <div className="w-full max-w-7xl h-[500px] flex flex-col items-start justify-start">
            <h2 className="text-2xl font-bold mb-6">압도적으로 긍정적</h2>
            {loadingPositiveGames ? (
              <div className="flex justify-center items-center w-full h-full">
                <Spinner color="primary" size="lg" />
              </div>
            ) : (
              <GameCardSlider
                games={positiveGames.filter((game) => game.id !== null)}
                idKey="id"
              />
            )}
          </div>
        </div>
      </main>
    </>
  );
}
