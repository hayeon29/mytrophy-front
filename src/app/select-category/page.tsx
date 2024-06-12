'use client';

import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
} from '@nextui-org/react';
import GAME_CATEGORY from '@/constants/gameCategory';
import SelectButton from '@/components/button/SelectButton';
import { ReactElement, useState } from 'react';
import Link from 'next/link';
import { GameCategory } from '@/types/GameCategory';

export default function SelectCategory(): ReactElement {
  const [selectedCategories, setSelectedCategories] = useState<GameCategory[]>(
    []
  );
  const handleClick = (id: number) => {
    const selectedCategory = GAME_CATEGORY.find((value) => value.id === id);
    if (selectedCategory !== undefined && selectedCategories.length < 3) {
      setSelectedCategories((prevCategories) => [
        ...prevCategories,
        selectedCategory,
      ]);
      return true;
    }
    return false;
  };

  const handleSubmit = () => {
    // const idOfSelectedGames = selectedCategories.map(({ id }) => id);
  };

  return (
    <div className="w-screen min-h-dvh bg-gradient-to-br from-primary to-second flex items-center justify-center">
      <Card className="w-2/5 p-6">
        <CardHeader className="flex justify-center">
          <h4 className="text-black font-extrabold text-xl">
            선호하는 카테고리를 골라주세요.
          </h4>
        </CardHeader>
        <CardBody className="w-full">
          <div className="w-full flex flex-rows flex-wrap justify-center gap-2">
            {GAME_CATEGORY.map(({ id, name }) => {
              return (
                <SelectButton
                  key={id}
                  id={id}
                  name={name}
                  onClick={handleClick}
                />
              );
            })}
          </div>
        </CardBody>
        <CardFooter className="flex justify-between items-center">
          <Link href="/" className="text-blackGray text-sm">
            지금은 넘어가기
          </Link>
          <Button
            isDisabled={
              selectedCategories === null || selectedCategories.length === 0
            }
            className="bg-primary text-white"
            onClick={handleSubmit}
          >
            제출하기
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
