'use client';

import React from 'react';
import { HomeCategory } from '@/types/HomeCategory';
import { Button } from '@nextui-org/react';

interface CategoryProps {
  categories: HomeCategory[];
}

const Category: React.FC<CategoryProps> = ({ categories }) => {
  return (
    <div className="flex flex-wrap">
      {categories.slice(0, 5).map((category) => (
        <Button
          key={category.id}
          size="sm"
          variant="flat"
          className="text-sm mr-2 mb-1"
          style={{
            backgroundColor: '#D2DAF8',
            color: '#2E396C',
            borderRadius: '5px',
            fontSize: '0.8rem',
            minWidth: 'auto',
            height: '24px',
          }}
          // 클릭 핸들러 추가하기
        >
          {category.name}
        </Button>
      ))}
      {categories.length > 5 && (
        <Button
          size="sm"
          variant="flat"
          className="text-sm mr-2 mb-1"
          style={{
            backgroundColor: '#D2DAF8',
            color: '#2E396C',
            borderRadius: '5px',
            fontSize: '0.8rem',
            minWidth: 'auto',
            height: '24px',
          }}
        >
          ...
        </Button>
      )}
    </div>
  );
};

export default Category;
