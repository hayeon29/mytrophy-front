import React, { useState, useEffect } from 'react';
import { Divider, Tabs, Tab, Spinner } from '@nextui-org/react';
import { GetGameDetailDTO } from '@/types/GameDetail';
import { UserAllGameInfo } from '@/types/UserInfo';
import homeAPI from '@/services/home';
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
  const [reviews, setReviews] = useState<{
    [id: number]: 'NONE' | 'BAD' | 'GOOD' | 'PERFECT';
  }>({});

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
            const response = await homeAPI.getMyReview(game.id);
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
    }

    fetchReviews();
  }, [gameInfo]);

  const getFilteredGames = () => {
    if (!gameInfo) return [];
    if (selectedTab === 'all') return gameInfo;
    if (selectedTab === 'unrated') {
      return gameInfo.filter(
        (game) => game?.id !== undefined && reviews[game.id] === 'NONE'
      );
    }
    if (selectedTab === 'rated') {
      return gameInfo.filter(
        (game) => game?.id !== undefined && reviews[game.id] !== 'NONE'
      );
    }
    return gameInfo;
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
      await homeAPI.submitReview(gameId, newStatus);
    } catch (error) {
      // 에러처리
    }
  };

  const filteredGames = getFilteredGames();
  const gameCount = filteredGames.length;

  return (
    <div className="flex flex-col">
      <Tabs
        className="mb-4"
        onSelectionChange={(tabKey) => setSelectedTab(tabKey as string)}
        aria-label="User Game Rating Tabs"
        selectedKey={selectedTab}
        variant="underlined"
        color="primary"
      >
        <Tab key="all" title="전체 게임">
          전체 게임
        </Tab>
        <Tab key="unrated" title="평가되지 않은 게임">
          평가되지 않은 게임
        </Tab>
        <Tab key="rated" title="평가한 게임">
          평가한 게임
        </Tab>
      </Tabs>
      <Divider className="bg-primary mb-6" />
      <p className="font-bold mb-4">
        총 <span className="text-[#FB5D8D]">{gameCount}</span>개의 게임
      </p>
      {!isLoading ? (
        filteredGames.map((game, index) => {
          if (game === undefined) {
            return (
              <UserGameCard
                key={`undefined-${index}`}
                game={
                  {
                    id: -1,
                    name: 'mytrophy에 저장되지 않은 게임입니다',
                    headerImagePath: '/svgs/placeholder.svg',
                  } as GetGameDetailDTO
                }
                playtime={0}
                reviewStatus="NONE"
                onReviewChange={() => {}}
                isMissing
              />
            );
          }

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
              isMissing={false}
            />
          );
        })
      ) : (
        <div className="flex justify-center items-center h-32">
          <Spinner color="primary" size="lg" />
        </div>
      )}
    </div>
  );
}
