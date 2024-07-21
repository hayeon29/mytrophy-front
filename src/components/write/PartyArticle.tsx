import { ChangeEvent, useRef, useState } from 'react';

export default function PartyArticle({
  setContent,
}: {
  setContent: <T extends HTMLInputElement | HTMLTextAreaElement>(
    event: ChangeEvent<T>
  ) => void;
}) {
  const [isChecked, setIsChecked] = useState(false);
  const partySize = useRef<HTMLInputElement>(null);
  const handleInfinityChange = (event: ChangeEvent<HTMLInputElement>) => {
    setIsChecked(event.target.checked);
    partySize.current.value = '';
  };

  return (
    <div>
      <div className="flex flex-row items-center p-5 text-sm gap-x-3 border-b-1 border-disable">
        <span>인원</span>
        <input
          type="number"
          placeholder="숫자 입력"
          className={`border-1 border-blueGray rounded px-2 py-1 max-w-24 outline-none focus:border-primary focus:border-2 ${isChecked && 'bg-blueGray'}`}
          name="partySize"
          onChange={setContent}
          ref={partySize}
          disabled={isChecked}
        />
        <div className="flex flex-row items-center justify-center gap-x-1.5">
          <input
            type="checkbox"
            id="infinity"
            className="appearance-none w-5 h-5 m-0 before:m-0 before:inline-block before:w-5 before:h-5 before:border-1 before:border-blueGray before:rounded before:mr-1.5 checked:before:bg-primary checked:before:border-primary checked:before:bg-[url('/svgs/checkbox_check.svg')]"
            onChange={handleInfinityChange}
          />
          <label htmlFor="infinity">제한 없음</label>
        </div>
      </div>
      <div className="flex flex-col gap-y-4 p-4">
        <div className="text-sm flex flex-col gap-y-4">
          <span>시간대</span>
          <textarea
            className="w-full min-h-22 bg-blueLightGray rounded-2xl outline-none resize-none p-6 text-sm"
            placeholder="내용을 작성해주세요"
            name="partyTime"
            onChange={setContent}
          />
        </div>
        <div className="text-sm flex flex-col gap-y-4">
          <span>조건</span>
          <textarea
            className="w-full min-h-22 bg-blueLightGray rounded-2xl outline-none resize-none p-6 text-sm"
            placeholder="내용을 작성해주세요"
            name="partyOption"
            onChange={setContent}
          />
        </div>
        <div className="text-sm flex flex-col gap-y-4">
          <span>기타 사항</span>
          <textarea
            className="w-full min-h-22 bg-blueLightGray rounded-2xl outline-none resize-none p-6 text-sm"
            placeholder="내용을 작성해주세요"
            name="content"
            onChange={setContent}
          />
        </div>
      </div>
    </div>
  );
}
