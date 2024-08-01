'use client';

import React, { useEffect, useState } from 'react';
import { ArticleType } from '@/types/Article';
import { MdRecommend } from 'react-icons/md';
import Link from 'next/link';
import Image from 'next/image';
import gameAPI from '@/services/game';
import dayjs from 'dayjs';

function ArticleCard({ article }: { article: ArticleType }) {
  const [gameName, setGameName] = useState<string>('');

  useEffect(() => {
    const fetchGameName = async () => {
      try {
        const response = (await gameAPI.getGameDetail(article.appId.toString()))
          .data;
        setGameName(response.name);
      } catch (error) {
        setGameName('');
      }
    };

    fetchGameName();
  }, [article.appId]);

  const headerMapping = {
    FREE_BOARD: '자유',
    INFORMATION: '정보',
    GUIDE: '공략',
    REVIEW: '리뷰',
    CHATTING: '채팅',
  };

  return (
    <div className="w-full flex flex-col">
      <div className="w-full bg-neonLightBlue rounded-2xl rounded-ee-none p-3 flex flex-col gap-y-2 mb-2">
        <div className="flex items-center justify-start">
          <div className="flex flex-row items-center gap-x-2">
            <Link
              href="/article"
              className="bg-primary rounded-sm text-white text-xs px-1.5 py-0.5"
            >
              <span>{headerMapping[article.header]}</span>
            </Link>
            <Link href={`/game/${article.appId}`}>
              <span className="text-sm font-bold text-blueBlack">
                {gameName}
              </span>
            </Link>
          </div>
        </div>

        <div className="flex flex-col gap-y-1">
          <Link
            href={`/article/${article.id}`}
            className="text-sm text-blueBlack font-bold"
          >
            {article.name}
          </Link>
          <Link
            href={`/article/${article.id}`}
            className="line-clamp-3 overflow-hidden text-ellipsis break-all text-sm text-black"
          >
            {article.content}
          </Link>
        </div>

        <div className="flex flex-row justify-between items-center">
          <div className="flex items-center">
            <MdRecommend className="text-primary" />
            <span className="text-primary text-sm font-semibold">
              {article.cntUp}
            </span>
          </div>
          <span className="text-gray text-sm">
            {dayjs(article.createdAt).format('YYYY년 MM월 DD일')}
          </span>
        </div>
      </div>

      <div className="flex items-center justify-end gap-x-2">
        <span className="text-sm font-semibold text-black">
          {article.nickname || article.username}
        </span>
        <Image
          width={32}
          height={32}
          src={article.memberImage || './svgs/person.svg'}
          alt={article.nickname || article.username}
          className="rounded-full bg-blueLightGray"
        />
      </div>
    </div>
  );
}

export default ArticleCard;
