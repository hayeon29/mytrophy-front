'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Button,
  Image,
  Pagination,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input,
  Textarea,
  Checkbox,
  Card,
  CardHeader,
  Avatar,
  CardBody,
} from '@nextui-org/react';
import articleAPI from '@/services/article';
import gameAPI from '@/services/game';
import { useRecoilValue } from 'recoil';
import { userState } from '@/recoils/userAtom';
import { handleAxiosError } from '@/utils/handleAxiosError';

export default function Article() {
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const modalPlacement = 'center';
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [checkedFiles, setCheckedFiles] = useState<boolean[]>([]);
  const [activeButton, setActiveButton] = useState('');
  const [articles, setArticles] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchValue, setSearchValue] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedGameId, setSelectedGameId] = useState(null);
  const [selectedGameName, setSelectedGameName] = useState('');
  const memberInfo = useRecoilValue(userState);
  const [showLikeLabel, setShowLikeLabel] = useState({});
  const [isOpen, setIsOpen] = useState(false);
  const [isGameOpen, setIsGameOpen] = useState(false);
  const [isArticleOpen, setIsArticleOpen] = useState(false);
  const [isLikedOpen, setIsLikedOpen] = useState(false);
  const [message, setMessage] = useState('게시글을 작성하시겠습니까?');
  const [userInfo, setUserInfo] = useState({
    header: '',
    name: '',
    content: '',
  });

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        // 게시글 목록 가져오기
        const response = await articleAPI.getArticleList(currentPage - 1, 10);
        const articles = response.content;
        setArticles(articles);
        setTotalPages(response.totalPages);

        // 각 게시물의 appId를 사용하여 게임 세부 정보를 가져오기
        const articlesWithGameDetails = await Promise.all(
          articles.map(async (article) => {
            // 게임 세부 정보를 가져오고
            const gameDetail = await gameAPI.getGameDetail(article.appId);

            // 해당 게임 세부 정보를 해당 게시물에 추가하여 새로운 객체를 생성
            return {
              ...article,
              gameDetail,
            };
          })
        );

        // 게임 세부 정보가 추가된 게시물 목록으로 상태를 업데이트
        setArticles(articlesWithGameDetails);
      } catch (error) {
        handleAxiosError(error);
      }
    };

    fetchArticles();
  }, [currentPage]);

  const handleSearch = async () => {
    setIsLoading(true);
    try {
      const response = await gameAPI.searchGameByName(0, 10, searchValue);
      setSearchResults(response.content);
      setIsSearchModalOpen(true);

      if (response.content.length === 0) {
        setMessage('검색한 게임이 없습니다. 다시 검색해주세요.');
        setIsGameOpen(true);
      }
    } catch (error) {
      handleAxiosError(error);
      setMessage('게임 검색 중 오류가 발생했습니다. 다시 시도해주세요.');
      setIsGameOpen(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGameSelectAppId = (appId, gameName, onClose) => {
    setSelectedGameId(appId);
    setSelectedGameName(gameName);
    setIsLoading(false);
    onClose();
    setSearchValue(selectedGameName);
  };

  const handleClickCreateArticle = async (onClose) => {
    try {
      let fileUrls = null; // Initialize file URL string

      // Your form validation logic
      if (!userInfo.name || !userInfo.content || !selectedGameId) {
        setMessage('제목과 내용, 선택한 게임을 모두 입력해주세요.'); // Update message for invalid input
        setIsArticleOpen(true); // Open modal for invalid input
        return;
      }

      if (selectedFiles.length > 0) {
        const formData = new FormData();
        selectedFiles.forEach((file) => {
          formData.append('file', file);
        });

        const responses = await articleAPI.articleFileUpload(formData);

        fileUrls = responses.join(',');
      }

      const response = await articleAPI.articleCreate(
        activeButton,
        userInfo.name,
        userInfo.content,
        selectedGameId,
        fileUrls
      );

      if (response.status === 200) {
        setMessage('게시글 작성이 완료되었습니다.');
      } else {
        setMessage('게시글 작성에 실패했습니다. 다시 시도해주세요.');
        setIsArticleOpen(false);
      }

      onClose();
      if (typeof window !== undefined) {
        window.location.reload();
      }
    } catch (error) {
      handleAxiosError(error);
      setMessage('게시글 작성에 실패했습니다. 다시 시도해주세요.');
      setIsOpen(true);
    }
  };

  const handleCloseModal = () => {
    setIsOpen(false);
  };

  const handleArticleCloseModal = () => {
    setIsArticleOpen(false);
  };

  const handleGameCloseModal = () => {
    setIsGameOpen(false);
  };

  const handleLikedCloseModal = () => {
    setIsLikedOpen(false);
  };

  const handleClick = async (header) => {
    try {
      let response;

      if (activeButton === header) {
        // 이미 눌렀던 버튼을 다시 누르면 전체 게시글을 가져옵니다.
        response = await articleAPI.getArticleList(currentPage - 1, 10);
        setActiveButton('ALL');
      } else {
        // 새로운 헤더를 클릭한 경우 해당 헤더의 게시글을 가져옵니다.
        response = await articleAPI.getArticlesByHeader(
          header,
          currentPage - 1,
          10
        );
        setActiveButton(header);
      }

      // 가져온 게시글의 상세 정보를 함께 가져와서 articlesWithGameDetails를 생성합니다.
      const articlesWithGameDetails = await Promise.all(
        response.content.map(async (article) => {
          const gameDetail = await gameAPI.getGameDetail(article.appId);
          return {
            ...article,
            gameDetail,
          };
        })
      );

      // 게임 세부 정보가 추가된 게시물 목록으로 상태를 한 번에 업데이트합니다.
      setArticles(articlesWithGameDetails);
      setTotalPages(response.totalPages);
    } catch (error) {
      // 에러가 발생한 경우 처리합니다.
      handleAxiosError(error);
    }
  };

  const handleLike = async (articleId) => {
    await articleAPI.articleLike(articleId);

    // 서버에서 최신 좋아요 상태 가져오기
    const updatedArticle = await articleAPI.getArticleDetail(articleId);

    // 좋아요 수 업데이트
    setArticles((prevArticles) =>
      prevArticles.map((article) =>
        article.id === articleId
          ? {
              ...article,
              cntUp: updatedArticle.cntUp,
              isLiked: updatedArticle.isLiked,
            }
          : article
      )
    );
  };

  const handleLikeClick = (articleId) => {
    if (memberInfo !== null) {
      handleLike(articleId);
    } else {
      setMessage('로그인 후 추천을 누를 수 있습니다.');
      setIsLikedOpen(true);
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

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

  const handleInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setUserInfo((prevUserInfo) => ({
      ...prevUserInfo,
      [name]: value,
    }));
  };

  const handleCloseSearchModal = () => {
    setIsSearchModalOpen(false);
    setIsLoading(false);
  };

  const handleClosePostModal = () => {
    setIsPostModalOpen(false);
  };

  const handleGameSelect = (appId, gameName) => {
    setSelectedGameId(appId);
    setSelectedGameName(gameName);
  };

  const getBackgroundColor = (header) => {
    switch (header) {
      case 'FREE_BOARD':
        return 'bg-blue-500';
      case 'INFORMATION':
        return 'bg-green-500';
      case 'GUIDE':
        return 'bg-yellow-500';
      case 'REVIEW':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const displayHeader = (header) => {
    if (header === 'CHATTING') return 'CHATTING';
    return header;
  };

  const handleMouseEnter = (articleId) => {
    setShowLikeLabel({ [articleId]: true });
  };

  const handleMouseLeave = (articleId) => {
    setShowLikeLabel({
      [articleId]: false,
    });
  };

  const handleWriteArticle = () => {
    if (memberInfo === null) {
      setMessage('로그인 후 게시글을 작성할 수 있습니다.');
      setIsOpen(true);
      setIsPostModalOpen(false);
    } else {
      setIsPostModalOpen(true);
    }
  };

  return (
    <div className="bg-white h-screen mx-auto">
      <div className="max-w-7xl mx-auto relative bg-white pt-4">
        <div className="flex justify-left items-center p-0 gap-4">
          <Button
            color="primary"
            onClick={() => handleClick('FREE_BOARD')}
            className={`${activeButton === 'FREE_BOARD' ? 'bg-primary text-white border-primary' : 'bg-white text-blueBlack border-blueLightGray'} border-1 `}
          >
            자유
          </Button>
          <Button
            color="primary"
            onClick={() => handleClick('INFORMATION')}
            className={`${activeButton === 'INFORMATION' ? 'bg-primary text-white border-primary' : 'bg-white text-blueBlack border-blueLightGray'} border-1 `}
          >
            정보
          </Button>
          <Button
            color="primary"
            onClick={() => handleClick('GUIDE')}
            className={`${activeButton === 'GUIDE' ? 'bg-primary text-white border-primary' : 'bg-white text-blueBlack border-blueLightGray'} border-1 `}
          >
            공략
          </Button>
          <Button
            color="primary"
            onClick={() => handleClick('REVIEW')}
            className={`${activeButton === 'REVIEW' ? 'bg-primary text-white border-primary' : 'bg-white text-blueBlack border-blueLightGray'} border-1 `}
          >
            리뷰
          </Button>
        </div>
      </div>
      <div className="bg-white flex justify-center items-center py-4">
        <div className="w-full max-w-7xl border border-blueLightGray p-8 flex items-center rounded-lg h-26 shadow-gray text-left">
          <Button
            color="default"
            radius="lg"
            className="flex-grow test-small bg-blueLightGray text-blueBlack"
            onPress={handleWriteArticle}
          >
            클릭 후 글을 작성해보세요.
          </Button>

          <Modal isOpen={isOpen} onOpenChange={setIsOpen} shadow="sm">
            <ModalContent>
              <ModalHeader className="flex flex-col gap-1">게시글</ModalHeader>
              <ModalBody>
                <p>{message}</p>
              </ModalBody>
              <ModalFooter>
                <Button
                  color="danger"
                  variant="light"
                  onPress={handleCloseModal}
                >
                  확인
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
        </div>
      </div>

      {/* 게시글 작성 모달창 */}
      <Modal
        isOpen={isPostModalOpen}
        size="4xl"
        onOpenChange={handleClosePostModal}
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
                    variant={activeButton === 'FREE_BOARD' ? 'solid' : 'ghost'}
                    onClick={() => handleButtonClick('FREE_BOARD')}
                  >
                    자유
                  </Button>
                  <Button
                    color="primary"
                    variant={activeButton === 'INFORMATION' ? 'solid' : 'ghost'}
                    onClick={() => handleButtonClick('INFORMATION')}
                  >
                    정보
                  </Button>
                  <Button
                    color="primary"
                    variant={activeButton === 'GUIDE' ? 'solid' : 'ghost'}
                    onClick={() => handleButtonClick('GUIDE')}
                  >
                    공략
                  </Button>
                  <Button
                    color="primary"
                    variant={activeButton === 'REVIEW' ? 'solid' : 'ghost'}
                    onClick={() => handleButtonClick('REVIEW')}
                  >
                    리뷰
                  </Button>
                </div>

                <div>
                  <div className="flex items-center gap-4">
                    <Input
                      type="text"
                      label="게임을 검색해주세요."
                      value={searchValue}
                      onChange={(e) => setSearchValue(e.target.value)}
                    />

                    <Button
                      color="primary"
                      className="text-white"
                      onClick={handleSearch}
                      disabled={isLoading}
                    >
                      {isLoading ? '검색 중...' : '게임 검색'}
                    </Button>

                    <Modal isOpen={isGameOpen} onOpenChange={setIsGameOpen}>
                      <ModalContent>
                        <ModalHeader className="flex flex-col gap-1">
                          게임 검색
                        </ModalHeader>
                        <ModalBody>
                          <p>{message}</p>
                        </ModalBody>
                        <ModalFooter>
                          <Button
                            color="danger"
                            variant="light"
                            onPress={handleGameCloseModal}
                          >
                            확인
                          </Button>
                        </ModalFooter>
                      </ModalContent>
                    </Modal>
                  </div>
                </div>
                <Modal
                  isOpen={isSearchModalOpen}
                  onOpenChange={handleCloseSearchModal}
                >
                  <ModalContent>
                    {(onClose) => (
                      <>
                        <ModalHeader className="flex flex-col gap-1 items-center">
                          게임 검색
                        </ModalHeader>
                        <ModalBody className="flex">
                          <div className="flex flex-col gap-4">
                            {searchResults.map((game, index) => (
                              <div
                                key={index}
                                className="flex items-center gap-2"
                              >
                                <input
                                  type="checkbox"
                                  onChange={() =>
                                    handleGameSelect(game.id, game.name)
                                  }
                                  checked={selectedGameId === game.id} // 선택한 게임이 체크되도록 확인
                                />
                                <label>{game.name}</label>
                              </div>
                            ))}
                          </div>
                        </ModalBody>
                        <ModalFooter>
                          <Button
                            color="danger"
                            variant="light"
                            onPress={onClose}
                          >
                            취소
                          </Button>
                          <Button
                            color="primary"
                            onPress={() =>
                              handleGameSelectAppId(
                                selectedGameId,
                                selectedGameName,
                                onClose
                              )
                            }
                          >
                            선택
                          </Button>
                        </ModalFooter>
                      </>
                    )}
                  </ModalContent>
                </Modal>
                <hr style={{ border: '1px solid #ddd' }} />
                <p>제목</p>
                <Textarea
                  name="name"
                  value={userInfo.name}
                  onChange={handleInput}
                  placeholder="제목을 입력해주세요."
                  className="mb-4"
                />
                <p>내용</p>
                <Textarea
                  name="content"
                  value={userInfo.content}
                  onChange={handleInput}
                  placeholder="내용을 입력해주세요."
                  className="mb-4"
                />
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
                {selectedFiles.map((file, index) => (
                  <div key={file.name}>
                    <label>
                      <Checkbox
                        checked={!!checkedFiles[index]}
                        onChange={() => handleCheckboxChange(index)}
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
                <Button
                  color="primary"
                  onPress={() => handleClickCreateArticle(onClose)}
                >
                  작성
                </Button>

                <Modal isOpen={isArticleOpen} onOpenChange={setIsArticleOpen}>
                  <ModalContent>
                    <ModalHeader className="flex flex-col gap-1">
                      게시글
                    </ModalHeader>
                    <ModalBody>
                      <p>{message}</p>
                    </ModalBody>
                    <ModalFooter>
                      <Button
                        color="danger"
                        variant="light"
                        onPress={handleArticleCloseModal}
                      >
                        확인
                      </Button>
                    </ModalFooter>
                  </ModalContent>
                </Modal>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      {/* 게시글 Cards */}
      <div className="flex flex-col justify-center items-center py-4 gap-y-6">
        {articles.map((article) => (
          <Card
            key={article.id}
            className="w-full max-w-7xl border-blueLightGray shadow-gray p-8"
          >
            {/* Card Header */}
            <CardHeader className="justify-between flex-row p-0 mb-6">
              <div className="flex gap-x-3 items-center">
                <Avatar
                  radius="full"
                  className="w-8 h-8"
                  src={article.memberImage}
                />
                <div className="flex gap-1 items-start flex-col sm:flex-row sm:items-center">
                  <h5 className="text-sm leading-none text-blackGray">
                    {article.nickname} {/* 유저 이름 */}
                  </h5>
                  <h4 className="text-sm tracking-tight text-blackGray">
                    ({article.username}) {/* 유저 아이디 */}
                  </h4>
                </div>
                <span
                  className={`${getBackgroundColor(article.header)} rounded-sm text-white px-2 py-0.5 text-sm mr-2`}
                >
                  {displayHeader(article.header)}
                </span>
              </div>
              {/* Counts */}
              <div className="flex items-center ">
                <button
                  type="button"
                  onMouseEnter={() => handleMouseEnter(article.id)}
                  onMouseLeave={() => handleMouseLeave(article.id)}
                  onClick={() => handleLikeClick(article.id)}
                >
                  {showLikeLabel[article.id] ? (
                    <span className="border border-primary bg-primary text-white text-sm p-2 rounded-full">
                      좋아요
                    </span>
                  ) : (
                    <Image
                      width={16}
                      height={16}
                      alt="vector"
                      src="/svgs/likeIcon.svg"
                    />
                  )}
                </button>
                <span className="text-sm text-primary ml-[6px] mr-4">
                  {article.cntUp}
                </span>
                <Modal isOpen={isLikedOpen} onOpenChange={setIsLikedOpen}>
                  <ModalContent>
                    <ModalHeader className="flex flex-col gap-1">
                      게시글
                    </ModalHeader>
                    <ModalBody>
                      <p>{message}</p>
                    </ModalBody>
                    <ModalFooter>
                      <Button
                        color="danger"
                        variant="light"
                        onPress={handleLikedCloseModal}
                      >
                        확인
                      </Button>
                    </ModalFooter>
                  </ModalContent>
                </Modal>
                <Image
                  width={16}
                  height={16}
                  alt="comment"
                  src="/svgs/commentIcon.svg"
                />
                <span className="text-sm text-primary ml-[6px]">
                  {article.commentCount}
                </span>
              </div>
            </CardHeader>
            <div className="flex">
              <CardBody className="p-0 text-small text-black flex-grow cursor-pointer">
                <Link href={`/article/${article.id}`}>
                  <h1 className="text-lg font-bold mb-4">{article.name}</h1>
                  {/* 화면 너비가 768px 이하일 때, 최대 15자만 보여줌 */}
                  <p className="hidden text-sm sm:block">
                    {article.content.length > 300
                      ? `${article.content.slice(0, 300)}...`
                      : article.content}
                  </p>
                </Link>
              </CardBody>
              {/* Image */}
              {article.gameDetail && (
                <div className="flex justify-center items-center">
                  <Image
                    width={240}
                    height={144}
                    alt="side image"
                    src={article.gameDetail.headerImagePath}
                  />
                </div>
              )}
            </div>
          </Card>
        ))}
      </div>
      <div className="flex justify-center mt-4">
        <Pagination
          total={totalPages}
          initialPage={1}
          page={currentPage}
          onChange={handlePageChange}
          classNames={{
            cursor: 'text-white font-bold',
          }}
        />
      </div>
    </div>
  );
}
