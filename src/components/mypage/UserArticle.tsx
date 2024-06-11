import { Divider } from '@nextui-org/react';
import ArticleThumbnail from './ArticleThumbnail';

export default function UserArticle() {
  return (
    <div className="flex flex-col gap-4">
      <span className="font-bold">내 게시글</span>
      <Divider className="bg-primary" />
      <span className="text-blackGray">총 OO개</span>
      <div className="flex flex-col gap-6">
        <ArticleThumbnail />
        <ArticleThumbnail />
        <ArticleThumbnail />
      </div>
    </div>
  );
}
