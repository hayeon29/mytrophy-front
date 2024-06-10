'use client';

import { GetGameDetailDTO } from '@/types/GameDetail';
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function GameReview({
  gameDetail,
}: {
  gameDetail: GetGameDetailDTO;
}) {
  return (
    <div className="p-4 flex justify-center">
      <div className="block w-[384px] h-[358px] rounded-[20px] shadow-2xl ">
        <Link href="/game/582010">
          <div className="w-full h-full">
            <Image
              src="https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/582010/ss_a262c53b8629de7c6547933dc0b49d31f4e1b1f1.1920x1080.jpg?t=1711328912"
              alt="card_Hader_Img"
              width={384}
              height={180}
              className="w-full h-[50%] rounded-t-[20px]"
            />
            <div className="w-full h-[50%] px-[24px] py-[16px] rounded-b-[20px]">
              <div className="w-full h-[25%] text-[20px] font-bold flex items-center">
                V Rising
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
                  {/* {getPositiveString(gameDetail.positive)} */}
                </span>
              </div>
              <div className="w-full h-[15%] flex items-center mt-1">
                <span className="text-[14px] font-bold mr-2">
                  한국어 지원 여부
                </span>
                {gameDetail.koIsPossible && (
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
