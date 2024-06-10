import { Card, CardHeader } from '@nextui-org/react';

export default function AchievementCard() {
  return (
    <Card className="text-black p-4 shadow-none drop-shadow-primary">
      <CardHeader className="flex flex-row p-0">
        <div className="w-16 h-16 bg-gray rounded-xl mr-4" />
        <div className="self-start grow">
          <p className="mb-1 font-bold">업적 이름</p>
          <p className="text-sm text-blackGray">업적 달성 조건</p>
        </div>
        <div className="flex flex-row items-center mr-10">
          <div className="w-8 h-8 bg-gray rounded-xl" />
          <span className="ml-2 text-sm font-bold">게임 이름</span>
        </div>
        <span className="text-sm text-blackGray mr-14">보유 비율</span>
        <span className="text-sm text-blackGray">업적 달성 날짜</span>
      </CardHeader>
    </Card>
  );
}
