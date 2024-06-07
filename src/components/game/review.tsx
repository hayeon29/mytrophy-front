'use client';

import { GetGameDetailDTO } from '@/types/GameDetail';
import React from 'react';

export default function GameReview({
  gameDetail,
}: {
  gameDetail: GetGameDetailDTO;
}) {
  return (
    <div>
      <h2>qweqwe</h2>
      <span>{gameDetail.id}</span>
    </div>
  );
}
