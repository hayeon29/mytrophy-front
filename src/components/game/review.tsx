'use client';

import React, { useEffect, useState } from 'react';
import articleAPI from '@/services/article';
import { GameArticleDTO } from '@/types/GameDetail';
import { Pagination, Avatar } from '@nextui-org/react';
import Link from 'next/link';

export default function GameReview({ appId }) {
  const [gameArticleDTOList, setGameArticleDTOList] = useState<
    GameArticleDTO[] | null
  >(null);
  const [gameArticleTotalPage, setGameArticleTotalPage] = useState<
    number | null
  >(null);
  const [currentPage, setCurrentPage] = useState<number>(1);

  useEffect(() => {
    const fetchGameArticle = async () => {
      try {
        const response = await articleAPI.getGameArticleList(
          appId,
          currentPage
        );
        setGameArticleDTOList(response.content);
        setGameArticleTotalPage(response.totalPages);
      } catch (error) {
        // Error handling
      }
    };

    fetchGameArticle();
  }, [appId, currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="w-full h-full px-[188px] py-[32px] block">
      {gameArticleDTOList && gameArticleDTOList.length > 0 && (
        <>
          {gameArticleDTOList.map((article, index) => (
            <div
              key={index}
              className="w-[904px] min-h-[87px] mb-[24px] flex justify-start items-center text-[#2E396C] text-[12px]"
            >
              <Avatar
                isBordered
                size="sm"
                src={article.memberImage || undefined}
                alt={article.username}
                className="w-[64px] h-[64px] mr-[16px] "
              />
              <div className="w-[824px] flex  p-[24px] bg-[#f6f7ff] rounded-[15px] ">
                <div className="w-[80%] whitespace-pre-wrap overflow-hidden">
                  <Link href="/article">
                    <span className="text" style={{ wordWrap: 'break-word' }}>
                      {article.content}
                    </span>
                  </Link>
                </div>
                <div className="w-[20%] flex items-end justify-end whitespace-pre-wrap overflow-hidden">
                  <span className="text" style={{ wordWrap: 'break-word' }}>
                    {article.nickname}
                  </span>
                </div>
              </div>
            </div>
          ))}
          <div className="flex justify-center mt-4">
            <Pagination
              total={gameArticleTotalPage || 1}
              initialPage={1}
              page={currentPage}
              onChange={handlePageChange}
            />
          </div>
        </>
      )}
    </div>
  );
}
