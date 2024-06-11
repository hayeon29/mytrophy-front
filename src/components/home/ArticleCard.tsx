'use client';

import React, { useEffect, useState } from 'react';
import { HomeArticle } from '@/types/HomeArticle';
import { MdRecommend } from 'react-icons/md';
import homeAPI from '@/services/home';
import { Avatar, Card, CardHeader, CardBody, CardFooter } from '@nextui-org/react';
import { HomeMemberInfo } from '@/types/HomeMemberInfo';

interface ArticleCardProps {
  article: HomeArticle;
}

function ArticleCard({ article }: ArticleCardProps) {
  const [gameName, setGameName] = useState<string>('');
  const [memberInfo, setMemberInfo] = useState<HomeMemberInfo>({
    nickname: '',
    imagePath: '',
    name: '',
    loginType: '',
  });

  useEffect(() => {
    const fetchGameName = async () => {
      try {
        const response = await homeAPI.getGameByAppId(article.appId);
        setGameName(response.data.name);
      } catch (error) {
        setGameName('게임 이름 못가져옴');
      }
    };

    const fetchMemberInfo = async () => {
      try {
        const response = await homeAPI.getMemberByMemberId(article.memberId);
        setMemberInfo({
          nickname: response.data.nickname,
          imagePath: response.data.imagePath,
          name: response.data.name,
          loginType: response.data.loginType,
        });
      } catch (error) {
        // 에러처리
      }
    };

    fetchGameName();
    fetchMemberInfo();
  }, [article.appId, article.memberId]);

  const getDisplayName = () => {
    if (memberInfo.nickname === null) {
      const firstName = memberInfo.name.charAt(0);
      return `${firstName}${'*'.repeat(memberInfo.name.length - 1)}`;
    }
    return memberInfo.nickname || memberInfo.name;
  };

  return (
    <Card className="w-full max-w-[400px] bg-[#F6F7FF] shadow-md rounded-3xl p-3">
      <CardHeader className="flex items-center justify-between p-4">
        <div className="flex items-center">
          <span className="bg-[#5779E9] rounded-sm text-white px-2 py-0.5 text-sm mr-2">
            {article.header}
          </span>
          <span className="text-lg font-bold text-[#2E396C]">{gameName}</span>
        </div>
      </CardHeader>

      <CardBody className="p-4 pt-0">
        <div className="flex justify-between mb-1">
          <div className="text-[#2E396C] text-lg font-semibold">{article.name}</div>
          <div className="text-[#9CA3AF] text-md">
            {new Date(article.createdAt).toLocaleDateString()}
          </div>
        </div>
        <p className="mb-2 line-clamp-3 leading-5 overflow-hidden text-ellipsis break-all text-black ">
          {article.content}
        </p>
      </CardBody>

      <CardFooter className="flex flex-col items-start p-4 pt-0">
        <div className="flex items-center mb-4">
          <MdRecommend className="mr-1 text-[#5779E9] text-xl" />
          <span className="text-[#5779E9] text-lg font-semibold">{article.cntUp}</span>
        </div>
        <div className="flex items-center">
          <Avatar
            isBordered
            size="sm"
            src={memberInfo.imagePath || undefined}
            alt={getDisplayName()}
            className="mr-3"
          />
          <span className="text-sm font-semibold text-black">{getDisplayName()}</span>
        </div>
      </CardFooter>
    </Card>
  );
}

export default ArticleCard;
