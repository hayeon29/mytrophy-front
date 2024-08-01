import Image from 'next/image';

export default function CommonModal({
  title,
  onClose,
  size,
  children,
}: {
  title?: string;
  onClose: (...args: unknown[]) => void;
  size?: 'small' | 'middle' | 'large';
  children: React.ReactNode;
}) {
  const modalSize = {
    small: 'min-w-64 w-1/6',
    middle: 'min-w-modalMiddle w-1/2',
  };

  return (
    <div>
      <div
        className={`bg-white rounded-2xl z-30 fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 drop-shadow-primary ${size ? modalSize[size] : modalSize.small}`}
      >
        <div
          className={`${title && 'border-b-1 border-disable'} p-5 flex flex-row justify-between`}
        >
          <h2 className="text-xl font-bold">{title}</h2>
          <Image
            src="/svgs/close.svg"
            alt="모달창 닫기 버튼"
            width={24}
            height={24}
            onClick={() => onClose()}
            className="cursor-pointer"
            role="presentation"
          />
        </div>
        {children}
      </div>
    </div>
  );
}
