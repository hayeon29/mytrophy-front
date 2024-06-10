'use client';

import PageSelectButton from '@/components/common/PageSelectButton';
import UserArticle from '@/components/mypage/UserArticle';
import UserGameAchievement from '@/components/mypage/UserGameAchievement';
import UserGameRating from '@/components/mypage/UserGameRating';
import UserRecommend from '@/components/mypage/UserRecommend';
import { Button, Card, CardBody, CardHeader } from '@nextui-org/react';
import Image from 'next/image';
import { useState } from 'react';

export default function MyPage() {
  const [selectedTab, setSelectedTab] = useState(0);
  const handleClickTab = (event: React.MouseEvent<HTMLDivElement>) => {
    const eventTarget = event.target;
    if (eventTarget instanceof HTMLSpanElement) {
      setSelectedTab(Number(eventTarget.ariaValueText));
    }
  };

  return (
    <div className="p-6 max-w-[1216px] m-auto flex flex-col gap-8">
      <Card className="p-6 shadow-none border-1 border-primary flex flex-row">
        <CardHeader className="flex flex-col w-fit border-primary border-r-1 rounded-none pr-16 pl-8">
          <Image
            src="/image/sample_icon.jpg"
            alt="mypage user profile"
            width={128}
            height={128}
          />
          <span className="text-black font-black mt-3 mb-8">이름</span>
          <Button color="primary" className="text-white">
            프로필 수정
          </Button>
        </CardHeader>
        <CardBody
          className="text-primary grid grid-cols-4 items-center justify-center"
          onClick={handleClickTab}
        >
          <div
            className={`flex flex-col items-center cursor-pointer  ${selectedTab === 0 ? '!text-secondary' : ''}`}
          >
            <span className="text-5xl font-bold mb-2 " aria-valuetext="0">
              30
            </span>
            <span
              className={selectedTab !== 0 ? 'text-black' : ''}
              aria-valuetext="0"
            >
              보유 게임 수
            </span>
          </div>
          <div
            className={`flex flex-col items-center cursor-pointer ${selectedTab === 1 ? '!text-secondary' : ''}`}
          >
            <span className="text-5xl font-bold mb-2" aria-valuetext="1">
              1031
            </span>
            <span
              className={selectedTab !== 1 ? 'text-black' : ''}
              aria-valuetext="1"
            >
              달성 업적 수
            </span>
          </div>
          <div
            className={`flex flex-col items-center cursor-pointer ${selectedTab === 2 ? '!text-secondary' : ''}`}
          >
            <span className="text-5xl font-bold mb-2" aria-valuetext="2">
              12
            </span>
            <span
              className={selectedTab !== 2 ? 'text-black' : ''}
              aria-valuetext="2"
            >
              게시글
            </span>
          </div>
          <div
            className={`flex flex-col items-center cursor-pointer ${selectedTab === 3 ? '!text-secondary' : ''}`}
          >
            <span className="text-5xl font-bold mb-2" aria-valuetext="3">
              40
            </span>
            <span
              className={selectedTab !== 3 ? 'text-black' : ''}
              aria-valuetext="3"
            >
              추천수
            </span>
          </div>
        </CardBody>
      </Card>
      {selectedTab === 0 && <UserGameRating />}
      {selectedTab === 1 && <UserGameAchievement />}
      {selectedTab === 2 && <UserArticle />}
      {selectedTab === 3 && <UserRecommend />}
      {selectedTab !== 0 && <PageSelectButton currentPage={1} />}
    </div>
  );
}
