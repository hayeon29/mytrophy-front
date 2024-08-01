import Image from 'next/image';
import { useRef, useState } from 'react';
import gameAPI from '@/services/game';
import { GameDetailType } from '@/types/GameDetail';
import CommonModal from './CommonModal';

export default function GameSearchModal({
  onClose,
  onSelect,
  selectedGame,
}: {
  onClose: (...args: unknown[]) => void;
  onSelect: (game: GameDetailType) => void;
  selectedGame: GameDetailType | null;
}) {
  const gameKeyword = useRef<HTMLInputElement>(null);
  const [games, setGames] = useState<GameDetailType[]>([]);
  const handleGameKeywordSearch = async () => {
    const response = await gameAPI.searchGameByName({
      keyword: gameKeyword.current.value,
    });
    setGames(response?.content === undefined ? [] : response?.content);
  };

  return (
    <CommonModal title="검색" onClose={onClose} size="middle">
      <div className="w-full p-6 relative text-sm">
        <input
          type="text"
          placeholder="검색할 게임 이름을 적어주세요"
          className="w-full py-4 px-5 rounded-full outline-none border-1 border-blueGray"
          onKeyUp={(event) => {
            if (event.key === 'Enter') {
              handleGameKeywordSearch();
            }
          }}
          ref={gameKeyword}
        />
        <Image
          width={24}
          height={24}
          src="/svgs/search.svg"
          alt="게임 검색 버튼"
          className="absolute top-1/2 right-10 -translate-y-1/2 cursor-pointer"
          onClick={handleGameKeywordSearch}
        />
      </div>
      <div className="max-h-[550px]">
        {selectedGame && (
          <button
            type="button"
            className="w-full flex flex-row gap-x-4 items-center p-4 border-t-1 border-blueGray text-sm text-primary cursor-pointer m-0 overflow-hidden bg-blueGray"
            onClick={() => {
              onSelect(null);
            }}
          >
            {selectedGame.headerImagePath && (
              <Image
                src={selectedGame.headerImagePath}
                width={48}
                height={22}
                alt="선택된 게임 사진"
              />
            )}
            <span className="text-ellipsis">{selectedGame.name}</span>
            <span className="bg-primary text-white rounded p-2">선택됨</span>
          </button>
        )}
        {games.map((value) => {
          return (
            <button
              type="button"
              key={value.id}
              id={value.id.toString()}
              className="w-full flex flex-row gap-x-4 items-center p-4 border-t-1 border-blueGray text-sm cursor-pointer hover:bg-blueGray m-0"
              onClick={() => {
                onSelect(value);
              }}
            >
              {value.headerImagePath && (
                <Image
                  src={value.headerImagePath}
                  width={48}
                  height={22}
                  alt={`${value.name}의 게임 사진`}
                  className="object-cover"
                />
              )}
              <span className="text-ellipsis">{value.name}</span>
            </button>
          );
        })}
      </div>
    </CommonModal>
  );
}
