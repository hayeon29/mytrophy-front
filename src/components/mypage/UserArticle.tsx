import { Divider } from '@nextui-org/react';
import { useState } from 'react';
import UserArticleList from './UserArticleList';

export default function UserArticle() {
  const [totalArticles, setTotalArticles] = useState(0);

  const handleUpdateMyArticleCount = (count) => {
    setTotalArticles(count);
  };

  return (
    <div className="flex flex-col gap-4">
      <span className="font-bold">내 게시글</span>
      <Divider className="bg-primary" />
      <span className="text-blackGray">총 {totalArticles}개</span>
      <div className="flex flex-col gap-6">
        <UserArticleList onUpdateMyArticleCount={handleUpdateMyArticleCount} />
      </div>
    </div>
  );
}
