'use client';

import { GetGameDetailDTO } from '@/types/GameDetail';
import React from 'react';

export default function GameSimilar({
  gameDetail,
}: {
  gameDetail: GetGameDetailDTO;
}) {
  return (
    <div>
      <h2>유사한 게임</h2>
      <span>{gameDetail.id}</span>
    </div>
  );
}
