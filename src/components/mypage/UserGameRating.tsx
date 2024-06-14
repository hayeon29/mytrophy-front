import React, { useState, useEffect } from 'react';
import {
  Divider,
  Tabs,
  Tab,
  Spinner,
  Tooltip,
  Button,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from '@nextui-org/react';
import { GetGameDetailDTO } from '@/types/GameDetail';
import { UserAllGameInfo } from '@/types/UserInfo';
import { IoIosWarning } from 'react-icons/io'; // 아이콘 추가
import articleAPI from '@/services/article';
import UserGameCard from './UserGameCard';

interface UserGameRatingProps {
  gameInfo: GetGameDetailDTO[] | undefined;
  userGameInfo: UserAllGameInfo | undefined;
  isLoading: boolean;
}

export default function UserGameRating({
  gameInfo,
  userGameInfo,
  isLoading,
}: UserGameRatingProps) {
  const [selectedTab, setSelectedTab] = useState('all');
  const [selectedSortKey, setSelectedSortKey] = useState('highPlaytime');
  const [sortButtonText, setSortButtonText] = useState('높은 플레이시간');
  const [reviews, setReviews] = useState<{
    [id: number]: 'NONE' | 'BAD' | 'GOOD' | 'PERFECT';
  }>({});
  const [missingGamesCount, setMissingGamesCount] = useState(0);

  useEffect(() => {
    async function fetchReviews() {
      if (!gameInfo) return;

      const reviewStatuses: {
        [id: number]: 'NONE' | 'BAD' | 'GOOD' | 'PERFECT';
      } = {};
      const validGames = gameInfo.filter(
        (game): game is GetGameDetailDTO =>
          game !== undefined && game.id !== undefined
      );

      try {
        const promises = validGames.map(async (game) => {
          try {
            const response = await articleAPI.getMyReview(game.id);
            return {
              id: game.id,
              status: response.data.reviewStatus || 'NONE',
            };
          } catch (error) {
            return { id: game.id, status: 'NONE' };
          }
        });

        const results = await Promise.all(promises);
        results.forEach((result) => {
          if (result !== null && result.id !== undefined) {
            reviewStatuses[result.id] = result.status;
          }
        });

        setReviews(reviewStatuses);
      } catch (error) {
        validGames.forEach((game) => {
          if (game?.id !== undefined) {
            reviewStatuses[game.id] = 'NONE';
          }
        });
        setReviews(reviewStatuses);
      }

      const totalGames = gameInfo?.length || 0;
      const validGamesCount = validGames.length;
      setMissingGamesCount(totalGames - validGamesCount);
    }

    fetchReviews();
  }, [gameInfo]);

  const sortGames = (games: GetGameDetailDTO[]) => {
    return games.sort((a, b) => {
      const playtimeA =
        userGameInfo?.games.find((g) => g.appid === a.id)?.playtime_forever ||
        0;
      const playtimeB =
        userGameInfo?.games.find((g) => g.appid === b.id)?.playtime_forever ||
        0;
      const reviewA = reviews[a.id] || 'NONE';
      const reviewB = reviews[b.id] || 'NONE';

      switch (selectedSortKey) {
        case 'highPlaytime':
          return playtimeB - playtimeA;
        case 'lowPlaytime':
          return playtimeA - playtimeB;
        case 'highRating':
          if (reviewB === 'NONE') {
            return -1;
          }
          if (reviewA === 'NONE') {
            return 1;
          }
          return reviewB.localeCompare(reviewA);
        case 'lowRating':
          if (reviewA === 'NONE') {
            return -1;
          }
          if (reviewB === 'NONE') {
            return 1;
          }
          return reviewA.localeCompare(reviewB);
        default:
          return playtimeB - playtimeA;
      }
    });
  };

  const getFilteredGames = () => {
    if (!gameInfo) return [];
    const filteredGames = gameInfo.filter(
      (game) =>
        game !== undefined &&
        (selectedTab === 'all' ||
          (selectedTab === 'unrated' && reviews[game.id] === 'NONE') ||
          (selectedTab === 'rated' && reviews[game.id] !== 'NONE'))
    );
    return sortGames(filteredGames);
  };

  const handleReviewChange = async (
    gameId: number,
    newStatus: 'NONE' | 'BAD' | 'GOOD' | 'PERFECT'
  ) => {
    setReviews((prevReviews) => ({
      ...prevReviews,
      [gameId]: newStatus,
    }));
    try {
      await articleAPI.submitReview(gameId, newStatus);
    } catch (error) {
      // 에러처리
    }
  };

  const handleSortChange = (key: string) => {
    setSelectedSortKey(key);
    switch (key) {
      case 'highPlaytime':
        setSortButtonText('높은 플레이시간');
        break;
      case 'lowPlaytime':
        setSortButtonText('낮은 플레이시간');
        break;
      case 'highRating':
        setSortButtonText('높은 평가순');
        break;
      case 'lowRating':
        setSortButtonText('낮은 평가순');
        break;
      default:
        setSortButtonText('높은 플레이시간');
        break;
    }
  };

  const filteredGames = getFilteredGames();

  const displayGameCount = () => {
    if (!gameInfo) return 0;
    if (selectedTab === 'unrated') {
      return gameInfo.filter((game) => reviews[game?.id] === 'NONE').length;
    }
    if (selectedTab === 'rated') {
      return gameInfo.filter(
        (game) => reviews[game?.id] && reviews[game?.id] !== 'NONE'
      ).length;
    }
    return gameInfo.length;
  };

  return (
    <div className="flex flex-col">
      <Tabs
        className="mb-8"
        onSelectionChange={(tabKey) => setSelectedTab(tabKey as string)}
        aria-label="User Game Rating Tabs"
        selectedKey={selectedTab}
        variant="underlined"
        color="primary"
      >
        <Tab key="all" title="전체 게임" />
        <Tab key="unrated" title="평가되지 않은 게임" />
        <Tab key="rated" title="평가한 게임" />
      </Tabs>
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <p className="font-bold">
            총 <span className="text-[#FB5D8D]">{displayGameCount()}</span>개의
            게임
          </p>
          {selectedTab === 'all' && missingGamesCount > 0 && (
            <Tooltip
              content={`${missingGamesCount}개의 게임이 mytrophy데이터에 존재하지 않습니다.`}
            >
              <Button
                isIconOnly
                as="div"
                variant="light"
                className="text-[#FB5D8D] hover:bg-transparent focus:bg-transparent active:bg-transparent"
              >
                <IoIosWarning size={24} />
              </Button>
            </Tooltip>
          )}
        </div>
        <Dropdown>
          <DropdownTrigger>
            <Button size="sm">{sortButtonText}</Button>
          </DropdownTrigger>
          <DropdownMenu
            onAction={(key) => handleSortChange(key as string)}
            aria-label="Sort options"
          >
            <DropdownItem key="highPlaytime">높은 플레이시간</DropdownItem>
            <DropdownItem key="lowPlaytime">낮은 플레이시간</DropdownItem>
            <DropdownItem key="highRating">높은 평가순</DropdownItem>
            <DropdownItem key="lowRating">낮은 평가순</DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </div>
      <Divider className="bg-primary mt-2 mb-6" />
      {isLoading && (
        <div className="flex justify-center items-center h-32">
          <Spinner color="primary" size="lg" />
        </div>
      )}
      {!isLoading &&
        (filteredGames.length > 0 ? (
          filteredGames.map((game) => {
            const playtime =
              userGameInfo?.games.find((g) => g.appid === game.id)
                ?.playtime_forever || 0;
            const reviewStatus = reviews[game.id] || 'NONE';
            return (
              <UserGameCard
                key={game.id}
                game={game}
                playtime={playtime}
                reviewStatus={reviewStatus}
                onReviewChange={handleReviewChange}
              />
            );
          })
        ) : (
          <div className="text-center text-gray-500">
            {selectedTab === 'unrated' && '모든 게임을 평가했습니다.'}
            {selectedTab === 'rated' && '게임에 평가를 남겨보세요.'}
            {selectedTab === 'all' && '보유한 Steam 게임이 없습니다.'}
          </div>
        ))}
    </div>
  );
}
