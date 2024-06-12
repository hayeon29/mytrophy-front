import { ModalInfo } from '@/types/ModalInfo';
import { ReactElement, useCallback, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

export function useModal() {
  const [modals, setModals] = useState<ModalInfo[]>([]);

  const openModal = useCallback(
    (component: ReactElement) => {
      setModals((prevModals) => [...prevModals, { component, id: uuidv4() }]);
    },
    [setModals]
  );

  const closeModal = () => {
    const newModal = modals.splice(modals.length - 1);
    setModals(newModal);
  };

  return { modals, openModal, closeModal };
}
