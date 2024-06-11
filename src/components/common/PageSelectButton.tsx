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
      <span
        className={`w-8 h-8 flex items-center justify-center relative ${firstPage === curClickedPage ? 'after:absolute after:bg-primary after:w-full after:h-full after:rounded-full after:-z-10 text-white' : ''}`}
        aria-valuetext={`${firstPage}`}
      >
        {firstPage}
      </span>
      <span
        className={`w-8 h-8 flex items-center justify-center relative ${firstPage + 1 === curClickedPage ? 'after:absolute after:bg-primary after:w-full after:h-full after:rounded-full after:-z-10 text-white' : ''}`}
        aria-valuetext={`${firstPage + 1}`}
      >
        {firstPage + 1}
      </span>
      <span
        className={`w-8 h-8 flex items-center justify-center relative ${firstPage + 2 === curClickedPage ? 'after:absolute after:bg-primary after:w-full after:h-full after:rounded-full after:-z-10 text-white' : ''}`}
        aria-valuetext={`${firstPage + 2}`}
      >
        {firstPage + 2}
      </span>
      <span
        className={`w-8 h-8 flex items-center justify-center relative ${firstPage + 3 === curClickedPage ? 'after:absolute after:bg-primary after:w-full after:h-full after:rounded-full after:-z-10 text-white' : ''}`}
        aria-valuetext={`${firstPage + 3}`}
      >
        {firstPage + 3}
      </span>
      <span
        className={`w-8 h-8 flex items-center justify-center relative ${firstPage + 4 === curClickedPage ? 'after:absolute after:bg-primary after:w-full after:h-full after:rounded-full after:-z-10 text-white' : ''}`}
        aria-valuetext={`${firstPage + 4}`}
      >
        {firstPage + 4}
      </span>
      <span
        className={`w-8 h-8 flex items-center justify-center relative ${firstPage + 5 === curClickedPage ? 'after:absolute after:bg-primary after:w-full after:h-full after:rounded-full after:-z-10 text-white' : ''}`}
        aria-valuetext={`${firstPage + 5}`}
      >
        {firstPage + 5}
      </span>
      <span
        className={`w-8 h-8 flex items-center justify-center relative ${firstPage + 6 === curClickedPage ? 'after:absolute after:bg-primary after:w-full after:h-full after:rounded-full after:-z-10 text-white' : ''}`}
        aria-valuetext={`${firstPage + 6}`}
      >
        {firstPage + 6}
      </span>
      <span
        className={`w-8 h-8 flex items-center justify-center relative ${firstPage + 7 === curClickedPage ? 'after:absolute after:bg-primary after:w-full after:h-full after:rounded-full after:-z-10 text-white' : ''}`}
        aria-valuetext={`${firstPage + 7}`}
      >
        {firstPage + 7}
      </span>
      <span
        className={`w-8 h-8 flex items-center justify-center relative ${firstPage + 8 === curClickedPage ? 'after:absolute after:bg-primary after:w-full after:h-full after:rounded-full after:-z-10 text-white' : ''}`}
        aria-valuetext={`${firstPage + 8}`}
      >
        {firstPage + 8}
      </span>
      <span
        className={`w-8 h-8 flex items-center justify-center relative ${firstPage + 9 === curClickedPage ? 'after:absolute after:bg-primary after:w-full after:h-full after:rounded-full after:-z-10 text-white' : ''}`}
        aria-valuetext={`${firstPage + 9}`}
      >
        {firstPage + 9}
      </span>
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
