import Image from 'next/image';
import { ChangeEvent } from 'react';
import CommonArticle from './CommonArticle';

export default function RatingArticle({
  setContent,
}: {
  setContent: <T extends HTMLInputElement | HTMLTextAreaElement>(
    event: ChangeEvent<T>
  ) => void;
}) {
  return (
    <div>
      <div className="flex flex-row gap-x-3 border-b-1 border-disable p-5 text-sm">
        <span>평가</span>
        <fieldset className="flex flex-row gap-x-3">
          <div className="flex flex-row gap-x-1.5">
            <input type="radio" id="good" name="rating" />
            <label
              htmlFor="good"
              className="flex flex-row items-center gap-x-0.5"
            >
              좋아요
              <Image
                src="/svgs/smile_3D.svg"
                width={16}
                height={16}
                alt="좋아요 이모티콘"
              />
            </label>
          </div>
          <div className="flex flex-row gap-x-1.5">
            <input type="radio" id="neutral" name="rating" />
            <label
              htmlFor="neutral"
              className="flex flex-row items-center gap-x-0.5"
            >
              그저그래요
              <Image
                src="/svgs/neutral_3D.svg"
                width={16}
                height={16}
                alt="그저그래요 이모티콘"
              />
            </label>
          </div>
          <div className="flex flex-row gap-x-1.5">
            <input type="radio" id="bad" name="rating" />
            <label
              htmlFor="bad"
              className="flex flex-row items-center gap-x-0.5"
            >
              별로예요
              <Image
                src="/svgs/worried_3D.svg"
                width={16}
                height={16}
                alt="별로예요 이모티콘"
              />
            </label>
          </div>
        </fieldset>
      </div>
      <CommonArticle setContent={setContent} />
    </div>
  );
}
