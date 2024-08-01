'use client';

import React, { useState, useEffect } from 'react';
import {
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Popover,
  PopoverTrigger,
  PopoverContent,
  Button,
} from '@nextui-org/react';
import Image from 'next/image';
import Link from 'next/link';
import {
  FaRegFaceFrown,
  FaRegFaceGrin,
  FaRegFaceGrinSquint,
} from 'react-icons/fa6';
import { GameDetailType } from '@/types/GameDetail';
import { FaEdit } from 'react-icons/fa';

interface UserGameCardProps {
  game: GameDetailType;
  playtime: number;
  reviewStatus: 'NONE' | 'BAD' | 'GOOD' | 'PERFECT';
  onReviewChange: (
    id: number,
    newStatus: 'NONE' | 'BAD' | 'GOOD' | 'PERFECT'
  ) => void;
}

const iconStyle = {
  default: { color: '#A9B0BD', transition: 'color 0.2s' },
  BAD: { color: '#EF4444' }, // text-red-500
  GOOD: { color: '#F59E0B' }, // text-yellow-500
  PERFECT: { color: '#10B981' }, // text-green-500
};

const iconSize = 30;

const getIconByStatus = (status: 'NONE' | 'BAD' | 'GOOD' | 'PERFECT') => {
  switch (status) {
    case 'BAD':
      return <FaRegFaceFrown style={iconStyle.BAD} size={iconSize} />;
    case 'GOOD':
      return <FaRegFaceGrin style={iconStyle.GOOD} size={iconSize} />;
    case 'PERFECT':
      return <FaRegFaceGrinSquint style={iconStyle.PERFECT} size={iconSize} />;
    default:
      return <FaRegFaceGrin style={iconStyle.default} size={iconSize} />;
  }
};

export default function UserGameCard({
  game,
  playtime,
  reviewStatus,
  onReviewChange,
}: UserGameCardProps) {
  const [showPopover, setShowPopover] = useState(false);
  const [currentIcon, setCurrentIcon] = useState<React.ReactElement>(
    getIconByStatus(reviewStatus)
  );

  useEffect(() => {
    // 평가 상태에 따른 초기 아이콘 설정
    setCurrentIcon(getIconByStatus(reviewStatus));
  }, [reviewStatus]);

  const handleReview = async (status: 'BAD' | 'GOOD' | 'PERFECT') => {
    await onReviewChange(game.id, status);
    setCurrentIcon(getIconByStatus(status));
    setShowPopover(false);
  };

  const handleMouseEnter = (e: React.MouseEvent<SVGElement>, color: string) => {
    e.currentTarget.style.color = color;
  };

  const handleMouseLeave = (e: React.MouseEvent<SVGElement>) => {
    e.currentTarget.style.color = iconStyle.default.color as string;
  };

  return (
    <Card className="p-6 flex flex-row shadow-none drop-shadow-primary border-0 mb-4">
      <Link
        href={`/game/${game.id}`}
        className="flex flex-row grow no-underline text-black"
      >
        <CardHeader className="w-fit p-0">
          <Image
            src={game.headerImagePath}
            width={256}
            height={128}
            className="rounded-xl"
            alt={`${game.name} game header image`}
          />
        </CardHeader>
        <CardBody className="text-black px-6 py-0 flex justify-between grow overflow-hidden">
          <div>
            <p className="font-bold mb-1">{game.name}</p>
            <p>{`${Math.floor(playtime / 60)}시간 ${playtime % 60}분`}</p>
          </div>
          <div
            className="flex items-center"
            onClick={(e) => e.stopPropagation()}
            role="button"
            tabIndex={0}
            aria-haspopup="true"
            aria-expanded={showPopover}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                setShowPopover(true);
              }
            }}
          >
            <Popover
              isOpen={showPopover}
              onOpenChange={setShowPopover}
              placement="right"
              showArrow
            >
              <PopoverTrigger>
                <div
                  onMouseEnter={() => setShowPopover(true)}
                  onMouseLeave={() => setShowPopover(false)}
                  className="relative inline-block"
                  style={{ width: '30px', height: '30px' }}
                  onClick={(e) => e.preventDefault()}
                  role="button"
                  tabIndex={0}
                  aria-haspopup="true"
                  aria-expanded={showPopover}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      setShowPopover(true);
                    }
                  }}
                >
                  {currentIcon}
                </div>
              </PopoverTrigger>
              <PopoverContent
                onMouseEnter={() => setShowPopover(true)}
                onMouseLeave={() => setShowPopover(false)}
                onClick={(e) => e.stopPropagation()}
                role="dialog"
                aria-modal="true"
                tabIndex={-1}
              >
                <div className="flex flex-row space-x-3 p-2">
                  <FaRegFaceFrown
                    className="cursor-pointer"
                    style={iconStyle.default}
                    onMouseEnter={(e) =>
                      handleMouseEnter(e, iconStyle.BAD.color)
                    }
                    onMouseLeave={handleMouseLeave}
                    size={iconSize}
                    onClick={() => handleReview('BAD')}
                    role="button"
                    tabIndex={0}
                    aria-label="Bad review"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        handleReview('BAD');
                      }
                    }}
                  />
                  <FaRegFaceGrin
                    className="cursor-pointer"
                    style={iconStyle.default}
                    onMouseEnter={(e) =>
                      handleMouseEnter(e, iconStyle.GOOD.color)
                    }
                    onMouseLeave={handleMouseLeave}
                    size={iconSize}
                    onClick={() => handleReview('GOOD')}
                    role="button"
                    tabIndex={0}
                    aria-label="Good review"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        handleReview('GOOD');
                      }
                    }}
                  />
                  <FaRegFaceGrinSquint
                    className="cursor-pointer"
                    style={iconStyle.default}
                    onMouseEnter={(e) =>
                      handleMouseEnter(e, iconStyle.PERFECT.color)
                    }
                    onMouseLeave={handleMouseLeave}
                    size={iconSize}
                    onClick={() => handleReview('PERFECT')}
                    role="button"
                    tabIndex={0}
                    aria-label="Perfect review"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        handleReview('PERFECT');
                      }
                    }}
                  />
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </CardBody>
      </Link>
      <CardFooter className="w-fit flex items-start p-0">
        <Link href="/article" className="no-underline text-black">
          <Button
            isIconOnly
            as="div"
            className="bg-transparent text-[#5779E9] hover:text-primary"
            type="button"
          >
            <FaEdit size={24} />
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
