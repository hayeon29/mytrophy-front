'use client';

import React, { useEffect, useState } from 'react';
import gameAPI from '@/services/game';

export default function GameSimilar({ gameDetail }) {
  return (
    <div>
      <h2>유사한 게임</h2>
      <span>{gameDetail.id}</span>
    </div>
  );
}
