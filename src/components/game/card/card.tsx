'use client';

import Image from 'next/image';
import Link from 'next/link';
import { FaCheck, FaTimes } from 'react-icons/fa';
import { GetGameCategoryDTO } from '@/types/GameDetail';
import GAME_POSITIVE from '@/constants/gamePositive';

export default function GameCard({ gameDetail, similarCategory }) {
  const sortedCategories = [...gameDetail.getGameCategoryDTOList]
    .sort((a, b) => {
      if (a.name === similarCategory) return -1;
      if (b.name === similarCategory) return 1;
      return 0;
    })
    .slice(0, 5);

  return (
    <div className="p-0 flex justify-center">
      <div className="block w-[384px] h-[358px] rounded-[20px] shadow-gray ">
        <Link href={`/game/${gameDetail.id}`}>
          <div className="w-full h-full">
            <Image
              src={gameDetail.headerImagePath}
              alt="card_Header_Img"
              className="w-full h-[50%] rounded-t-[20px]"
              width={999}
              height={999}
            />
            <div className="w-full h-[50%] px-[24px] py-[16px] rounded-b-[20px]">
              <div className="w-full font-bold text overflow-hidden whitespace-nowrap overflow-ellipsis">
                {gameDetail.name}
              </div>
              <div className="flex flex-wrap">
                {sortedCategories.map((eachCategory: GetGameCategoryDTO) => (
                  <span
                    key={eachCategory.id}
                    className="inline-block h-min text-[12px] text-[#2e396c] text-center bg-[#d2daf8] rounded-[2px] px-0.5 mr-1.5 mt-1 mb-1"
                  >
                    {eachCategory.name}
                  </span>
                ))}
              </div>
              <div className="w-full h-[15%] flex items-center mb-1">
                <span className="text-[14px] font-bold mr-2 ">가격</span>
                <span className="text-[14px]">
                  {gameDetail.price === 0
                    ? '무료'
                    : `${gameDetail.price
                        .toString()
                        .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}원`}
                </span>
              </div>
              <div className="w-full h-[15%] flex items-center my-1">
                <span className="text-[14px] font-bold mr-2">평가</span>
                <span className="text-[14px]">
                  {GAME_POSITIVE[gameDetail.positive]}
                </span>
              </div>
              <div className="w-full h-[15%] flex items-center mt-1">
                <span className="text-[14px] font-bold mr-1">
                  한국어 지원 여부
                </span>
                <span className="font-normal ml-0.5 pt-[1px]">
                  {gameDetail.koIsPosible ? (
                    <FaCheck className="text-green-500" />
                  ) : (
                    <FaTimes className="text-red-500 " />
                  )}
                </span>
              </div>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
}
