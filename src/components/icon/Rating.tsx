'use client';

import { useRef, useState } from 'react';
import COLOR_FILL from '@/constants/color';
import Star from './Star';

export default function Rating() {
  const clickedPos = useRef<HTMLDivElement>(null);
  const [eachStarRating, setEachStarRating] = useState<
    (keyof typeof COLOR_FILL)[]
  >(['empty', 'empty', 'empty', 'empty', 'empty']);

  const handleRatingClick = (event: React.MouseEvent<HTMLDivElement>) => {
    const eventTarget = event.target;
    if (eventTarget instanceof HTMLDivElement) {
      const targetValue = Number(eventTarget.ariaValueText) * 0.5;
      const newStarRating: (keyof typeof COLOR_FILL)[] = Array(5);
      for (let i = 0; i < 5; i += 1) {
        if (i < targetValue) {
          if (i > targetValue - 1) {
            newStarRating[i] = 'mid';
          } else {
            newStarRating[i] = 'fill';
          }
        } else {
          newStarRating[i] = 'empty';
        }
      }
      setEachStarRating(newStarRating);
    }
  };

  return (
    <div className="flex relative">
      <div className="flex flex-row">
        <Star fill={eachStarRating[0]} />
        <Star fill={eachStarRating[1]} />
        <Star fill={eachStarRating[2]} />
        <Star fill={eachStarRating[3]} />
        <Star fill={eachStarRating[4]} />
      </div>
      <div
        className="w-[120px] h-6 absolute top-0 left-0 flex flex-row cursor-pointer"
        ref={clickedPos}
        onClick={handleRatingClick}
        role="presentation"
      >
        <div className="w-3 h-full" aria-valuetext="1" />
        <div className="w-3 h-full" aria-valuetext="2" />
        <div className="w-3 h-full" aria-valuetext="3" />
        <div className="w-3 h-full" aria-valuetext="4" />
        <div className="w-3 h-full" aria-valuetext="5" />
        <div className="w-3 h-full" aria-valuetext="6" />
        <div className="w-3 h-full" aria-valuetext="7" />
        <div className="w-3 h-full" aria-valuetext="8" />
        <div className="w-3 h-full" aria-valuetext="9" />
        <div className="w-3 h-full" aria-valuetext="10" />
      </div>
    </div>
  );
}
