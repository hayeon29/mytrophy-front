import { ReactElement } from 'react';

type ModalInfo = {
  component: ReactElement | keyof JSX.IntrinsicElements;
  isOpen: boolean;
};

export type { ModalInfo };
