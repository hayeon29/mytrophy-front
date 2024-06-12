'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import homeAPI from '@/services/home';
import { HomeGame } from '@/types/HomeGame';
import { HomeCategory } from '@/types/HomeCategory';
import Category from '@/components/home/Category';
import { HomeArticle } from '@/types/HomeArticle';
import ArticleCard from '@/components/home/ArticleCard';
import { FaCheck, FaTimes, FaCrown } from 'react-icons/fa';
import { Spinner } from '@nextui-org/react';
import Link from 'next/link';
import GameCardSlider from '@/components/home/GameCardSlider';

export default function Home() {
  const [topGames, setTopGames] = useState<HomeGame[]>([]);
  const [topArticles, setTopArticles] = useState<HomeArticle[]>([]);
  const [recommendedGames, setRecommendedGames] = useState<HomeGame[]>([]);
  const [loadingGames, setLoadingGames] = useState(true);
  const [loadingArticles, setLoadingArticles] = useState(true);
  const [loadingRecommended, setLoadingRecommended] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const getTopGames = async () => {
      setLoadingGames(true);
      try {
        const response = await homeAPI.topGames(1, 10);
        setTopGames(response.data.content);
      } catch (error) {
        // 에러처리
      } finally {
        setLoadingGames(false);
      }
    };

    const getTopArticles = async () => {
      setLoadingArticles(true);
      try {
        const response = await homeAPI.topArticles();
        setTopArticles(response.data.content);
      } catch (error) {
        // 에러처리
      } finally {
        setLoadingArticles(false);
      }
    };

    const getRecommendedGames = async () => {
      setLoadingRecommended(true);
      try {
        const response = await homeAPI.getMyRecommendedGames();
        setRecommendedGames(response.data);
      } catch (error) {
        // 에러처리
      } finally {
        setLoadingRecommended(false);
      }
    };

    getTopGames();
    getTopArticles();

    const token = localStorage.getItem('access');
    if (token) {
      setIsLoggedIn(true);
      getRecommendedGames();
    } else {
      setIsLoggedIn(false);
    }
  }, []);

  const topGame = topGames[0];
  const remainingGames = topGames.slice(1);

  return (
    <main className="flex min-h-screen flex-col items-center justify-start">
      <div className="w-full flex justify-center">
        <Image
          src="/svgs/event_header.svg"
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
                  <div className="flex flex-row items-center mb-4 text-[1.4rem]">
                    <FaCrown className="text-yellow-500" />
                    <span className="font-bold ml-2">1위</span>
                  </div>
                  {topGame && (
                    <div className="flex flex-col items-start w-[300px]">
                      <Link
                        href={`/game/${String(topGame.id)}`}
                        className="flex flex-col items-start w-[300px]"
                      >
                        <Image
                          src={topGame.headerImagePath}
                          alt={topGame.name}
                          className="mb-4 rounded-3xl transition-transform duration-300 hover:shadow-xl"
                          width={300}
                          height={150}
                        />
                        <span className="text-xl font-bold mb-3 text-gray-900 transition-colors duration-300 hover:text-[#2E396C]">
                          {topGame.name}
                        </span>
                      </Link>
                      <Category
                        categories={
                          topGame.getGameCategoryDTOList as HomeCategory[]
                        }
                      />
                      <p className="text-base mt-2 mb-2">
                        <span className="font-bold">가격</span>
                        <span className="font-normal ml-3">
                          {topGame.price === 0 ? '무료' : `${topGame.price}원`}
                        </span>
                      </p>
                      <p className="text-base flex items-center">
                        <span className="font-bold">한국어 지원 여부</span>
                        <span className="font-normal">
                          {topGame.koIsPossible ? (
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
                        key={game.id}
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

          <div className="h-full flex flex-col justify-between flex-[0.4] ml-8">
            {/* 공략 */}
            <div className="h-[230px] bg-white rounded-xl p-6 flex flex-col">
              <div className="flex justify-between">
                <div className="flex-[0.6] flex flex-col">
                  <h2 className="text-2xl font-bold mb-6">공략</h2>
                  <div className="text-base leading-6">
                    <p>유저들이 작성한 공략을 확인하고</p>
                    <p>게임을 더 재밌게 즐겨보세요!</p>
                  </div>
                </div>
                <div className="flex-[0.4] flex justify-center items-center h-full">
                  <Image
                    src="/svgs/target.svg"
                    alt="Target"
                    width={200}
                    height={200}
                  />
                </div>
              </div>
            </div>
            {/* 게임메이트모집 */}
            <div className="h-[230px] bg-white rounded-xl p-6 flex flex-col">
              <div className="flex justify-between">
                <div className="flex-[0.6] flex flex-col">
                  <h2 className="text-2xl font-bold mb-6">게임 메이트 모집</h2>
                  <div className="text-base leading-6">
                    <p>같이 게임할 사람을 구하시나요?</p>
                    <p>모집 글을 올리고 함께 게임을 즐겨보세요!</p>
                  </div>
                </div>
                <div className="flex-[0.4] flex justify-center items-center h-full">
                  <Image
                    src="/svgs/telescope.svg"
                    alt="Target"
                    width={200}
                    height={200}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 게임추천 */}
      <div className="w-full h-[600px] flex justify-center items-center bg-[#D2DAF8]">
        <div className="w-full max-w-7xl h-[500px] flex flex-col items-start justify-start">
          <h2 className="text-2xl font-bold mb-4">게임 추천</h2>
          {isLoggedIn ? (
            <GameCardSlider
              games={topGames.filter((game) => game.id !== null)}
              idKey="id"
            />
          ) : (
            <div className="flex flex-col items-center justify-center w-full h-full">
              <p className="text-lg font-semibold text-center mb-4">
                MyTrophy에 가입하고 추천 게임을 확인하세요
              </p>
              <Link href="/signup">
                <button
                  type="button"
                  className="px-4 py-2 bg-[#FF8289] text-white rounded-lg hover:bg-[#FB5A91] transition duration-200"
                >
                  회원가입
                </button>
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* 인기게시글 */}
      <div className="w-full h-[450px] flex justify-center items-center bg-white">
        <div className="w-full max-w-7xl h-[350px] flex flex-col items-start justify-start">
          <h2 className="text-2xl font-bold mb-6">인기 게시글</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
            {loadingArticles ? (
              <div className="flex justify-center items-center h-full w-full">
                <Spinner color="primary" size="lg" />
              </div>
            ) : (
              topArticles.map((article) => (
                <div key={article.id} className="flex justify-center w-full">
                  <ArticleCard article={article} />
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {isLoggedIn && (
        <div className="w-full h-[600px] flex justify-center items-center bg-[#E6E8FA]">
          <div className="w-full max-w-7xl h-[500px] flex flex-col items-start justify-start">
            <h2 className="text-2xl font-bold mb-6">좋은 평가를 남긴 게임</h2>
            {loadingRecommended ? (
              <div className="flex justify-center items-center h-full w-full">
                <Spinner color="primary" size="lg" />
              </div>
            ) : (
              <GameCardSlider
                games={recommendedGames.filter((game) => game.id !== null)}
                idKey="appId"
              />
            )}
          </div>
        </div>
      )}
    </main>
  );
}
