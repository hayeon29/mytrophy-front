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

  useEffect(() => {
    const fetchGameDetail = async () => {
      try {
        const response = await gameAPI.getGameDetail(appId);
        setGameDetail(response);

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

  const handlePrevScreenshot = () => {
    setCurrentScreenshotIndex((prevIndex) =>
      prevIndex === 0 ? allScreenshots.length - 1 : prevIndex - 1
    );
    setSelectedScreenshot(allScreenshots[currentScreenshotIndex].fullImagePath);
    scrollSmallScreenshots(-1);
  };

  const handleNextScreenshot = () => {
    setCurrentScreenshotIndex((prevIndex) =>
      prevIndex === allScreenshots.length - 1 ? 0 : prevIndex + 1
    );
    setSelectedScreenshot(allScreenshots[currentScreenshotIndex].fullImagePath);
    scrollSmallScreenshots(1);
  };

  const handleThumbnailClick = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    clickedElement: HTMLButtonElement
  ) => {
    const index: number = Number(clickedElement.getAttribute('id'));
    setCurrentScreenshotIndex(index);
    setSelectedScreenshot(allScreenshots[index].fullImagePath);
  };

  return gameDetail && playerNumbers ? (
    <div className="w-full min-h-dvh bg-white px-8 block justify-center">
      <div className="w-[100%] h-[900px] py-[32px] m-0 flex">
        <div className="w-[55%] h-[75%] block">
          <div className="w-[55%] h-[10%]">
            <span className="font-bold text-[32px]">{gameDetail.name}</span>
          </div>
          <div className="w-[100%] h-[75%] pb-[24px]">
            {selectedScreenshot && (
              <Image
                src={selectedScreenshot}
                alt="Selected Screenshot"
                className="w-[100%] h-[100%] mb-4 rounded-[20px]"
              />
            )}
            <div className="w-[100%] h-[30%] flex items-center overflow-hidden">
              <Image
                src={`${process.env.NEXT_PUBLIC_FRONT_URL}/svgs/left_button.svg`}
                alt="이전 스크린샷"
                width={8}
                height={8}
                priority
                className="w-8 h-8 cursor-pointer mr-[16px]"
                onClick={handlePrevScreenshot}
              />
              <div
                className="flex overflow-x-hidden"
                style={{ scrollSnapType: 'x mandatory' }}
                ref={smallScreenshotsRef}
              >
                {allScreenshots.map((screenshot, index) => (
                  <button
                    type="button"
                    className="w-auto h-[95px] mr-[10px] flex-none border-0 bg-none p-0"
                    key={screenshot.id}
                    id={`${index}`}
                    onClick={(event) => {
                      handleThumbnailClick(event, this);
                    }}
                  >
                    <Image
                      src={screenshot.thumbnailImagePath}
                      alt={`Screenshot ${index + 1}`}
                      className="w-full h-full"
                    />
                  </button>
                ))}
              </div>
              <Image
                src={`${process.env.NEXT_PUBLIC_FRONT_URL}/svgs/right_button.svg`}
                alt="다음 스크린샷"
                width={8}
                height={8}
                priority
                className="w-8 h-8 cursor-pointer ml-[16px]"
                onClick={handleNextScreenshot}
              />
            </div>
          </div>
        </div>
        <div className="w-[45%] h-[100%] ml-[32px] block ">
          <div className="w-[100%] h-[7.5%] py-3 flex justify-end items-center">
            <div className="w-[10%] h-[100%]">
              <Link href="/">
                <span className="w-[100%] h-[100%] border-1 border-[#cbd5e1] font-bold text-[#cbd5e1] text-[12px] text-[#CBD5E1] text-center rounded-[10px] flex justify-center items-center">
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
                    : `현재 ${playerNumbers.playerNumber}명이 게임 중`}
                </span>
              </div>
            </div>
            <Image
              src={gameDetail.headerImagePath}
              alt="headerImagePath"
              className="w-[100%] h-[40%] my-4"
            />
            <div className="w-[100%] min-h-[6%] text-[12px] leading-tight m-0">
              <span className="w-[100%] h-[100%]">
                {gameDetail.description}
              </span>
            </div>
            <div className="w-[100%] h-[20%] mb-4 mt-2">
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
                  .filter((category: GetGameCategoryDTO) => category.id >= 100)
                  .slice(0, 5)
                  .map((category: GetGameCategoryDTO) => (
                    <span
                      key={category.id}
                      className="inline-block h-min text-[12px] text-[#2e396c] text-center bg-[#d2daf8] rounded-[2px] px-0.5 mr-1.5 mt-1"
                    >
                      {category.name}
                    </span>
                  ))}
                {gameDetail.getGameCategoryDTOList
                  .filter((category: GetGameCategoryDTO) => category.id < 100)
                  .slice(
                    0,
                    5 -
                      gameDetail.getGameCategoryDTOList.filter(
                        (category: GetGameCategoryDTO) => category.id >= 100
                      ).length
                  )
                  .map((category: GetGameCategoryDTO) => (
                    <span
                      key={category.id}
                      className="inline-block h-min text-[12px] text-[#2e396c] text-center bg-[#d2daf8] rounded-[2px] px-0.5 mr-1.5 mt-1"
                    >
                      {category.name}
                    </span>
                  ))}
              </div>
            </div>
            <div className="w-[100%] h-[8%] mb-4">
              <Link href="/">
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
      <div className="w-[100%] h-[61px] bg-[#5779e9] flex">
        <button
          type="button"
          className={`w-[33%] h-[96%] bg-${selectedComponent === 'detail' ? '[#5779e9]' : '[#f6f7ff]'} flex justify-center items-center text-${selectedComponent === 'detail' ? 'white' : 'black'}`}
          onClick={() => setSelectedComponent('detail')}
        >
          <span>상세 게임</span>
        </button>
        <div className="w-0 h-[100%] flex justify-center items-center">
          <div className="w-0 h-[70%] border-1 border-[#5779e9]" />
        </div>
        <button
          type="button"
          className={`w-[34%] h-[96%] bg-${selectedComponent === 'similar' ? '[#5779e9]' : '[#f6f7ff]'} flex justify-center items-center text-${selectedComponent === 'similar' ? 'white' : 'black'}`}
          onClick={() => setSelectedComponent('similar')}
        >
          <span>유사 게임</span>
        </button>
        <div className="w-0 h-[100%] flex justify-center items-center">
          <div className="w-0 h-[70%] border-1 border-[#5779e9]" />
        </div>
        <button
          type="button"
          className={`w-[33%] h-[96%] bg-${selectedComponent === 'review' ? '[#5779e9]' : '[#f6f7ff]'} flex justify-center items-center text-${selectedComponent === 'review' ? 'white' : 'black'}`}
          onClick={() => setSelectedComponent('review')}
        >
          <span>리뷰</span>
        </button>
      </div>
      {selectedComponent === 'detail' && <GameDetail gameDetail={gameDetail} />}
      {selectedComponent === 'similar' && (
        <GameSimilar gameDetail={gameDetail} />
      )}
      {selectedComponent === 'review' && <GameReview gameDetail={gameDetail} />}
    </div>
  ) : null;
}
