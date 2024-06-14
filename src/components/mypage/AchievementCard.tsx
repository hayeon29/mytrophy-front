import { AchievementInfo } from '@/types/UserInfo';

import { Card, CardHeader } from '@nextui-org/react';
import Image from 'next/image';

export default function AchievementCard({
  eachAchievement,
  gameImagePath,
  gameName,
}: {
  eachAchievement: AchievementInfo;
  gameImagePath: string;
  gameName: string;
}) {
  return (
    <Card className="text-black p-4 shadow-none drop-shadow-primary">
      <CardHeader className="flex flex-row p-0">
        <Image
          src={eachAchievement?.imagePath}
          width={64}
          height={64}
          className="rounded-xl mr-4"
          alt={`${eachAchievement?.name}`}
        />
        <div className="self-start grow">
          <p className="mb-1 font-bold">{eachAchievement?.name || ''}</p>
          <p className="text-sm text-blackGray">
            {eachAchievement?.description || ''}
          </p>
        </div>
        <div className="flex flex-row items-center mr-10">
          <div className="w-8 h-8 bg-gray rounded-xl relative ">
            <Image
              src={gameImagePath}
              alt={`${gameName}`}
              className="rounded-xl absolute object-cover"
              fill
            />
          </div>
          <span className="ml-2 text-sm font-bold">{gameName}</span>
        </div>
        {eachAchievement.achieved ? (
          <Image
            src="/svgs/check.svg"
            width={16}
            height={16}
            alt="check icon"
            className="mr-14"
          />
        ) : (
          <Image
            src="/svgs/not-check.svg"
            width={16}
            height={16}
            alt="not check icon"
            className="mr-14"
          />
        )}
        <span className="text-sm text-blackGray w-[120px] text-end mr-10">
          {eachAchievement.unlockTime === '1970년 01월 01일'
            ? '미달성'
            : eachAchievement.unlockTime}
        </span>
      </CardHeader>
    </Card>
  );
}
