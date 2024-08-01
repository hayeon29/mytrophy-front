import { useState } from 'react';
import Image from 'next/image';

export default function OptionSelection({
  selectedSortOption,
  handleSortOptionClick,
  optionData,
}: {
  selectedSortOption: string;
  handleSortOptionClick: (option: string) => void;
  optionData: { [key: string]: string };
}) {
  const [isOptionVisible, setIsOptionVisible] = useState(false);

  const handleSortOptionChange = (option: string) => {
    handleSortOptionClick(option);
    setIsOptionVisible(false);
  };

  const handleSortOptionVisibleClick = () => {
    setIsOptionVisible((prev) => !prev);
  };

  return (
    <div className="w-32 relative text-sm">
      <div
        role="presentation"
        className="border-1 border-blueLightGray rounded bg-white cursor-pointer p-2 pr-9"
        onClick={handleSortOptionVisibleClick}
      >
        {selectedSortOption}
        <Image
          src="/svgs/below-arrow.svg"
          width={16}
          height={16}
          alt="옵션창 화살표 아이콘"
          className={`${isOptionVisible && 'rotate-180'} duration-100 absolute top-1/2 -translate-y-1/2 right-2`}
        />
      </div>
      {isOptionVisible && (
        <ol className="w-full p-1 border-1 border-blueLightGray rounded bg-white cursor-pointer absolute z-10 top-[110%]">
          {Object.keys(optionData).map((eachOption) => {
            return (
              <li
                key={eachOption}
                role="presentation"
                className="p-2 hover:bg-blueLightGray"
                value="eachOption"
                onClick={() => {
                  handleSortOptionChange(eachOption);
                }}
              >
                {eachOption}
              </li>
            );
          })}
        </ol>
      )}
    </div>
  );
}
