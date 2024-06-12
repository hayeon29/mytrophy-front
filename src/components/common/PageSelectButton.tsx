import Image from 'next/image';
import { useState } from 'react';

export default function PageSelectButton({
  currentPage,
}: {
  currentPage: number;
}) {
  const [curClickedPage, setCurClickedPage] = useState(currentPage);
  const firstPage = Math.floor((curClickedPage - 1) / 10) + 1;
  const handlePageClick = (event: React.MouseEvent<HTMLDivElement>) => {
    const eventTarget = event.target;
    if (eventTarget instanceof HTMLSpanElement) {
      setCurClickedPage(Number(eventTarget.ariaValueText));
    }
  };
  return (
    <div
      className="flex flex-row justify-center cursor-pointer"
      onClick={handlePageClick}
      role="presentation"
    >
      <Image
        src="/svgs/first-page-arrow.svg"
        width={32}
        height={32}
        alt="to first page arrow"
      />
      <Image
        src="/svgs/prev-arrow.svg"
        width={32}
        height={32}
        alt="to prev page arrow"
      />
      {[...Array(10)].map((_, index) => {
        return (
          <span
            className={`w-8 h-8 flex items-center justify-center relative ${firstPage + index === curClickedPage ? 'after:absolute after:bg-primary after:w-full after:h-full after:rounded-full after:-z-10 text-white' : ''}`}
            aria-valuetext={`${firstPage + index}`}
            key={`page-${index + firstPage}`}
          >
            {firstPage + index}
          </span>
        );
      })}
      <Image
        src="/svgs/next-arrow.svg"
        width={32}
        height={32}
        alt="to next page arrow"
      />
      <Image
        src="/svgs/last-page-arrow.svg"
        width={32}
        height={32}
        alt="to last page arrow"
      />
    </div>
  );
}
