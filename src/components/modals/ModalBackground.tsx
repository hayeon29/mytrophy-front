'use client';

import { useModal } from '@/hooks/useModal';
import { useRef } from 'react';

export default function ModalBackGround() {
  const { modal, closeModal } = useModal();
  const backgroundRef = useRef<HTMLDivElement>(null);

  const handleBGClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.target === backgroundRef.current) {
      closeModal();
    }
  };

  return (
    <div>
      {modal.component !== null && (
        <>
          <div
            role="presentation"
            className="w-full h-full fixed bg-black bg-opacity-30 top-0 left-0 z-10"
            ref={backgroundRef}
            onClick={handleBGClick}
          />
          {modal.component}
        </>
      )}
    </div>
  );
}
