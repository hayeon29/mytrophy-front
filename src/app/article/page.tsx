'use client';

import React from 'react';
import {
  Button,
  Image,
  Card,
  CardHeader,
  CardBody,
  Avatar,
  Pagination,
} from '@nextui-org/react';

export default function Article() {
  return (
    <div className="bg-white h-screen mx-auto">
      <div className="max-w-7xl mx-auto relative bg-white pt-4">
        <div className="flex justify-left items-center p-0 gap-4">
          <Button color="primary" variant="ghost">
            자유
          </Button>
          <Button color="primary" variant="ghost">
            정보
          </Button>
          <Button color="primary" variant="ghost">
            공략
          </Button>
          <Button color="primary" variant="ghost">
            리뷰
          </Button>
        </div>
      </div>
      <div className="bg-white flex justify-center items-center py-4">
        <div className="w-full max-w-7xl border border-gray p-4 flex items-center rounded-lg h-26 shadow-md text-left">
          <Image
            width={64}
            alt="main profile image"
            src="/svgs/mainprofile.svg"
          />
          <Button
            color="default"
            variant="faded"
            className="ml-4 flex-grow test-small"
          >
            클릭 후 글을 작성해보세요.
          </Button>
        </div>
      </div>

      {/* 게시글 Card */}
      <div className="flex justify-center items-center py-4">
        <Card className="w-full max-w-7xl">
          <CardHeader className="justify-between flex-row px-6 py-4">
            <div className="flex gap-5 items-center">
              <Avatar
                isBordered
                radius="full"
                size="md"
                src="/svgs/profile.svg"
              />
              <div className="flex gap-1 items-center">
                <h4 className="text-small font-semibold leading-none text-default-600">
                  유저 이름
                </h4>
                <h5 className="text-small tracking-tight text-default-400">
                  유저 아이디
                </h5>
              </div>
            </div>
            <div className="flex gap-3 items-center">
              <Image width={16} alt="vector" src="/svgs/vector.svg" />
              <span className="text-sm text-gray-500 text-default-400">10</span>
              <Image width={16} alt="comment" src="/svgs/commenticon.svg" />
              <span className="text-sm text-gray-500 text-default-400">5</span>
            </div>
          </CardHeader>
          <div className="flex p-4">
            <CardBody className="px-3 py-0 text-small text-black flex-grow">
              <h1 className="text-lg font-bold">게시글 제목</h1>
              <p>
                게시글 내용 게시글 내용 게시글 내용 게시글 내용 게시글 내용
                게시글 내용 게시글 내용 게시글 내용 게시글 내용
              </p>
            </CardBody>
            <Image
              width={240}
              height={144}
              alt="side image"
              src={`${process.env.NEXT_PUBLIC_FRONT_URL}/svgs/thembnail.svg`}
            />
          </div>
        </Card>
      </div>
      <div className="flex flex-wrap gap-4 items-center justify-center mt-8">
        <Pagination
          loop
          showControls
          color="primary"
          total={5}
          initialPage={1}
        />
      </div>
    </div>
  );
}
