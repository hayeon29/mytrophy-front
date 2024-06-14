import { Divider } from '@nextui-org/react';
import { useState } from 'react';
import ArticleThumbnail from './ArticleThumbnail';

export default function UserRecommend() {
  const [totalArticles, setTotalArticles] = useState(0); // State to store total article count

  const handleUpdateArticleCount = (count) => {
    setTotalArticles(count);
  };

  return (
    <div className="flex flex-col gap-4">
      <span className="font-bold">내가 추천한 글</span>
      <Divider className="bg-primary" />
      <span className="text-blackGray">총 {totalArticles}개</span>{' '}
      {/* Display total count */}
      <div className="flex flex-col gap-6">
        <ArticleThumbnail onUpdateArticleCount={handleUpdateArticleCount} />
      </div>
    </div>
  );
}
