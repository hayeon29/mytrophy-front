'use client';

import React, { useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import GameCard from './GameCard';

function GameCardSlider({ games, idKey }) {
  const slideBoxRef = useRef<HTMLDivElement>(null);
  const [translatedWidthOfSlide, setTranslatedWidthOfSlide] = useState(0);
  const [curSlidePage, setCurSlidePage] = useState(0);

  const totalGamePage = useMemo(() => {
    return Math.ceil(games.length / 3);
  }, [games.length]);

  const handlePrevButton = () => {
    setTranslatedWidthOfSlide(
      (prevWidth) => prevWidth + (slideBoxRef.current?.offsetWidth || 0) + 32
    );
    setCurSlidePage((prev) => prev - 1);
  };

  const handleNextButton = () => {
    setTranslatedWidthOfSlide(
      (prevWidth) => prevWidth - (slideBoxRef.current?.offsetWidth || 0) - 32
    );
    setCurSlidePage((prev) => prev + 1);
  };

  const handlePageButtonClick = (page: number) => {
    setCurSlidePage(page);
    setTranslatedWidthOfSlide(() => {
      if (page === 0) {
        return 0;
      }
      return -((slideBoxRef.current?.offsetWidth || 0) + 32) * page;
    });
  };

  return (
    <div className="w-full">
      <div className="w-full relative" ref={slideBoxRef}>
        <div className="absolute w-fit h-full -left-6 top-0">
          <div className="relative h-full w-full flex flex-col justify-center">
            <button
              type="button"
              className="w-12 h-12 rounded-full bg-white bg-opacity-50 border-1 border-blueLightGray z-10 disabled:hidden"
              onClick={handlePrevButton}
              disabled={curSlidePage === 0}
            >
              <Image
                src="/svgs/prev-arrow.svg"
                width={48}
                height={48}
                alt="압도적으로 긍정적인 게임 이전 슬라이드 버튼"
                className=""
              />
            </button>
          </div>
        </div>
        <div className="w-full overflow-hidden">
          <div
            className={`flex flex-row gap-x-8 translate-x-[${translatedWidthOfSlide}px] transition-all`}
          >
            {games
              .filter((game) => game.id !== null)
              .map((game) => {
                return (
                  <GameCard
                    key={game.id || game.appId}
                    game={game}
                    idKey={idKey}
                  />
                );
              })}
          </div>
        </div>
        <div className="absolute w-fit h-full top-0 -right-6 z-10">
          <div className="relative h-full w-full flex flex-col justify-center">
            <button
              type="button"
              className="w-12 h-12 rounded-full bg-white bg-opacity-50 border-1 border-blueLightGray disabled:hidden"
              onClick={handleNextButton}
              disabled={curSlidePage === totalGamePage - 1}
            >
              <Image
                src="/svgs/next-arrow.svg"
                width={48}
                height={48}
                alt="압도적으로 긍정적인 게임 다음 슬라이드 버튼"
                className=""
              />
            </button>
          </div>
        </div>
      </div>
      <div className="w-full h-fit flex flex-row justify-center mt-3">
        <ol className="flex flex-row gap-x-3">
          {[...Array(totalGamePage)].map((_, index) => {
            return (
              <li
                key={index}
                className={`w-2 h-2 rounded-full bg-white cursor-pointer border-1 border-gray ${curSlidePage === index && '!bg-primary !border-0'}`}
                onClick={() => {
                  handlePageButtonClick(index);
                }}
                role="presentation"
              />
            );
          })}
        </ol>
      </div>
    </div>
  );
}

export default GameCardSlider;
