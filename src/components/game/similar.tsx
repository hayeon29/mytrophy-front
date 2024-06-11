'use client';

import { GetGameDetailDTO, GetGameCategoryDTO } from '@/types/GameDetail';
import React from 'react';
import GameCard from './card/card';

export default function GameSimilar({
  gameDetail1DTOList,
  gameCategory1DTO,
  gameDetail2DTOList,
  gameCategory2DTO,
  gameDetail3DTOList,
  gameCategory3DTO,
}: {
  gameDetail1DTOList: GetGameDetailDTO[] | null;
  gameDetail2DTOList: GetGameDetailDTO[] | null;
  gameDetail3DTOList: GetGameDetailDTO[] | null;
  gameCategory1DTO: GetGameCategoryDTO | null;
  gameCategory2DTO: GetGameCategoryDTO | null;
  gameCategory3DTO: GetGameCategoryDTO | null;
}) {
  return (
    <div className="w-[100%] h-[1421px] p-0 block  justify-start">
      <div className="w-[100%] h-[410px] mb-[65px]">
        <div className="w-[100%] h-[52px] my-[10px] flex items-center font-bold text-[16px]">{`'${gameCategory1DTO.name}' 태그가 들어간 게임`}</div>
        <div className="w-[100%] h-[358px] flex justify-center space-x-[2.5%] bg-none">
          {gameDetail1DTOList[0] && (
            <GameCard
              gameDetail={gameDetail1DTOList[0]}
              similarCategory={gameCategory1DTO.name}
            />
          )}
          {gameDetail1DTOList[1] && (
            <GameCard
              gameDetail={gameDetail1DTOList[1]}
              similarCategory={gameCategory1DTO.name}
            />
          )}
          {gameDetail1DTOList[2] && (
            <GameCard
              gameDetail={gameDetail1DTOList[2]}
              similarCategory={gameCategory1DTO.name}
            />
          )}
        </div>
      </div>
      <div className="w-[100%] h-[410px] mb-[65px]">
        <div className="w-[100%] h-[52px] my-[10px] flex items-center font-bold text-[16px]">{`'${gameCategory2DTO.name}' 태그가 들어간 게임`}</div>
        <div className="w-[100%] h-[358px] flex justify-center space-x-[2.5%] bg-none">
          {gameDetail2DTOList[0] && (
            <GameCard
              gameDetail={gameDetail2DTOList[0]}
              similarCategory={gameCategory2DTO.name}
            />
          )}
          {gameDetail2DTOList[1] && (
            <GameCard
              gameDetail={gameDetail2DTOList[1]}
              similarCategory={gameCategory2DTO.name}
            />
          )}
          {gameDetail2DTOList[2] && (
            <GameCard
              gameDetail={gameDetail2DTOList[2]}
              similarCategory={gameCategory2DTO.name}
            />
          )}
        </div>
      </div>
      <div className="w-[100%] h-[410px] mb-[65px]">
        <div className="w-[100%] h-[52px] my-[10px] flex items-center font-bold text-[16px]">{`'${gameCategory3DTO.name}' 태그가 들어간 게임`}</div>
        <div className="w-[100%] h-[358px] flex justify-center space-x-[2.5%] bg-none">
          {gameDetail3DTOList[0] && (
            <GameCard
              gameDetail={gameDetail3DTOList[0]}
              similarCategory={gameCategory3DTO.name}
            />
          )}
          {gameDetail3DTOList[1] && (
            <GameCard
              gameDetail={gameDetail3DTOList[1]}
              similarCategory={gameCategory3DTO.name}
            />
          )}
          {gameDetail3DTOList[2] && (
            <GameCard
              gameDetail={gameDetail3DTOList[2]}
              similarCategory={gameCategory3DTO.name}
            />
          )}
        </div>
      </div>
    </div>
  );
}
