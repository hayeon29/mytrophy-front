import { Divider } from '@nextui-org/react';
import AchievementCard from './AchievementCard';

export default function UserGameAchievement() {
  return (
    <div className="flex flex-col gap-4">
      <span className="font-bold">내 업적</span>
      <Divider className="bg-primary" />
      <span className="text-blackGray">총 OO개</span>
      <AchievementCard />
      <AchievementCard />
      <AchievementCard />
    </div>
  );
}
