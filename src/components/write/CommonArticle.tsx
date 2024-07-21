import { ChangeEvent, useRef } from 'react';

export default function CommonArticle({
  setContent,
}: {
  setContent: <T extends HTMLInputElement | HTMLTextAreaElement>(
    event: ChangeEvent<T>
  ) => void;
}) {
  const content = useRef<HTMLTextAreaElement>(null);

  return (
    <div className="p-4">
      <textarea
        className="w-full min-h-48 bg-blueLightGray rounded-2xl outline-none resize-none p-6 text-sm"
        placeholder="내용을 작성해주세요"
        ref={content}
        onChange={setContent}
        name="content"
      />
    </div>
  );
}
