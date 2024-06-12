import React, { useEffect, useState } from 'react';
import {
  Card,
  CardHeader,
  CardBody,
  Divider,
  Spinner,
} from '@nextui-org/react';
import gameAPI from '@/services/game';
import membersAPI from '@/services/members';
import articleAPI from '@/services/article';

export default function Dashboard() {
  const [memberCount, setMemberCount] = useState(0);
  const [articleCount, setArticleCount] = useState(0);
  const [gameCount, setGameCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      membersAPI.getMemberCount(),
      articleAPI.getArticleCount(),
      gameAPI.getGameCount(),
    ])
      .then(([memberData, articleData, gameData]) => {
        setMemberCount(memberData);
        setArticleCount(articleData);
        setGameCount(gameData);
      })
      .catch(() => {
        // 에러처리
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <div className="m-4">
      <div className="m-4">
        <p className="text-2xl">Dashboard</p>
      </div>
      <div className="flex flex-wrap gap-4 justify-between">
        <Card className="w-[260px] m-1">
          <CardHeader className="flex gap-3">
            <div className="flex flex-col">
              <p className="text-small text-danger">회원 수</p>
            </div>
          </CardHeader>
          <Divider />
          <CardBody>
            {loading ? (
              <Spinner color="danger" />
            ) : (
              <p className="text-2xl text-danger">{memberCount}</p>
            )}
          </CardBody>
        </Card>
        <Card className="w-[260px] m-1">
          <CardHeader className="flex gap-3">
            <div className="flex flex-col">
              <p className="text-small text-success">게시물 수</p>
            </div>
          </CardHeader>
          <Divider />
          <CardBody>
            {loading ? (
              <Spinner color="success" />
            ) : (
              <p className="text-2xl text-success">{articleCount}</p>
            )}
          </CardBody>
        </Card>
        <Card className="w-[260px] m-1">
          <CardHeader className="flex gap-3">
            <div className="flex flex-col">
              <p className="text-small text-primary">게임 수</p>
            </div>
          </CardHeader>
          <Divider />
          <CardBody>
            {loading ? (
              <Spinner color="primary" />
            ) : (
              <p className="text-2xl text-primary">{gameCount}</p>
            )}
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
