import { CommentType } from '@/types/Article';
import dayjs from 'dayjs';
import Image from 'next/image';

export default function Comment({ comment }: { comment: CommentType }) {
  return (
    <div className="text-sm flex flex-col gap-y-3">
      <div className="flex flex-row gap-x-3 items-center">
        <Image
          width={36}
          height={36}
          src={comment.imagePath || '/svgs/person.svg'}
          className="w-9 h-9 rounded-full"
          alt={`${comment.nickname || '댓글 작성자'}의 댓글`}
          style={{ width: 36, height: 36 }}
        />
        <div className="flex flex-col gap-y-0.5">
          <span>{comment.nickname || '댓글 작성 유저'}</span>
          <span className="text-blueLightBlack">
            {dayjs(comment.createdAt).format('YYYY년 MM월 DD일')}
          </span>
        </div>
      </div>
      <p>{comment.content}</p>
    </div>
  );
}
