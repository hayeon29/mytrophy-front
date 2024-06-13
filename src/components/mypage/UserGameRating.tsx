import {
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Divider,
} from '@nextui-org/react';
import Image from 'next/image';
import { GetGameDetailDTO } from '@/types/GameDetail';
import { UserAllGameInfo } from '@/types/UserInfo';
import Rating from '../icon/Rating';

export default function UserGameRating({
  gameInfo,
  userGameInfo,
  isLoading,
}: {
  gameInfo: GetGameDetailDTO[];
  userGameInfo: UserAllGameInfo;
  isLoading: boolean;
}) {
  return (
    <>
      <div className="flex flex-col">
        <p className="font-bold mb-6">평가되지 않은 게임</p>
        {gameInfo.map((value: GetGameDetailDTO, index) => {
          if (value !== undefined) {
            return (
              <Card
                key={value.id}
                className="p-6 flex flex-row shadow-none drop-shadow-primary border-0 mb-4"
              >
                <CardHeader className="w-fit p-0">
                  <Image
                    src={value.headerImagePath}
                    width={256}
                    height={128}
                    className="rounded-xl"
                    alt={`${value.name} game header image`}
                  />
                </CardHeader>
                <CardBody className="text-black px-6 py-0 flex justify-between grow overflow-hidden">
                  <div>
                    <p className="font-bold mb-1">{value.name}</p>
                    <p>{`${Math.floor(userGameInfo.games[index].playtime_forever / 60)}시간 ${userGameInfo.games[index].playtime_forever % 60}분`}</p>
                  </div>
                  <Rating />
                </CardBody>
                <CardFooter className="w-fit flex items-start p-0">
                  <Image
                    src="/svgs/edit.svg"
                    width={24}
                    height={24}
                    alt="edit icon"
                  />
                </CardFooter>
              </Card>
            );
          }
          return <div key={index} />;
        })}
      </div>
      <Divider className="bg-primary" />
      {!isLoading && (
        <div>
          <p className="font-bold mb-6">
            총{' '}
            {userGameInfo.game_count !== undefined
              ? userGameInfo.game_count
              : 0}{' '}
            개의 게임
          </p>
          {gameInfo.map((value: GetGameDetailDTO, index) => {
            if (value !== undefined) {
              return (
                <Card
                  key={value.id}
                  className="p-6 flex flex-row shadow-none drop-shadow-primary border-0 mb-4"
                >
                  <CardHeader className="w-fit p-0">
                    <Image
                      src={value.headerImagePath}
                      width={256}
                      height={128}
                      className="rounded-xl"
                      alt={`${value.name} game header image`}
                    />
                  </CardHeader>
                  <CardBody className="text-black px-6 py-0 flex justify-between grow overflow-hidden">
                    <div>
                      <p className="font-bold mb-1">{value.name}</p>
                      <p>{`${Math.floor(userGameInfo.games[index].playtime_forever / 60)}시간 ${userGameInfo.games[index].playtime_forever % 60}분`}</p>
                    </div>
                    <Rating />
                  </CardBody>
                  <CardFooter className="w-fit flex items-start p-0">
                    <Image
                      src="/svgs/edit.svg"
                      width={24}
                      height={24}
                      alt="edit icon"
                    />
                  </CardFooter>
                </Card>
              );
            }
            return <div key={index} />;
          })}
        </div>
      )}
    </>
  );
}
