import { ModalInfo } from '@/types/ModalInfo';
import { atom } from 'recoil';

const modalState = atom<ModalInfo[]>({ key: 'modal-info', default: [] });

export { modalState };
