/* eslint-disable no-nested-ternary */

'use client';

import React from 'react';
import { FaCheck, FaTimes } from 'react-icons/fa';

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

  const cleanRequirementString = (requirement) => {
    if (requirement === null) return '';
    return requirement.replace(/[:*]/g, '');
  };

  return (
    <div className="w-full min-h-[450px] py-8 m-0 block">
      <div className="w-full min-h-[400px] px-6 py-7 block bg-[#F6F7FF] rounded-[20px]">
        <div className="w-full min-h-[10%] mb-4 text-lg flex items-start bg-none">
          <span className="text" style={{ wordWrap: 'break-word' }}>
            {gameDetail.description}
          </span>
        </div>
        <div className="w-full h-[25%] block bg-none">
          <div className="w-full h-[33%] flex justify-start items-start">
            <span className="text-base font-bold mr-2 mb-2">가격</span>
            <span className="text-base">
              {gameDetail.price === null
                ? '가격 정보 없음'
                : gameDetail.price === 0
                  ? '무료'
                  : `${gameDetail.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}원`}
            </span>
          </div>
          <div className="w-full h-[33%] flex justify-start items-start">
            <span className="text-base font-bold mr-2 mb-2">평가</span>
            <span className="text-base">
              {getPositiveString(gameDetail.positive)}
            </span>
          </div>
          <div className="w-full h-[33%] flex justify-start items-start">
            <span className="text-base font-bold mr-1 mb-2">
              한국어 지원 여부
            </span>
            <span className="font-normal ml-0.5 pt-[4px]">
              {gameDetail.koIsPosible ? (
                <FaCheck className="text-green-500" />
              ) : (
                <FaTimes className="text-red-500 " />
              )}
            </span>
          </div>
        </div>
        <div className="w-full h-[55%] block">
          <span className="text-lg font-bold mb-2">시스템 요구사항</span>
          <div
            // eslint-disable-next-line react/no-danger
            dangerouslySetInnerHTML={{
              __html: cleanRequirementString(gameDetail.requirement),
            }}
          />
        </div>
      </div>
    </div>
  );
}
