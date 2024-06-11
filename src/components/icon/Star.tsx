import COLOR_FILL from '@/constants/color';
import Image from 'next/image';

export default function Star({
  fill = 'empty',
}: {
  fill?: keyof typeof COLOR_FILL;
}) {
  return (
    <>
      {fill === 'empty' && (
        <Image
          src="/svgs/star-empty.svg"
          width={24}
          height={24}
          alt="star empty icon"
        />
      )}
      {fill === 'mid' && (
        <Image
          src="/svgs/star-mid.svg"
          width={24}
          height={24}
          alt="star mid icon"
        />
      )}
      {fill === 'fill' && (
        <Image
          src="/svgs/star-fill.svg"
          width={24}
          height={24}
          alt="star fill icon"
        />
      )}
    </>
  );
}
