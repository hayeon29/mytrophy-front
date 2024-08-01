import { useModal } from '@/hooks/useModal';
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

  return (
    <CommonModal title={title} onClose={closeModal}>
      <div className="p-4 flex flex-col gap-y-6 text-sm">
        <p className="text-center">{message}</p>
        <button
          type="button"
          className="w-full bg-primary text-white px-3 py-2 rounded self-end"
          onClick={() => {
            if (onClick) {
              onClick();
            }
            closeModal();
          }}
        >
          닫기
        </button>
      </div>
    </CommonModal>
  );
}
