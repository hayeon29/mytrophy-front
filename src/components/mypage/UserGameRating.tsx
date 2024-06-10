import {
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Divider,
} from '@nextui-org/react';
import Image from 'next/image';
import Rating from '../icon/Rating';

export default function UserGameRating() {
  return (
    <>
      <div>
        <p className="font-bold mb-6">평가되지 않은 게임</p>
        <Card className="p-6 flex flex-row shadow-none drop-shadow-primary border-0">
          <CardHeader className="w-fit p-0">
            <div className="w-64 h-32 bg-gray rounded-xl" />
          </CardHeader>
          <CardBody className="text-black px-6 py-0 flex justify-between grow overflow-hidden">
            <div>
              <p className="font-bold mb-1">제목</p>
              <p>시간</p>
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
      </div>
      <Divider className="bg-primary" />
      <div>
        <p className="font-bold mb-6">총 몇 개의 게임</p>
        <Card className="p-6 flex flex-row shadow-none drop-shadow-primary border-0">
          <CardHeader className="w-fit p-0">
            <div className="w-64 h-32 bg-gray rounded-xl" />
          </CardHeader>
          <CardBody className="text-black px-6 py-0 flex justify-between grow overflow-hidden">
            <div>
              <p className="font-bold mb-1">제목</p>
              <p>시간</p>
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
      </div>
    </>
  );
}
