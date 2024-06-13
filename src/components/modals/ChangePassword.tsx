import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from '@nextui-org/react';
import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import VALIDATION from '@/constants/validation';

export default function ChangePassword({
  onClick,
}: {
  onClick: (...args: unknown[]) => void;
}) {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isCheckPasswordVisible, setIsCheckPasswordVisible] = useState(false);

  const [userInfo, setUserInfo] = useState({
    password: '',
    checkPassword: '',
  });

  const [checkMessage, setCheckMessage] = useState({
    password: '',
    checkPassword: '',
  });

  const handlePasswordCheck = () => {
    setIsPasswordVisible((prev) => !prev);
  };

  const handleCheckPasswordCheck = () => {
    setIsCheckPasswordVisible((prev) => !prev);
  };

  const handleInput = (event: React.FormEvent<HTMLInputElement>) => {
    const { name, value } = event.target as HTMLInputElement;
    if (name === 'password') {
      const newValidationMessage = VALIDATION.password
        .filter((eachCondition) => !eachCondition.validateFunction(value))
        .map((eachCondition) => eachCondition.name)
        .join(', ');
      setCheckMessage({ ...checkMessage, password: newValidationMessage });
    } else if (name === 'checkPassword') {
      if (userInfo.password !== value) {
        setCheckMessage({
          ...checkMessage,
          checkPassword: '비밀번호가 일치하지 않습니다.',
        });
      } else {
        setCheckMessage({
          ...checkMessage,
          checkPassword: '',
        });
      }
    }

    setUserInfo({ ...userInfo, [name]: value });
  };

  const isChangePasswordAvailable = useMemo(() => {
    return (
      userInfo.password === userInfo.checkPassword &&
      userInfo.password.length > 0 &&
      userInfo.checkPassword.length > 0
    );
  }, [userInfo]);

  const handleChangePasswordSubmit = (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    console.log(userInfo);
  };

  useEffect(() => {
    onOpen();
    return () => {
      onClose();
    };
  }, [onOpen, onClose]);

  return (
    <Modal isOpen={isOpen} onClose={onClick}>
      <ModalContent>
        <ModalHeader>비밀번호 변경</ModalHeader>
        <ModalBody>
          <form onSubmit={handleChangePasswordSubmit}>
            <div className="w-full">
              <label className="font-bold block mb-3" htmlFor="password">
                비밀번호
              </label>
              <Input
                id="password"
                name="password"
                variant="bordered"
                classNames={{
                  inputWrapper: [
                    'group-data-[focus=true]:border-primary',
                    'h-12',
                  ],
                  input: [
                    'autofill:transition-colors autofill:shadow-disabled',
                  ],
                }}
                type={isPasswordVisible ? 'text' : 'password'}
                endContent={
                  <Image
                    src={
                      isPasswordVisible
                        ? `/svgs/visibility_off_24dp.svg`
                        : `/svgs/visibility_24dp.svg`
                    }
                    alt="password visibility icon"
                    width={28}
                    height={24}
                    className="absolute top-2/4 right-3 translate-y-[-50%] cursor-pointer w-7 h-6"
                    onClick={handlePasswordCheck}
                  />
                }
                placeholder="비밀번호를 입력해주세요"
                onChange={handleInput}
                isInvalid={
                  checkMessage.password.length > 0 &&
                  userInfo.password.length > 0
                }
                errorMessage={checkMessage.password}
              />
            </div>
            <div className="w-full">
              <label className="font-bold block mb-3" htmlFor="checkPassword">
                비밀번호 확인
              </label>
              <Input
                id="checkPassword"
                name="checkPassword"
                variant="bordered"
                classNames={{
                  inputWrapper: [
                    'group-data-[focus=true]:border-primary',
                    'h-12',
                  ],
                  input: [
                    'autofill:transition-colors autofill:shadow-disabled',
                  ],
                }}
                type={isCheckPasswordVisible ? 'text' : 'password'}
                endContent={
                  <Image
                    src={
                      isCheckPasswordVisible
                        ? `/svgs/visibility_off_24dp.svg`
                        : `/svgs/visibility_24dp.svg`
                    }
                    alt="password visibility icon"
                    width={28}
                    height={24}
                    className="absolute top-2/4 right-3 translate-y-[-50%] cursor-pointer w-7 h-6"
                    onClick={handleCheckPasswordCheck}
                  />
                }
                placeholder="확인을 위해 비밀번호를 한 번 더 입력해주세요."
                onChange={handleInput}
                isInvalid={
                  checkMessage.checkPassword.length > 0 ||
                  (userInfo.checkPassword !== userInfo.password &&
                    userInfo.checkPassword.length > 0)
                }
                errorMessage={checkMessage.checkPassword}
              />
            </div>
          </form>
        </ModalBody>
        <ModalFooter>
          <Button
            color="primary"
            className="text-white"
            isDisabled={!isChangePasswordAvailable}
          >
            변경
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
