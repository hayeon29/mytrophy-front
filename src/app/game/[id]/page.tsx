'use client';

import React, { useEffect, useState, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import gameAPI from '@/services/game';
import GameDetail from '@/components/game/detail';
import GameReview from '@/components/game/review';
import GameSimilar from '@/components/game/similar';
import {
  GetGameCategoryDTO,
  GetGameDetailDTO,
  GetGamePlayerNumberDTO,
  GetGameScreenshotDTO,
} from '@/types/GameDetail';

type Props = {
  params: {
    id: string;
  };
};

export default function Game({ params }: Props) {
  const { id: appId } = params;
  const [gameDetail, setGameDetail] = useState<GetGameDetailDTO | null>(null);
  const [similarGameDetail1, setSimilarGameDetail1] = useState<
    GetGameDetailDTO[] | null
  >(null);
  const [similarGameDetail2, setSimilarGameDetail2] = useState<
    GetGameDetailDTO[] | null
  >(null);
  const [similarGameDetail3, setSimilarGameDetail3] = useState<
    GetGameDetailDTO[] | null
  >(null);
  const [similarCategory, setSimilarCategory] = useState<
    GetGameCategoryDTO[] | null
  >(null);
  const [similarCategory1, setSimilarCategory1] =
    useState<GetGameCategoryDTO | null>(null);
  const [similarCategory2, setSimilarCategory2] =
    useState<GetGameCategoryDTO | null>(null);
  const [similarCategory3, setSimilarCategory3] =
    useState<GetGameCategoryDTO | null>(null);
  const [category, setCategory] = useState<GetGameCategoryDTO | null>(null);
  const [playerNumbers, setPlayerNumbers] =
    useState<GetGamePlayerNumberDTO | null>(null);
  const [selectedScreenshot, setSelectedScreenshot] = useState<string | null>(
    null
  );
  const [allScreenshots, setAllScreenshots] = useState<GetGameScreenshotDTO[]>(
    []
  );
  const [currentScreenshotIndex, setCurrentScreenshotIndex] =
    useState<number>(0);
  const smallScreenshotsRef = useRef<HTMLDivElement>(null);
  const [formattedDate, setFormattedDate] = useState<string | null>(null);
  const [selectedComponent, setSelectedComponent] = useState<
    'detail' | 'similar' | 'review'
  >('detail');

  const scrollSmallScreenshots = (direction: number) => {
    if (smallScreenshotsRef.current) {
      const scrollAmount = 200; // 스크롤할 양
      smallScreenshotsRef.current.scrollBy({
        left: scrollAmount * direction,
        behavior: 'smooth',
      });
    }
  };

  const similarGameFetch = (categories: GetGameCategoryDTO[]) => {
    let prioritizedCategories: GetGameCategoryDTO[] = [];
    let remainingSlots = 3;

    // 100번대 카테고리 추출
    const prioritized100Categories = categories.filter(
      (cate) => cate.id >= 100 && cate.id < 200
    );
    prioritizedCategories = [
      ...prioritizedCategories,
      ...prioritized100Categories.slice(0, 3), // 최대 3개의 100번대 카테고리를 추가
    ];
    remainingSlots -= prioritizedCategories.length;

    // 100번대 카테고리가 3개 미만일 때 1~99번대 카테고리를 추가
    if (remainingSlots > 0) {
      const remainingCategories = categories.filter(
        (cate) => cate.id >= 1 && cate.id < 100
      );
      const remainingExtractedCategories = remainingCategories.slice(
        0,
        remainingSlots
      );
      prioritizedCategories = [
        ...prioritizedCategories,
        ...remainingExtractedCategories,
      ];
    }
    setSimilarCategory(Array.from(new Set(prioritizedCategories)));
    setSimilarCategory1(prioritizedCategories[0]);
    setSimilarCategory2(prioritizedCategories[1]);
    setSimilarCategory3(prioritizedCategories[2]);
  };

  useEffect(() => {
    const fetchGameDetail = async () => {
      try {
        const response = await gameAPI.getGameDetail(appId);
        setGameDetail(response);
        setCategory(response.getGameCategoryDTOList);
        similarGameFetch(response.getGameCategoryDTOList);

        if (response.getGameScreenshotDTOList.length > 0) {
          setSelectedScreenshot(
            response.getGameScreenshotDTOList[0].fullImagePath
          );
          setAllScreenshots(response.getGameScreenshotDTOList);
        }

        const formattedReleaseDate = new Date(
          response.releaseDate
        ).toLocaleDateString('ko-KR', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        });
        setFormattedDate(formattedReleaseDate);
      } catch (error) {
        // 에러 처리
      }
    };

    const fetchGamePlayerNumber = async () => {
      try {
        const response = await gameAPI.getGamePlayerNumber(appId);
        setPlayerNumbers(response);
      } catch (error) {
        // 에러 처리
      }
    };

    fetchGameDetail();
    fetchGamePlayerNumber();
  }, [appId]);

  useEffect(() => {
    const fetchSimilarGames = async () => {
      if (similarCategory && similarCategory.length > 0) {
        try {
          const gameSimilarResponses = await Promise.all(
            similarCategory
              .slice(0, 3)
              .map(async (eachCategory: GetGameCategoryDTO, index: number) => {
                const response = await gameAPI.getGameSimilar(
                  `${eachCategory.id}?page=${index + 1}`
                );
                return response;
              })
          );
          setSimilarGameDetail1(gameSimilarResponses[0].content || null);
          setSimilarGameDetail2(gameSimilarResponses[1].content || null);
          setSimilarGameDetail3(gameSimilarResponses[2].content || null);
        } catch (error) {
          // 에러 처리
        }
      }
    };

    const fetchDataIfNotNull = async () => {
      if (similarCategory !== null) {
        await fetchSimilarGames();
      }
    };
    fetchDataIfNotNull();
  }, [similarCategory]);

  const handlePrevScreenshot = () => {
    const currentIndex = allScreenshots.findIndex(
      (screenshot) => screenshot.fullImagePath === selectedScreenshot
    );
    const prevIndex =
      currentIndex === 0 ? allScreenshots.length - 1 : currentIndex - 1;
    setSelectedScreenshot(allScreenshots[prevIndex].fullImagePath);
    setCurrentScreenshotIndex(prevIndex); // 인덱스 업데이트
    scrollSmallScreenshots(-1);
  };

  const handleNextScreenshot = () => {
    const currentIndex = allScreenshots.findIndex(
      (screenshot) => screenshot.fullImagePath === selectedScreenshot
    );
    const nextIndex =
      currentIndex === allScreenshots.length - 1 ? 0 : currentIndex + 1;
    setSelectedScreenshot(allScreenshots[nextIndex].fullImagePath);
    setCurrentScreenshotIndex(nextIndex); // 인덱스 업데이트
    scrollSmallScreenshots(1);
  };

  const handleThumbnailClick = (index) => {
    setCurrentScreenshotIndex(index);
    setSelectedScreenshot(allScreenshots[index].fullImagePath);
  };

  return gameDetail && playerNumbers ? (
    <div className="w-[100%] h-[100%] p-0 m-0 flex justify-center bg-white">
      <div className="w-[1280px] min-h-dvh bg-white px-8 block">
        <div className="w-[100%] h-[900px] py-[32px] m-0 flex">
          <div className="w-[55%] h-[75%] block">
            <div className="w-[55%] h-[10%]">
              <span className="font-bold text-[32px] text overflow-hidden whitespace-nowrap overflow-ellipsis">
                {gameDetail.name}
              </span>
            </div>
            <div className="w-[100%] h-[75%] pb-[24px]">
              {selectedScreenshot && (
                <Image
                  src={selectedScreenshot}
                  alt="Selected Screenshot"
                  width={660}
                  height={370}
                  className="w-[100%] h-[100%] mb-4 rounded-[20px]"
                />
              )}
              <div className="w-[100%] h-[30%] flex items-center overflow-hidden">
                {currentScreenshotIndex !== 0 && (
                  <Image
                    src="/svgs/left_button.svg"
                    alt="이전 스크린샷"
                    width={8}
                    height={8}
                    priority
                    className="w-8 h-8 cursor-pointer mr-[16px]"
                    onClick={handlePrevScreenshot}
                  />
                )}
                <div
                  className="flex overflow-x-hidden"
                  style={{ scrollSnapType: 'x mandatory' }}
                  ref={smallScreenshotsRef}
                >
                  {allScreenshots.map((screenshot, index) => {
                    const isSelected = index === currentScreenshotIndex;
                    return (
                      <button
                        type="button"
                        className={`w-auto h-[95px] mr-[10px] flex-none rounded-[5px] border-0 bg-none p-0 ${
                          isSelected
                            ? 'border-3 border-blue-500 rounded-[15px]'
                            : 'border-none'
                        }`}
                        key={index}
                        onClick={() => handleThumbnailClick(index)}
                      >
                        <Image
                          src={screenshot.thumbnailImagePath}
                          alt={`Screenshot ${index + 1}`}
                          width={999}
                          height={999}
                          className="w-full h-full rounded-[5px]"
                        />
                      </button>
                    );
                  })}
                </div>
                {currentScreenshotIndex !== allScreenshots.length - 1 && (
                  <Image
                    src="/svgs/right_button.svg"
                    alt="다음 스크린샷"
                    width={8}
                    height={8}
                    priority
                    className="w-8 h-8 cursor-pointer ml-[16px]"
                    onClick={handleNextScreenshot}
                  />
                )}
              </div>
            </div>
          </div>
          <div className="w-[45%] h-[100%] ml-[32px] block ">
            <div className="w-[100%] h-[7.5%] py-3 flex justify-end items-center">
              <div className="w-[10%] h-[100%]">
                <Link href="/gamelist">
                  <span className="w-[100%] h-[100%] border-1 border-gray font-bold text-gray text-[12px] text-center rounded-[10px] flex justify-center items-center">
                    목록으로
                  </span>
                </Link>
              </div>
            </div>
            <div className="w-[100%] h-[92.5%] border border-[#e2e8f0] rounded-[20px] p-[24px]">
              <div className="w-[100%] h-[5%] flex">
                <div className="w-[50%] h-[100%] flex font-bold text-[20px] items-center">
                  <span>게임 정보</span>
                </div>
                <div className="w-[50%] h-[100%] text-[12px] text-[#1e293b] flex justify-end items-center">
                  <span>
                    {playerNumbers.playerNumber === '조회 불가 게임'
                      ? playerNumbers.playerNumber
                      : `현재 ${parseInt(playerNumbers.playerNumber, 10).toLocaleString()}명이 게임 중`}
                  </span>
                </div>
              </div>
              <Image
                src={gameDetail.headerImagePath}
                alt="headerImagePath"
                width={476}
                height={222}
                className="w-[100%] h-[40%] my-4"
              />
              <div className="w-[100%] min-h-[6%] text-[12px] leading-tight m-0">
                <span className="w-[100%] h-[100%]">
                  {gameDetail.description}
                </span>
              </div>
              <div className="w-[100%] h-[20%] mb-6 mt-2">
                <div className="w-[100%] h-[20%] flex">
                  <span className="w-[20%] h-[100%] font-bold text-[12px]">
                    출시일
                  </span>
                  <span className="w-[80%] h-[100%] text-[12px]">
                    {formattedDate}
                  </span>
                </div>
                <div className="w-[100%] h-[20%] flex">
                  <span className="w-[20%] h-[100%] font-bold text-[12px]">
                    개발자
                  </span>
                  <span className="w-[80%] h-[100%] text-[12px]">
                    {gameDetail.developer
                      .split('&')
                      .map((name: string) => name.trim())
                      .join(', ')
                      .replace(/, ([^,]*)$/, ' $1')}
                  </span>
                </div>
                <div className="w-[100%] h-[20%] flex">
                  <span className="w-[20%] h-[100%] font-bold text-[12px]">
                    배급사
                  </span>
                  <span className="w-[80%] h-[100%] text-[12px]">
                    {gameDetail.publisher
                      .split('&')
                      .map((name: string) => name.trim())
                      .join(', ')
                      .replace(/, ([^,]*)$/, ' $1')}
                  </span>
                </div>
                <div className="w-[100%] h-[20%] flex">
                  <span className="w-[20%] h-[100%] font-bold text-[12px]">
                    관련 태그
                  </span>
                </div>
                <div className="flex flex-wrap">
                  {gameDetail.getGameCategoryDTOList
                    .filter(
                      (eachCategory: GetGameCategoryDTO) =>
                        eachCategory.id >= 100
                    )
                    .slice(0, 5)
                    .map((eachCategory: GetGameCategoryDTO) => (
                      <span
                        key={category.id}
                        className="inline-block h-min text-[12px] text-[#2e396c] text-center bg-[#d2daf8] rounded-[2px] px-0.5 mr-1.5 mt-1"
                      >
                        {eachCategory.name}
                      </span>
                    ))}
                  {gameDetail.getGameCategoryDTOList
                    .filter(
                      (eachCategory: GetGameCategoryDTO) =>
                        eachCategory.id < 100
                    )
                    .slice(
                      0,
                      5 -
                        gameDetail.getGameCategoryDTOList.filter(
                          (eachCategory: GetGameCategoryDTO) =>
                            eachCategory.id >= 100
                        ).length
                    )
                    .map((eachCategory: GetGameCategoryDTO) => (
                      <span
                        key={eachCategory.id}
                        className="inline-block h-min text-[12px] text-[#2e396c] text-center bg-[#d2daf8] rounded-[2px] px-0.5 mr-1.5 mt-1"
                      >
                        {eachCategory.name}
                      </span>
                    ))}
                </div>
              </div>
              <div className="w-[100%] h-[8%] mb-4">
                <Link href="/article">
                  <span className=" w-full h-full bg-[#5779e9] font-bold text-[16px] text-white rounded-[20px] flex justify-center items-center">
                    커뮤니티
                  </span>
                </Link>
              </div>
              <div className="w-[100%] h-[8%] mb-4">
                <Link href={`https://store.steampowered.com/app/${appId}`}>
                  <span className="w-full h-full bg-white font-bold border-[#5779e9] border-1 text-[16px] text-[#5779e9] rounded-[20px] flex justify-center items-center">
                    스팀 페이지로 이동
                  </span>
                </Link>
              </div>
            </div>
          </div>
        </div>
        <div className="w-[100%] h-[61px] bg-[#f6f7ff] border-1 border-t-[#f6f7ff] border-x-[#f6f7ff] border-b-[#5779e9] flex">
          <button
            type="button"
            className={`w-[33%] h-[100%] ${selectedComponent === 'detail' ? 'bg-[#5779e9] text-white' : 'bg-[#f6f7ff] text-black'} flex justify-center items-center`}
            onClick={() => setSelectedComponent('detail')}
          >
            <span>상세 게임</span>
          </button>
          <div className="w-[0.5%] h-[100%] flex justify-center items-center">
            <div className="w-0 h-[70%] border-1 border-[#5779e9]" />
          </div>
          <button
            type="button"
            className={`w-[33%] h-[100%] ${selectedComponent === 'similar' ? 'bg-[#5779e9] text-white' : 'bg-[#f6f7ff] text-black'} flex justify-center items-center`}
            onClick={() => setSelectedComponent('similar')}
          >
            <span>유사 게임</span>
          </button>
          <div className="w-[0.5%] h-[100%] flex justify-center items-center">
            <div className="w-0 h-[70%] border-1 border-[#5779e9]" />
          </div>
          <button
            type="button"
            className={`w-[33%] h-[100%] ${selectedComponent === 'review' ? 'bg-[#5779e9] text-white' : 'bg-[#f6f7ff] text-black'} flex justify-center items-center`}
            onClick={() => setSelectedComponent('review')}
          >
            <span>리뷰</span>
          </button>
        </div>
        {selectedComponent === 'detail' && (
          <GameDetail gameDetail={gameDetail} />
        )}
        {selectedComponent === 'similar' && (
          <GameSimilar
            gameDetail1DTOList={similarGameDetail1}
            gameDetail2DTOList={similarGameDetail2}
            gameDetail3DTOList={similarGameDetail3}
            gameCategory1DTO={similarCategory1}
            gameCategory2DTO={similarCategory2}
            gameCategory3DTO={similarCategory3}
          />
        )}
        {selectedComponent === 'review' && <GameReview appId={appId} />}
      </div>
    </div>
  ) : null;
}
