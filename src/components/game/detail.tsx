'use client';

import React from 'react';
import Image from 'next/image';

export default function GameDetail({ gameDetail }) {
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
    <div className="w-[100%] h-[600px] py-[32px] m-0 block">
      <div className="w-[100%] h-[550px] px-[24px] py-[29px] block bg-[#F6F7FF] rounded-[20px]">
        <div className="w-[100%] h-[15%] text-[16px] flex items-start bg-none">
          <span>{gameDetail.description}</span>
        </div>
        <div className="w-[100%] h-[25%] block bg-none">
          <div className="w-[100%] h-[33%] flex justify-start items-start">
            <span className="text-[14px] font-bold mr-2">가격</span>
            <span className="text-[14px]">
              {gameDetail.price
                .toString()
                .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              원
            </span>
          </div>
          <div className="w-[100%] h-[33%] flex justify-start items-start">
            <span className="text-[14px] font-bold mr-2">평가</span>
            <span className="text-[14px]">
              {getPositiveString(gameDetail.positive)}
            </span>
          </div>
          <div className="w-[100%] h-[33%] flex justify-start items-start">
            <span className="text-[14px] font-bold mr-2">한국어 지원 여부</span>
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
        <div className="w-[100%] h-[55%]block">
          <span className="text-[16px] font-bold">시스템 요구사항</span>
        </div>
        <div>{gameDetail.requirement.replace(':', '').replace('*', '')}</div>
      </div>
    </div>
  );
}
