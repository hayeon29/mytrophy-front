import { ReactElement } from 'react';

type ModalInfo = {
  component: ReactElement | keyof JSX.IntrinsicElements;
  id: string;
};

export type { ModalInfo };
