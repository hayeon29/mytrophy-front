import { modalState } from '@/recoils/modalAtom';
import { ModalInfo } from '@/types/ModalInfo';
import { ReactElement, useCallback } from 'react';
import { useRecoilState } from 'recoil';

export function useModal() {
  const [modal, setModal] = useRecoilState<ModalInfo>(modalState);

  const openModal = useCallback(
    (component: ReactElement) => {
      setModal({ component, isOpen: true });
    },
    [setModal]
  );

  const closeModal = () => {
    setModal({ component: null, isOpen: false });
  };

  return { modal, openModal, closeModal };
}
