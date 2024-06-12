import React from 'react';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from '@nextui-org/react';
import {
  FaRegFaceFrown,
  FaRegFaceGrin,
  FaRegFaceGrinSquint,
} from 'react-icons/fa6';

function GameReviewModal({
  visible,
  onClose,
  onSubmit,
  gameName,
  backgroundImage,
}) {
  return (
    <Modal isOpen={visible} onOpenChange={onClose}>
      <ModalContent
        style={{
          position: 'relative',
          overflow: 'hidden',
        }}
        className="relative p-8 rounded-lg"
      >
        <div
          style={{
            backgroundImage: `url(${backgroundImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            position: 'absolute',
            inset: 0,
            zIndex: -1,
            filter: 'blur(20px)', // 블러 효과
            opacity: 0.8, // 연한 배경 효과
          }}
        />

        {/* 모달 내용 */}
        <div className="relative z-10">
          <ModalHeader className="flex flex-col items-center text-gray-800">
            <div className="font-bold text-xl">{gameName}</div>
            <div className="font-semibold text-lg text-gray-500">
              게임이 마음에 드시나요?
            </div>
          </ModalHeader>
          <ModalBody className="flex flex-row items-center justify-center space-x-4">
            <Button
              isIconOnly
              aria-label="별로에요"
              onPress={() => onSubmit('BAD')}
              className="hover:text-red-500 bg-transparent"
            >
              <FaRegFaceFrown size={40} />
            </Button>
            <Button
              isIconOnly
              aria-label="좋아요"
              onPress={() => onSubmit('GOOD')}
              className="hover:text-yellow-500 bg-transparent"
            >
              <FaRegFaceGrin size={40} />
            </Button>
            <Button
              isIconOnly
              aria-label="최고에요"
              onPress={() => onSubmit('PERFECT')}
              className="hover:text-green-500 bg-transparent"
            >
              <FaRegFaceGrinSquint size={40} />
            </Button>
          </ModalBody>
          <ModalFooter> </ModalFooter>
        </div>
      </ModalContent>
    </Modal>
  );
}

export default GameReviewModal;
