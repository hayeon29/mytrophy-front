'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function Modal({
  children,
  title,
}: {
  children: React.ReactNode;
  title?: string;
}) {
  const router = useRouter();

  return (
    <div>
      <div className="w-screen h-dvh fixed bg-black bg-opacity-50 top-0 left-0 z-10" />
      <div className="bg-white rounded-2xl z-20 fixed w-[800px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <div
          className={`${title && 'border-b-1 border-disable'} p-5 flex flex-row justify-between`}
        >
          <h2 className="text-xl font-bold">{title}</h2>
          <Image
            src="/svgs/close.svg"
            alt="모달창 닫기 버튼"
            width={24}
            height={24}
            onClick={() => router.back()}
            className="cursor-pointer"
            role="presentation"
          />
        </div>
        {children}
      </div>
    </div>
  );
}
