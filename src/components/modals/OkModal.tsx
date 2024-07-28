import { useModal } from '@/hooks/useModal';
import { useEffect } from 'react';
import CommonModal from './CommonModal';

export default function OkModal({
  title = '',
  message,
  onClick,
}: {
  title?: string;
  message: string;
  onClick?: (...args: unknown[]) => void;
}) {
  const { closeModal } = useModal();

  useEffect(() => {
    return () => {
      closeModal();
    };
  }, [closeModal]);

  return (
    <CommonModal title={title} onClose={onClick || closeModal}>
      <div className="p-4 flex flex-col gap-y-6">
        <p className="text-center">{message}</p>
        <div className="flex justify-end">
          <button
            type="button"
            className="bg-primary text-white px-3 py-2 rounded self-end"
            onClick={onClick || closeModal}
          >
            닫기
          </button>
        </div>
      </div>
    </CommonModal>
  );
}
