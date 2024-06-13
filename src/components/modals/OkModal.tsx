/* eslint-disable react/require-default-props */
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from '@nextui-org/react';
import { useEffect } from 'react';

export default function OkModal({
  title = '',
  message,
  onClick,
}: {
  title?: string;
  message: string;
  onClick: (...args: unknown[]) => void;
}) {
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    onOpen();
    return () => {
      onClose();
    };
  }, [onOpen, onClose]);

  return (
    <Modal isOpen={isOpen} onClose={onClick} size="xs">
      <ModalContent>
        <ModalHeader>{title}</ModalHeader>
        <ModalBody>{message}</ModalBody>
        <ModalFooter>
          <Button color="primary" className="text-white" onPress={onClick}>
            닫기
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
