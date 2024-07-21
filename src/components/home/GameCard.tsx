import React, { useState, useEffect } from 'react';
import { Button, useDisclosure } from '@nextui-org/react';
import {
  FaRegFaceFrown,
  FaRegFaceGrin,
  FaRegFaceGrinSquint,
} from 'react-icons/fa6';
import Link from 'next/link';
import Image from 'next/image';
import gameAPI from '@/services/game';
import { handleAxiosError } from '@/utils/handleAxiosError';
import Category from './Category';
import GameReviewModal from './GameReviewModal';

export default function GameCard({ game, idKey }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [reviewIcon, setReviewIcon] = useState(
    <FaRegFaceGrin className="text-gray-400" />
  );
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('access');
    setIsLoggedIn(!!token);

    async function fetchReviewStatus() {
      try {
        const response = await gameAPI.getMyReview(game[idKey]);
        const { reviewStatus } = response.data;

        if (reviewStatus) {
          switch (reviewStatus) {
            case 'BAD':
              setReviewIcon(<FaRegFaceFrown className="text-red-500" />);
              break;
            case 'GOOD':
              setReviewIcon(<FaRegFaceGrin className="text-yellow-500" />);
              break;
            case 'PERFECT':
              setReviewIcon(<FaRegFaceGrinSquint className="text-green-500" />);
              break;
            default:
              setReviewIcon(<FaRegFaceGrin className="text-gray" />);
              break;
          }
        } else {
          setReviewIcon(<FaRegFaceGrin className="text-gray" />);
        }
      } catch (error) {
        setReviewIcon(<FaRegFaceGrin className="text-gray" />);
      }
    }

    fetchReviewStatus();
  }, [game, idKey]);

  const submitReview = async (status) => {
    try {
      await gameAPI.submitReview(game[idKey], status);
      switch (status) {
        case 'BAD':
          setReviewIcon(<FaRegFaceFrown className="text-red-500" />);
          break;
        case 'GOOD':
          setReviewIcon(<FaRegFaceGrin className="text-yellow-500" />);
          break;
        case 'PERFECT':
          setReviewIcon(<FaRegFaceGrinSquint className="text-green-500" />);
          break;
        default:
          setReviewIcon(<FaRegFaceGrin className="text-gray" />);
          break;
      }

      onClose();
    } catch (error) {
      handleAxiosError(error);
    }
  };

  const positiveMappings = {
    OVERWHELMING_POSITIVE: '압도적으로 긍정적',
    VERY_POSITIVE: '매우 긍정적',
    MOSTLY_POSITIVE: '대체로 긍정적',
    MIXED: '중립적',
    MOSTLY_NEGATIVE: '대체로 부정적',
    VERY_NEGATIVE: '매우 부정적',
    UNKNOWN: '알 수 없음',
  };

  const positiveText = (positive) => positiveMappings[positive] || positive;

  return (
    <div className="w-[calc((100%-64px)/3)] flex-shrink-0">
      <div className="w-full h-full flex flex-col">
        <div className="border-1 border-blueGray rounded-2xl">
          <div className="overflow-hidden rounded-t-2xl">
            <Link href={`/game/${String(game[idKey])}`}>
              <Image
                width={460}
                height={215}
                src={game.headerImagePath}
                alt={game.name}
                className="object-fill w-full h-full"
              />
            </Link>
          </div>
          <div className="bg-white flex flex-col px-6 py-4 rounded-b-2xl">
            <div className="space-y-2 text-left w-full">
              <div className="flex items-center justify-between ">
                <Link
                  href={`/game/${String(game[idKey])}`}
                  className="text-xl font-bold text-black overflow-ellipsis line-clamp-1 break-all"
                >
                  {game.name}
                </Link>
                {isLoggedIn && ( // 로그인한 경우에만 리뷰 아이콘 표시
                  <Button
                    isIconOnly
                    color="default"
                    onPress={onOpen}
                    className="bg-transparent"
                  >
                    {React.cloneElement(reviewIcon, { size: 24 })}
                  </Button>
                )}
              </div>
              <div className="h-6">
                <Category categories={game.getGameCategoryDTOList || []} />
              </div>
              <div className="text-black text-sm flex flex-col gap-y-1.5">
                <div className="flex items-center justify-start gap-x-1">
                  <span className="font-bold">가격</span>
                  <span>{game.price === 0 ? '무료' : `${game.price}원`}</span>
                </div>
                <div className="flex items-center justify-start gap-x-1">
                  <span className="font-bold">평가</span>
                  <span>{positiveText(game.positive)}</span>
                </div>
                <div className="flex items-center justify-start gap-x-1">
                  <span className="font-bold">한국어 지원 여부</span>
                  {game.koIsPosible ? '가능' : '불가능'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <GameReviewModal
        visible={isOpen}
        onClose={onClose}
        onSubmit={submitReview}
        gameName={game.name}
        backgroundImage={game.headerImagePath}
      />
    </div>
  );
}
