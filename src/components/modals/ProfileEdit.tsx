import VALIDATION from '@/constants/validation';
import { useModal } from '@/hooks/useModal';
import { userState } from '@/recoils/userAtom';
import membersAPI from '@/services/members';
import { UserEditInfo, UserInfo } from '@/types/UserInfo';
import {
  Avatar,
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from '@nextui-org/react';
import { FormEvent, useEffect, useMemo, useRef, useState } from 'react';
import { useRecoilState } from 'recoil';
import OkModal from './OkModal';
import ChangePassword from './ChangePassword';

export default function ProfileEdit({
  onClick,
}: {
  onClick: (...args: unknown[]) => void;
}) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { modals, openModal, closeModal } = useModal();
  const [userEditInfo, setUserEditInfo] = useRecoilState(userState);
  const fileInput = useRef<HTMLInputElement>(null);

  const [userInfo, setUserInfo] = useState<UserEditInfo>({
    username: '',
    nickname: '',
    name: '',
    email: '',
    imagePath: '',
  });

  const [userFile, setUserFile] = useState<File>(null);

  const [checkMessage, setCheckMessage] = useState<UserEditInfo>({
    username: '',
    email: '',
  });

  const [isUsernameExistChecked, setIsUsernameExistChecked] =
    useState<boolean>(true);

  const handleUserExistClick = async () => {
    try {
      const isMemberExist = await membersAPI
        .isMemberExist(userInfo.username)
        .then((response) => response.data);
      if (isMemberExist) {
        openModal(
          <OkModal message="중복된 아이디입니다." onClick={closeModal} />
        );
        setCheckMessage({ ...checkMessage, username: '아이디가 중복됩니다.' });
      } else {
        openModal(
          <OkModal message="사용 가능한 아이디입니다." onClick={closeModal} />
        );
        setIsUsernameExistChecked(false);
      }
    } catch (error) {
      // 에러 메시지 모달창 출력
    }
  };

  const handleInput = (event: FormEvent<HTMLInputElement>) => {
    const { name, value } = event.target as HTMLInputElement;
    if (VALIDATION[name] !== undefined) {
      const newValidationMessage = VALIDATION[name]
        .filter((eachCondition) => !eachCondition.validateFunction(value))
        .map((eachCondition) => eachCondition.name)
        .join(', ');
      setCheckMessage({ ...checkMessage, [name]: newValidationMessage });
    }
    setUserInfo({ ...userInfo, [name]: value });
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const target = event.currentTarget;
    const files = (target.files as FileList)[0];

    if (files === undefined) {
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(files);
    reader.onloadend = () => {
      setUserInfo({
        ...userInfo,
        imagePath: reader.result as string,
      });
    };

    setUserFile(files);
  };

  const handleSubmitUserInfoEdit = async (fileName?: string) => {
    const response = await membersAPI.updateMemberById(userEditInfo.id, {
      ...userInfo,
      imagePath:
        fileName !== undefined && fileName !== null
          ? fileName
          : userEditInfo.imagePath,
    });

    if (response === '회원 수정 성공') {
      const memberInfo = await membersAPI.getUserInfo();
      const { username, id, nickname, steamId, name, email, imagePath } =
        memberInfo.data as UserInfo;
      setUserEditInfo({
        username,
        id,
        nickname,
        name,
        email,
        steamId,
        imagePath,
      });
      openModal(
        <OkModal
          message="회원 수정이 성공했습니다."
          onClick={() => {
            closeModal();
            onClick();
          }}
        />
      );
    } else {
      openModal(
        <OkModal message="회원 수정이 실패했습니다." onClick={closeModal} />
      );
    }
  };

  const handleSubmitFileEdit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (userFile !== null) {
      const profilePicFormData = new FormData();
      profilePicFormData.append('file', userFile);
      const fileChangeResponse =
        await membersAPI.updateMemberProfilePic(profilePicFormData);
      if (fileChangeResponse.status === 201) {
        await handleSubmitUserInfoEdit(fileChangeResponse.data);
      }
    } else {
      await handleSubmitUserInfoEdit();
    }
  };

  const handleChangePasswordClick = () => {
    openModal(<ChangePassword onClick={closeModal} />);
  };

  const isEditInfoAvailable = useMemo(() => {
    return (
      Object.keys(userInfo).some((eachKey: keyof UserInfo) => {
        return userInfo[eachKey] !== userEditInfo[eachKey];
      }) &&
      Object.keys(checkMessage).every((eachMessage: keyof UserEditInfo) => {
        return checkMessage[eachMessage].length === 0;
      })
    );
  }, [userEditInfo, userInfo, checkMessage]);

  useEffect(() => {
    onOpen();
    const { username, nickname, name, email, imagePath } = userEditInfo;
    setUserInfo({ username, nickname, name, email, imagePath });
    return () => {
      onClose();
    };
  }, [onOpen, onClose, userEditInfo]);

  return (
    <>
      {modals.length > 0 &&
        modals.map(({ component, id }) => {
          return <div key={id}>{component}</div>;
        })}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalContent>
          <ModalHeader>프로필 수정</ModalHeader>
          <form onSubmit={handleSubmitFileEdit}>
            <ModalBody>
              <div className="w-full">
                <div className="flex flex-col items-center gap-4">
                  <Avatar
                    src={
                      userInfo.imagePath !== null
                        ? userInfo.imagePath
                        : '/svgs/person.svg'
                    }
                    className="bg-lightGray rounded-full w-16 h-16"
                  />
                  <label
                    className="bg-primary px-4 min-w-20 h-10 inline-flex items-center justify-center rounded-xl text-white text-sm"
                    htmlFor="edit"
                  >
                    프로필 사진 변경
                  </label>
                </div>
                <input
                  type="file"
                  id="edit"
                  name="edit"
                  className="hidden"
                  onChange={handleFileChange}
                  ref={fileInput}
                />
              </div>
              <div className="w-full">
                <label className="font-bold block mb-3" htmlFor="username">
                  아이디
                </label>
                <div className="flex gap-x-2">
                  <Input
                    id="username"
                    name="username"
                    classNames={{
                      inputWrapper: [
                        'group-data-[focus=true]:border-primary',
                        'h-12',
                      ],
                      input: [
                        'autofill:transition-colors autofill:shadow-disabled',
                      ],
                    }}
                    variant="bordered"
                    placeholder="아이디를 입력해주세요"
                    onChange={handleInput}
                    defaultValue={userInfo.username}
                    isInvalid={
                      (checkMessage.username.length > 0 ||
                        userInfo.username.length === 0) &&
                      isUsernameExistChecked
                    }
                    errorMessage={checkMessage.username}
                  />
                  <Button
                    color="primary"
                    className="text-white h-12 px-8"
                    onClick={handleUserExistClick}
                    isDisabled={userInfo.username === userEditInfo.username}
                  >
                    아이디 확인
                  </Button>
                </div>
              </div>
              <div className="w-full">
                <span className="font-bold block mb-3">비밀번호 변경</span>
                <Button
                  color="primary"
                  className="text-white"
                  onClick={handleChangePasswordClick}
                >
                  비밀번호 변경
                </Button>
              </div>
              <div className="w-full">
                <label className="font-bold block mb-3" htmlFor="email">
                  이메일
                </label>
                <Input
                  type="email"
                  id="email"
                  name="email"
                  classNames={{
                    inputWrapper: [
                      'group-data-[focus=true]:border-primary',
                      'h-12',
                    ],
                    input: [
                      'autofill:transition-colors autofill:shadow-disabled',
                    ],
                  }}
                  variant="bordered"
                  placeholder="이메일을 입력해주세요."
                  onChange={handleInput}
                  defaultValue={userInfo.email}
                  isInvalid={
                    checkMessage.email.length > 0 && userInfo.email.length > 0
                  }
                  errorMessage={checkMessage.email}
                />
              </div>
              <div className="w-full">
                <label className="font-bold block mb-3" htmlFor="name">
                  이름
                </label>
                <Input
                  type="text"
                  id="name"
                  name="name"
                  classNames={{
                    inputWrapper: [
                      'group-data-[focus=true]:border-primary',
                      'h-12',
                    ],
                    input: [
                      'autofill:transition-colors autofill:shadow-disabled',
                    ],
                  }}
                  variant="bordered"
                  placeholder="이름을 입력해주세요."
                  onChange={handleInput}
                  defaultValue={userInfo.name}
                />
              </div>
              <div className="w-full">
                <label className="font-bold block mb-3" htmlFor="nickname">
                  닉네임
                </label>
                <Input
                  type="text"
                  id="nickname"
                  name="nickname"
                  classNames={{
                    inputWrapper: [
                      'group-data-[focus=true]:border-primary',
                      'h-12',
                    ],
                    input: [
                      'autofill:transition-colors autofill:shadow-disabled',
                    ],
                  }}
                  variant="bordered"
                  placeholder="닉네임을 입력해주세요."
                  onChange={handleInput}
                  defaultValue={userInfo.nickname}
                />
              </div>
            </ModalBody>
            <ModalFooter>
              <Button
                type="submit"
                color="primary"
                className="text-white"
                isDisabled={!isEditInfoAvailable}
              >
                변경
              </Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>
    </>
  );
}
