'use client';

import ARTICLE_CATEGORY from '@/constants/articleCategory';
import { ArticleType } from '@/types/Article';
import Link from 'next/link';
import Image from 'next/image';
import dayjs from 'dayjs';
import { GameDetailType } from '@/types/GameDetail';
import GAME_POSITIVE from '@/constants/gamePositive';
import { useState } from 'react';
import articleAPI from '@/services/article';
import { handleAxiosError } from '@/utils/handleAxiosError';
import Category from '../home/Category';
import ArticleComment from './ArticleComment';
import Recommend from '../icon/Recommend';

export default function ArticleDetail({
  articleData,
  gameData,
}: {
  articleData: ArticleType;
  gameData: GameDetailType;
}) {
  const [articleRecommend, setArticleRecommend] = useState<[boolean, number]>([
    false,
    articleData.cntUp,
  ]);

  const handleArticleRecommend = async () => {
    await articleAPI
      .like(articleData.id.toString())
      .then((response) => {
        if (response.status === 200) {
          setArticleRecommend((prev) => [
            !prev[0],
            prev[0] ? prev[1] - 1 : prev[1] + 1,
          ]);
        }
      })
      .catch(handleAxiosError);
  };

  return (
    <div className="max-w-1280 min-w-1024 flex flex-col mx-auto">
      <Link href="/article" className="self-end mb-6">
        <button
          type="button"
          className="bg-white border-1 border-blueGray text-blueLightBlack rounded-lg p-2 text-sm"
        >
          게시글 목록으로
        </button>
      </Link>
      <div className="w-full bg-white rounded-2xl p-8 drop-shadow-primary">
        <div className="pb-6 border-b-1 border-blueGray">
          {ARTICLE_CATEGORY[articleData.header] && (
            <span className="bg-primary text-white py-2 px-4 rounded-md mb-6 inline-block">
              {ARTICLE_CATEGORY[articleData.header]}
            </span>
          )}

          <p className="font-bold text-3xl mb-3">{articleData.name}</p>
          <div className="flex flex-row justify-between items-end">
            <div className="flex flex-row gap-x-3">
              <Image
                src={articleData.memberImage || '/svgs/person.svg'}
                width={48}
                height={48}
                alt="게시글 작성자 프로필 사진"
                className="w-12 h-12 rounded-full object-cover"
              />
              <div className="text-sm flex flex-col gap-y-1">
                <span>{articleData.nickname}</span>
                <span>
                  {dayjs(articleData.createdAt).format('YYYY년 MM월 DD일')}
                </span>
              </div>
            </div>
            <div className="flex flex-row gap-x-3">
              <div className="flex flex-row gap-x-1">
                <Image
                  src="/svgs/article_comment.svg"
                  width={18}
                  height={18}
                  alt="댓글 아이콘"
                />
                <span>{articleData.commentCount}</span>
              </div>
              <div className="flex flex-row gap-x-1">
                <Recommend color="#212529" />
                <span>{articleRecommend[1]}</span>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col py-6">
          <p className="font-bold mb-2">관련된 게임</p>
          <Link href={`/game/${gameData.id}`}>
            <div className="flex flex-row gap-x-3 p-3 border-1 border-blueGray rounded-xl mb-8">
              <Image
                src={gameData.headerImagePath}
                width={200}
                height={64}
                alt={`${gameData.name}의 헤더 이미지`}
              />
              <div className="flex flex-col gap-y-1">
                <p className="font-bold text-xl">{gameData.name}</p>
                <Category categories={gameData.getGameCategoryDTOList} />
                <p className="flex flex-row gap-x-1 text-sm">
                  <span className="font-bold">평가</span>
                  <span>{GAME_POSITIVE[gameData.positive]}</span>
                </p>
                <p className="flex flex-row gap-x-1 text-sm items-center">
                  <span className="font-bold">한국어 지원 여부</span>
                  <span>
                    {gameData.koIsPosible ? (
                      <Image
                        src="/svgs/check.svg"
                        width={16}
                        height={16}
                        alt="한국어 지원"
                      />
                    ) : (
                      <Image
                        src="/svgs/close.svg"
                        width={16}
                        height={16}
                        alt="한국어 미지원"
                      />
                    )}
                  </span>
                </p>
              </div>
            </div>
          </Link>
          <p className="text-sm">{articleData.content}</p>
          <div className="flex flex-row justify-center">
            <button
              type="button"
              className={`flex flex-row gap-x-2 p-3 border-1 rounded ${articleRecommend[0] ? 'border-primary' : 'border-blueGray'}`}
              onClick={handleArticleRecommend}
            >
              <Recommend isRecommended={articleRecommend[0]} />
              <span
                className={
                  articleRecommend[0] ? 'text-primary' : 'text-blueLightBlack'
                }
              >
                {articleRecommend[1]}
              </span>
            </button>
          </div>
        </div>
        <ArticleComment
          commentData={articleData.comments}
          articleId={articleData.id.toString()}
        />
      </div>
    </div>
  );
}
