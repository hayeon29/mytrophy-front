'use client';

import React from 'react';
import { HomeCategory } from '@/types/HomeCategory';
import { Button, Tooltip } from '@nextui-org/react';

interface CategoryProps {
  categories: HomeCategory[];
}

function Category({ categories = [] }: CategoryProps) {
  const visibleCategories = categories.slice(0, 4);
  const hiddenCategories = categories.slice(4);

  return (
    <div className="flex flex-wrap">
      {visibleCategories.map((category) => (
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
            cursor: 'default',
          }}
          onClick={(e) => e.preventDefault()}
        >
          {category.name}
        </Button>
      ))}
      {hiddenCategories.length > 0 && (
        <Tooltip
          content={
            <div className="flex flex-wrap p-2">
              {hiddenCategories.map((category) => (
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
                    cursor: 'default',
                  }}
                  onClick={(e) => e.preventDefault()}
                >
                  {category.name}
                </Button>
              ))}
            </div>
          }
          placement="bottom"
          color="default"
          showArrow
          className="max-w-xs"
        >
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
              cursor: 'default',
            }}
            onClick={(e) => e.preventDefault()}
          >
            ...
          </Button>
        </Tooltip>
      )}
    </div>
  );
}

export default Category;
