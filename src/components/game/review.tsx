'use client';

import React, { useEffect, useState, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import gameAPI from '@/services/game';

export default function GameReview({ gameDetail }) {
  return (
    <div>
      <h2>qweqwe</h2>
      <span>{gameDetail.id}</span>
    </div>
  );
}
