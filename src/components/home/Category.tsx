'use client';

import React from 'react';
import { HomeCategory } from '@/types/HomeCategory';

function Category({ categories }: { categories: HomeCategory[] }) {
  return (
    <div className="flex flex-row gap-2 overflow-auto scrollbar">
      {categories.map((category) => (
        <span
          key={category.id}
          className="text-xs px-1.5 py-0.5 bg-lightBlue text-blueBlack rounded-sm shrink-0 overflow-hidden"
        >
          {category.name}
        </span>
      ))}
    </div>
  );
}

export default Category;
