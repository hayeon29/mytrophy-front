import { Card, CardBody, Avatar, CardFooter } from '@nextui-org/react';
import Image from 'next/image';

export default function ArticleThumbnail() {
  return (
    <Card className="text-black p-8 shadow-none drop-shadow-primary flex flex-row min-h-72">
      <CardBody className="w-fit flex flex-col gap-4 p-0">
        <div className="flex flex-row items-center">
          <Avatar src="/image/sample_icon.jpg" className="w-8 h-8 mr-2" />
          <span className="text-blackGray text-xs">사용자 닉네임</span>
          <span className="text-blackGray text-xs">(사용자 아이디)</span>
          <Image
            src="/svgs/edit.svg"
            width={18}
            height={18}
            alt="edit button icon"
          />
        </div>
        <p className="text-xl font-bold">게시글 제목</p>
        <div className="text-sm">
          <p>게시글 설명</p>
          <p>게시글 설명</p>
          <p>게시글 설명</p>
          <p>게시글 설명</p>
        </div>
      </CardBody>
      <CardFooter className="flex flex-col justify-between w-max p-0">
        <div className="w-full flex flex-row gap-4 justify-end">
          <div className="flex flex-row gap-2 justify-center">
            <Image
              src="/svgs/recommend.svg"
              width={16}
              height={16}
              alt="recommend icon"
            />
            <span className="text-sm text-primary">10</span>
          </div>
          <div className="flex flex-row items-center gap-2">
            <Image
              src="/svgs/comment.svg"
              width={14}
              height={14}
              alt="comment icon"
            />
            <span className="text-sm text-primary">10</span>
          </div>
        </div>
        <div className="w-60 h-36 bg-gray rounded-lg" />
      </CardFooter>
    </Card>
  );
}
