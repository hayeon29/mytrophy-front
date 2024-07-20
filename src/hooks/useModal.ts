import { modalState } from '@/recoils/modalAtom';
import { ModalInfo } from '@/types/ModalInfo';
import { ReactElement, useCallback } from 'react';
import { useRecoilState } from 'recoil';
import { v4 as uuidv4 } from 'uuid';

export function useModal() {
  const [modals, setModals] = useRecoilState<ModalInfo[]>(modalState);

  const openModal = useCallback(
    (component: ReactElement) => {
      setModals((prevModals) => [...prevModals, { component, id: uuidv4() }]);
    },
    [setModals]
  );

  const closeModal = () => {
    setModals((prevModal) =>
      prevModal.filter((_, index) => index !== prevModal.length - 1)
    );
  };

  return { modals, openModal, closeModal };
}
