'use client';

import Image from 'next/image';
import Link from 'next/link';

export default function GameCard({ gameDetail }) {
  const getPositiveString = (positive) => {
    switch (positive) {
      case 'OVERWHELMING_POSITIVE':
        return '압도적으로 긍정적';
      case 'VERY_POSITIVE':
        return '매우 긍정적';
      case 'MOSTLY_POSITIVE':
        return '대체로 긍정적';
      case 'MIXED':
        return '중립적';
      case 'MOSTLY_NEGATIVE':
        return '대체로 부정적';
      case 'VERY_NEGATIVE':
        return '매우 부정적';
      case 'UNKNOWN':
        return '알 수 없음';
      default:
        return '';
    }
  };
  return (
    <div className="p-0 flex justify-center">
      <div className="block w-[384px] h-[358px] rounded-[20px] shadow-2xl ">
        <Link href={`/game/${gameDetail.id}`}>
          <div className="w-full h-full">
            <Image
              src={gameDetail.headerImagePath}
              alt="card_Hader_Img"
              className="w-full h-[50%] rounded-t-[20px]"
              width={999}
              height={999}
            />
            <div className="w-full h-[50%] px-[24px] py-[16px] rounded-b-[20px]">
              <div className="w-full font-bold text overflow-hidden whitespace-nowrap overflow-ellipsis">
                {gameDetail.name}
              </div>
              <div className="w-full h-[20%] flex items-center">카테고리</div>
              <div className="w-full h-[15%] flex items-center mb-1">
                <span className="text-[14px] font-bold mr-2 ">가격</span>
                <span className="text-[14px]">
                  {gameDetail.price
                    .toString()
                    .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  원
                </span>
              </div>
              <div className="w-full h-[15%] flex items-center my-1">
                <span className="text-[14px] font-bold mr-2">평가</span>
                <span className="text-[14px]">
                  {getPositiveString(gameDetail.positive)}
                </span>
              </div>
              <div className="w-full h-[15%] flex items-center mt-1">
                <span className="text-[14px] font-bold mr-2">
                  한국어 지원 여부
                </span>
                {gameDetail.koIsPosible && (
                  <Image
                    src={`${process.env.NEXT_PUBLIC_FRONT_URL}/svgs/check.svg`}
                    alt="한국어 지원"
                    width={6}
                    height={6}
                    priority
                    className="w-6 h-6"
                  />
                )}
              </div>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
}
