'use client';

import React, { useEffect, useState } from 'react';
import { HomeArticle } from '@/types/HomeArticle';
import { MdRecommend } from 'react-icons/md';
import homeAPI from '@/services/home';
import {
  Avatar,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Button,
} from '@nextui-org/react';
import Link from 'next/link';

interface ArticleCardProps {
  article: HomeArticle;
}

function ArticleCard({ article }: ArticleCardProps) {
  const [gameName, setGameName] = useState<string>('');

  useEffect(() => {
    const fetchGameName = async () => {
      try {
        const response = await homeAPI.getGameByAppId(article.appId);
        setGameName(response.data.name);
      } catch (error) {
        setGameName('게임 이름 못가져옴');
      }
    };

    fetchGameName();
  }, [article.appId]);

  const displayName = article.nickname || article.username;

  const headerMapping = {
    FREE_BOARD: '자유',
    INFORMATION: '정보',
    GUIDE: '공략',
    REVIEW: '리뷰',
    CHATING: '채팅',
  };

  const headerText = headerMapping[article.header] || article.header;

  return (
    <Card className="w-full max-w-[400px] bg-[#F6F7FF] shadow-md rounded-3xl p-3">
      <CardHeader className="flex items-center justify-between p-4">
        <div className="flex items-center">
          <Link href="/article" passHref>
            <Button
              size="sm"
              className="bg-[#5779E9] rounded-md text-white text-sm mr-3"
              style={{ minWidth: 'auto', height: '28px' }}
            >
              {headerText}
            </Button>
          </Link>
          <Link href={`/game/${article.appId}`} passHref>
            <span className="text-lg font-bold text-[#2E396C] hover:underline cursor-pointer items-center mt-1"
              style={{
                display: 'inline-block',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                maxWidth: '250px',
              }}
            >
              {gameName}
            </span>
          </Link>
        </div>
      </CardHeader>

      <CardBody className="p-4 pt-0">
        <div className="flex justify-between mb-1">
          <Link href={`/article/${article.id}`} passHref>
            <div className="text-[#2E396C] text-lg font-semibold cursor-pointer"
              style={{
                display: 'inline-block',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                maxWidth: '230px',
              }}
            >
              {article.name}
            </div>
          </Link>
          <div className="text-[#9CA3AF] text-md">
            {new Date(article.createdAt).toLocaleDateString()}
          </div>
        </div>
        <Link href={`/article/${article.id}`} passHref>
          <p className="mb-2 line-clamp-3 leading-5 overflow-hidden text-ellipsis break-all text-black cursor-pointer">
            {article.content}
          </p>
        </Link>
      </CardBody>

      <CardFooter className="flex flex-col items-start p-4 pt-0">
        <div className="flex items-center mb-4">
          <MdRecommend className="mr-1 text-[#5779E9] text-xl" />
          <span className="text-[#5779E9] text-lg font-semibold">
            {article.cntUp}
          </span>
        </div>
        <div className="flex items-center">
          <Avatar
            isBordered
            size="sm"
            src={article.memberImage || undefined}
            alt={displayName}
            className="mr-3"
          />
          <span className="text-sm font-semibold text-black">
            {displayName}
          </span>
        </div>
      </CardFooter>
    </Card>
  );
}

export default ArticleCard;
