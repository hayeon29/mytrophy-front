import Image from 'next/image';

export default function PageSelectButton({
  currentPage,
  setCurrentPage,
  totalPage,
}: {
  currentPage: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
  totalPage: number;
}) {
  const firstPage = Math.floor((currentPage - 1) / 10) + 1;
  const handlePageClick = (event: React.MouseEvent<HTMLDivElement>) => {
    const eventTarget = event.target;
    if (eventTarget instanceof HTMLSpanElement) {
      setCurrentPage(Number(eventTarget.ariaValueText));
    }
  };
  const handlePageMove = (movePage: number) => {
    setCurrentPage(movePage);
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
        onClick={() => {
          handlePageMove(1);
        }}
      />
      <Image
        src="/svgs/prev-arrow.svg"
        width={32}
        height={32}
        alt="to prev page arrow"
        onClick={() => {
          handlePageMove(currentPage - 1);
        }}
      />
      {[...Array(totalPage)].map((_, index) => {
        return (
          <span
            className={`w-8 h-8 flex items-center justify-center relative z-0 ${firstPage + index === currentPage ? 'before:absolute before:bg-primary before:w-full before:h-full before:rounded-full before:-z-10 text-white' : ''}`}
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
        onClick={() => {
          handlePageMove(currentPage + 1);
        }}
      />
      <Image
        src="/svgs/last-page-arrow.svg"
        width={32}
        height={32}
        alt="to last page arrow"
        onClick={() => {
          handlePageMove(totalPage);
        }}
      />
    </div>
  );
}
