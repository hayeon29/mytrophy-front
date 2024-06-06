'use client';

import { useState } from 'react';
import {
  Button,
  Image,
  Card,
  CardHeader,
  CardBody,
  Avatar,
  Pagination,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Input,
  Textarea,
  Checkbox,
} from '@nextui-org/react';

export default function Article() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const modalPlacement = 'center';
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [checkedFiles, setCheckedFiles] = useState<boolean[]>([]);
  const [activeButton, setActiveButton] = useState('');

  const handleButtonClick = (buttonName: string) => {
    setActiveButton(buttonName);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const filesList = e.target.files;
    if (!filesList) return; // 파일이 선택되지 않은 경우

    const filesArray = Array.from(filesList);
    setSelectedFiles((prevFiles: File[]) => [...prevFiles, ...filesArray]);
    setCheckedFiles((prevChecked: boolean[]) => [
      ...prevChecked,
      ...filesArray.map(() => false),
    ]);
  };

  const handleCheckboxChange = (index: number) => {
    setCheckedFiles((prevChecked) => {
      const newChecked = [...prevChecked];
      newChecked[index] = !newChecked[index];
      return newChecked;
    });
  };

  const handleDeleteSelectedFiles = () => {
    const newSelectedFiles = selectedFiles.filter(
      (_, index) => !checkedFiles[index]
    );
    const newCheckedFiles = checkedFiles.filter((checked) => !checked);
    setSelectedFiles(newSelectedFiles);
    setCheckedFiles(newCheckedFiles);
  };

  const handleDeleteAllFiles = () => {
    setSelectedFiles([]);
    setCheckedFiles([]);
  };

  return (
    <div className="bg-white h-screen mx-auto">
      <div className="max-w-7xl mx-auto relative bg-white pt-4">
        <div className="flex justify-left items-center p-0 gap-4">
          <Button color="primary" variant="ghost">
            자유
          </Button>
          <Button color="primary" variant="ghost">
            정보
          </Button>
          <Button color="primary" variant="ghost">
            공략
          </Button>
          <Button color="primary" variant="ghost">
            리뷰
          </Button>
        </div>
      </div>
      <div className="bg-white flex justify-center items-center py-4">
        <div className="w-full max-w-7xl border border-gray p-4 flex items-center rounded-lg h-26 shadow-md text-left">
          <Image
            width={64}
            alt="main profile image"
            src="/svgs/mainprofile.svg"
          />
          <Button
            color="default"
            variant="faded"
            className="ml-4 flex-grow test-small"
            onPress={onOpen}
          >
            클릭 후 글을 작성해보세요.
          </Button>
        </div>
      </div>

      {/* 게시글 작성 모달창 */}
      <Modal
        isOpen={isOpen}
        size="4xl"
        onOpenChange={onOpenChange}
        placement={modalPlacement}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                게시글 작성
              </ModalHeader>
              <ModalBody>
                <div className="flex gap-2">
                  <Button
                    color="primary"
                    variant={activeButton === '자유' ? 'solid' : 'ghost'}
                    onClick={() => handleButtonClick('자유')}
                  >
                    자유
                  </Button>
                  <Button
                    color="primary"
                    variant={activeButton === '정보' ? 'solid' : 'ghost'}
                    onClick={() => handleButtonClick('정보')}
                  >
                    정보
                  </Button>
                  <Button
                    color="primary"
                    variant={activeButton === '공략' ? 'solid' : 'ghost'}
                    onClick={() => handleButtonClick('공략')}
                  >
                    공략
                  </Button>
                  <Button
                    color="primary"
                    variant={activeButton === '리뷰' ? 'solid' : 'ghost'}
                    onClick={() => handleButtonClick('리뷰')}
                  >
                    리뷰
                  </Button>
                </div>
                <p>게임 검색</p>
                <Input type="text" label="게임을 검색해주세요." />
                <hr style={{ border: '1px solid #ddd' }} />
                <p>제목</p>
                <Input placeholder="제목을 입력해주세요." className="mb-4" />
                <p>내용</p>
                <Textarea placeholder="내용을 입력해주세요." className="mb-4" />
                <hr style={{ border: '1px solid #ddd' }} />
                {/*  파일 업로드  */}
                <div
                  style={{ display: 'flex', gap: '10px', alignItems: 'center' }}
                >
                  <label
                    htmlFor="fileUpload"
                    style={{
                      cursor: 'pointer',
                      maxWidth: '81px',
                      border: '1px solid #ccc',
                      padding: '5px',
                      borderRadius: '5px',
                    }}
                  >
                    파일 선택
                  </label>
                  <Button
                    color="danger"
                    variant="light"
                    onClick={handleDeleteAllFiles}
                  >
                    파일 전체 삭제
                  </Button>
                  <Button
                    color="danger"
                    variant="light"
                    onClick={handleDeleteSelectedFiles}
                  >
                    선택된 파일 삭제
                  </Button>
                </div>
                <input
                  type="file"
                  multiple
                  id="fileUpload"
                  onChange={handleFileChange}
                  style={{ display: 'none' }}
                />
                {selectedFiles.map((file) => (
                  <div key={file.name}>
                    <label>
                      <Checkbox
                        checked={!!checkedFiles[selectedFiles.indexOf(file)]}
                        onChange={() =>
                          handleCheckboxChange(selectedFiles.indexOf(file))
                        }
                      />
                      <span>{file.name}</span>
                    </label>
                  </div>
                ))}
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  취소
                </Button>
                <Button color="primary" onPress={onClose}>
                  작성
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      {/* 게시글 Card */}
      <div className="flex justify-center items-center py-4">
        <Card className="w-full max-w-7xl">
          <CardHeader className="justify-between flex-row px-6 py-4">
            <div className="flex gap-5 items-center">
              <Avatar
                isBordered
                radius="full"
                size="md"
                src="/svgs/profile.svg"
              />
              <div className="flex gap-1 items-center">
                <h4 className="text-small font-semibold leading-none text-default-600">
                  유저 이름
                </h4>
                <h5 className="text-small tracking-tight text-default-400">
                  유저 아이디
                </h5>
              </div>
            </div>
            <div className="flex gap-3 items-center">
              <Image width={16} alt="vector" src="/svgs/vector.svg" />
              <span className="text-sm text-gray-500 text-default-400">10</span>
              <Image width={16} alt="comment" src="/svgs/commenticon.svg" />
              <span className="text-sm text-gray-500 text-default-400">5</span>
            </div>
          </CardHeader>
          <div className="flex p-4">
            <CardBody className="px-3 py-0 text-small text-black flex-grow">
              <h1 className="text-lg font-bold">게시글 제목</h1>
              <p>
                게시글 내용 게시글 내용 게시글 내용 게시글 내용 게시글 내용
                게시글 내용 게시글 내용 게시글 내용 게시글 내용
              </p>
            </CardBody>
            <Image
              width={240}
              height={144}
              alt="side image"
              src={`${process.env.NEXT_PUBLIC_FRONT_URL}/svgs/thembnail.svg`}
            />
          </div>
        </Card>
      </div>
      <div className="flex flex-wrap gap-4 items-center justify-center mt-8">
        <Pagination
          loop
          showControls
          color="primary"
          total={5}
          initialPage={1}
        />
      </div>
    </div>
  );
}
