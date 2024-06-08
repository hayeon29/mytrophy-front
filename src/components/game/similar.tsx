'use client';

import { GetGameDetailDTO } from '@/types/GameDetail';
import React from 'react';

export default function GameSimilar({
  gameDetail,
}: {
  gameDetail: GetGameDetailDTO;
}) {
  return (
    <div className="w-[100%] h-[1421px] p-[32px] block bg-red-100 justify-start">
      <div className="w-[100%] h-[410px] bg-red-300">
        <div className="w-[100%] h-[52px] bg-black">{`${gameDetail.getGameCategoryDTOList[0].name} 태그가 들어간 게임`}</div>
        <div className="w-[100%] h-[358px] flex justify-center space-x-[5%] bg-red-300">
          <div className="w-[384px] h-full bg-red-500">컴포넌트1</div>
          <div className="w-[384px] h-full bg-red-500">컴포넌트2</div>
          <div className="w-[384px] h-full bg-red-500">컴포넌트3</div>
        </div>
      </div>
    </div>
  );
}
