import { Divider } from '@nextui-org/react';
import { UserGameAchievementList } from '@/types/UserInfo';

import AchievementCard from './AchievementCard';

export default function UserGameAchievement({
  achievement,
  totalCount,
}: {
  achievement: UserGameAchievementList[];
  totalCount: number;
}) {
  return (
    <div className="flex flex-col gap-4">
      <span className="font-bold">내 업적</span>
      <Divider className="bg-primary" />
      <span className="text-blackGray">총 {totalCount}개</span>
      {achievement.map((eachAchievementList) => {
        return eachAchievementList.achievements.map(
          (eachAchievement, index) => {
            return (
              <AchievementCard
                key={`${eachAchievementList.name}-${eachAchievement.unlockTime}-${index}`}
                eachAchievement={eachAchievement}
                gameImagePath={eachAchievementList.imagePath}
                gameName={eachAchievementList.name}
              />
            );
          }
        );
      })}
    </div>
  );
}
