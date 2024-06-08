'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import homeAPI from '@/services/home';
import { HomeGame } from '@/types/HomeGame';
import { HomeCategory } from '@/types/HomeCategory';
import Category from '@/components/home/Category';
import { HomeArticle } from '@/types/HomeArticle';
import ArticleCard from '@/components/home/ArticleCard';
import { FaCheck, FaTimes, FaTimesCircle } from 'react-icons/fa';

export default function Home() {
  const [topGames, setTopGames] = useState<HomeGame[]>([]);
  const [topArticles, setTopArticles] = useState<HomeArticle[]>([]);
  const [loadingGames, setLoadingGames] = useState(true);
  const [loadingArticles, setLoadingArticles] = useState(true);

  useEffect(() => {
    const getTopGames = async () => {
      setLoadingGames(true);
      try {
        const response = await homeAPI.topGames(1, 10);
        setTopGames(response.data.content);
      } catch (error) {
        console.error('top100 가져오기 실패', error);
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
        console.error('게시글 가져오기 실패', error);
      } finally {
        setLoadingArticles(false);
      }
    };

    getTopGames();
    getTopArticles();
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
            <div className="flex">
              <div className="flex-[0.5] max-h-[400px] ml-10">
                <h2 className="text-[1.4rem] font-bold mb-4">1위</h2>
                {loadingGames ? (
                  <p className="text-lg">로딩중...</p>
                ) : (
                  topGame && (
                    <div className="flex flex-col items-start w-[300px]">
                      <img
                        src={topGame.headerImagePath}
                        alt={topGame.name}
                        className="mb-4 rounded-3xl"
                        style={{ width: 300, height: 'auto' }}
                      />
                      <h3 className="text-xl font-bold mb-3">{topGame.name}</h3>
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
                        <span className="font-bold">한국어 지원 여부 </span>
                        <span className="font-normal">
                          {topGame.koIsPosible ? (
                            <FaCheck className="text-green-500 ml-3" />
                          ) : (
                            <FaTimes className="text-red-500 ml-3" />
                          )}
                        </span>
                      </p>
                    </div>
                  )
                )}
              </div>
              <div className="flex-[0.5] h-full flex flex-col justify-between">
                {loadingGames ? (
                  <p className="text-lg">로딩중...</p>
                ) : (
                  <ol className="list-decimal list-inside w-[300px] h-full flex flex-col justify-between">
                    {remainingGames.map((game, index) => (
                      <li
                        key={game.id}
                        className="text-lg mb-3 flex justify-between items-center"
                      >
                        <span className="font-bold w-[20px] text-right">
                          {index + 2}
                        </span>
                        <span className="w-[100px] ml-4 flex-grow whitespace-nowrap overflow-hidden text-ellipsis">
                          {game.name}
                        </span>
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
                )}
              </div>
            </div>
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

      <div className="w-full h-[550px] flex justify-center items-center bg-[#D2DAF8]">
        <div className="w-full max-w-7xl h-[450px] flex items-start justify-start">
          <h2 className="text-2xl font-bold">게임 추천</h2>
        </div>
      </div>
      {/* 인기게시글 */}
      <div className="w-full h-[450px] flex justify-center items-center bg-white">
        <div className="w-full max-w-7xl h-[350px] flex flex-col items-start justify-start">
          <h2 className="text-2xl font-bold mb-6">인기 게시글</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {loadingArticles ? (
              <p>로딩중...</p>
            ) : (
              topArticles.map((article) => (
                <ArticleCard key={article.id} article={article} />
              ))
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
