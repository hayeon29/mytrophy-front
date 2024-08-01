import { useModal } from '@/hooks/useModal';
import { useEffect } from 'react';
import CommonModal from './CommonModal';

export default function OkCancelModal({
  title = '',
  message,
  okMessage,
  onOk,
  onCancel,
}: {
  title?: string;
  message: string;
  okMessage: string;
  onOk?: (...args: unknown[]) => void;
  onCancel?: (...args: unknown[]) => void;
}) {
  const { closeModal } = useModal();

  useEffect(() => {
    return () => {
      closeModal();
    };
  }, [closeModal]);

  return (
    <CommonModal title={title} onClose={closeModal}>
      <div className="px-4 pb-4 flex flex-col gap-y-6 text-sm">
        <p className="text-center">{message}</p>
        <div className="grid grid-cols-2 gap-x-4">
          <button
            type="button"
            className="bg-primary text-white px-3 py-2 rounded self-end"
            onClick={() => {
              if (onOk) {
                onOk();
              }
              closeModal();
            }}
          >
            {okMessage}
          </button>
          <button
            type="button"
            className="bg-second text-white px-3 py-2 rounded self-end"
            onClick={() => {
              if (onCancel) {
                onCancel();
              }
              closeModal();
            }}
          >
            취소
          </button>
        </div>
      </div>
    </CommonModal>
  );
}
