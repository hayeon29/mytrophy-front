import { Button } from '@nextui-org/react';
import { useState } from 'react';

export default function SelectButton({
  id,
  name,
  onClick,
}: {
  id: number;
  name: string;
  onClick: (id: number) => boolean;
}) {
  const [isClicked, setIsClicked] = useState(false);
  const handleButtonClick = () => {
    if (onClick(id)) {
      setIsClicked((prevIsClicked) => !prevIsClicked);
    }
  };
  return (
    <Button
      id={`${id}`}
      radius="full"
      size="sm"
      className={`w-fit inline-block bg-white border-primary border ${isClicked && 'bg-primary text-white'}`}
      onClick={handleButtonClick}
    >
      {name}
    </Button>
  );
}
