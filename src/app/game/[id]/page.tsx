'use client';

import React, { useEffect, useState, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import gameAPI from '@/services/game';

interface GameProps {
  params: {
    id: string;
  };
}

export default function Game(proops: GameProps) {
  const [gameDetail, setGameDetail] = useState(null);
  const [playerNumber, setPlayerNumber] = useState(null);
  const [selectedScreenshot, setSelectedScreenshot] = useState(null);
  const [allScreenshots, setAllScreenshots] = useState([]);
  const [currentScreenshotIndex, setCurrentScreenshotIndex] = useState(0);
  const smallScreenshotsRef = useRef(null);
  const [formattedDate, setFormattedDate] = useState(null);

  useEffect(() => {
    const fetchGameDetail = async () => {
      try {
        const response = await gameAPI.getGameDetail('582010');
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
        const response = await gameAPI.getGamePlayerNumber('582010');
        setPlayerNumber(response.playerNumber);
      } catch (error) {
        // 에러 처리
      }
    };

    fetchGameDetail();
    fetchGamePlayerNumber();
  }, []);

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

  const handleThumbnailClick = (index) => {
    setCurrentScreenshotIndex(index);
    setSelectedScreenshot(allScreenshots[index].fullImagePath);
  };

  const scrollSmallScreenshots = (direction) => {
    if (smallScreenshotsRef.current) {
      const scrollAmount = 200; // 스크롤할 양
      smallScreenshotsRef.current.scrollBy({
        left: scrollAmount * direction,
        behavior: 'smooth',
      });
    }
  };

  if (!gameDetail || !playerNumber) {
    return <></>;
  }

  return (
    <div className="w-full min-h-dvh bg-white px-8 block justify-center">
      <div className="w-[100%] h-[900px] py-[32px] m-0 flex">
        <div className="w-[55%] h-[75%] block">
          <div className="w-[55%] h-[10%]">
            <span className="font-bold text-[32px]">{gameDetail.name}</span>
          </div>
          <div className="w-[100%] h-[75%] pb-[24px]">
            {selectedScreenshot && (
              <img
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
                  <img
                    key={screenshot.id}
                    src={screenshot.thumbnailImagePath}
                    alt={`Screenshot ${index + 1}`}
                    className="w-auto h-[95px] mr-[10px] cursor-pointer flex-none"
                    onClick={() => handleThumbnailClick(index)}
                  />
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
              <Link href="">
                <span className="w-[100%] h-[100%] border-1 border-[#cbd5e1] font-bold text-[#cbd5e1] text-[12px] text-white text-center rounded-[10px] flex justify-center items-center">
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
                  {playerNumber === '조회 불가 게임'
                    ? playerNumber
                    : `현재 ${Number(playerNumber).toLocaleString()}명이 게임 중`}
                </span>
              </div>
            </div>
            <img
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
                    .map((name) => name.trim())
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
                    .map((name) => name.trim())
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
                  .filter((category) => category.id >= 100)
                  .slice(0, 5)
                  .map((category) => (
                    <span
                      key={category.id}
                      className="inline-block h-min text-[12px] text-[#2e396c] text-center bg-[#d2daf8] rounded-[2px] px-0.5 mr-1.5 mt-1"
                    >
                      {category.name}
                    </span>
                  ))}
                {gameDetail.getGameCategoryDTOList
                  .filter((category) => category.id < 100)
                  .slice(
                    0,
                    5 -
                      gameDetail.getGameCategoryDTOList.filter(
                        (category) => category.id >= 100
                      ).length
                  )
                  .map((category) => (
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
              <Link href="">
                <span className="block w-full h-full bg-[#5779e9] font-bold text-[16px] text-white text-center rounded-[20px] flex justify-center items-center">
                  커뮤니티
                </span>
              </Link>
            </div>
            <div className="w-[100%] h-[8%] mb-4">
              <Link href="https://store.steampowered.com/app/582010">
                <span className="block w-full h-full border-1 border-[#5779e9] font-bold text-[#5779e9] text-[16px] text-white text-center rounded-[20px] flex justify-center items-center">
                  스팀 페이지로 이동
                </span>
              </Link>
            </div>
          </div>
        </div>
      </div>
      <div className="w-[100%] h-[61px] bg-[#5779e9] flex">
        <div className="w-[33%] h-[96%] bg-[#f6f7ff] flex justify-center items-center">
          <span>상세 게임</span>
        </div>
        <div className="w-0 h-[100%] flex justify-center items-center">
          <div className="w-0 h-[70%] border-1 border-[#5779e9]"></div>
        </div>
        <div className="w-[34%] h-[96%] bg-[#f6f7ff] flex justify-center items-center">
          <span>유사 게임</span>
        </div>
        <div className="w-0 h-[100%] flex justify-center items-center">
          <div className="w-0 h-[70%] border-1 border-[#5779e9]"></div>
        </div>
        <div className="w-[33%] h-[96%] bg-[#f6f7ff] flex justify-center items-center">
          <span>리뷰</span>
        </div>
      </div>
      <div className="w-[100%] h-[500px] bg-[#ffffff] flex"></div>
    </div>
  );
}
