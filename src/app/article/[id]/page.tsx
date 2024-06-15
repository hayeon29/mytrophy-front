'use client';

import React, { useState, useEffect } from 'react';
import articleAPI from '@/services/article';
import gameAPI from '@/services/game';
import commentAPI from '@/services/comment';
import Link from 'next/link';
import { VscIndent } from 'react-icons/vsc';
import {
  Image,
  User,
  Button,
  Input,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Textarea,
  Checkbox,
  Divider,
} from '@nextui-org/react';
import { handleAxiosError } from '@/utils/handleAxiosError';
import { useRouter } from 'next/navigation';
import { useRecoilValue } from 'recoil';
import { userState } from '@/recoils/userAtom';

type Props = {
  params: {
    id: string;
  };
};

function ArticleDetail({ params }: Props) {
  const { id: articleId } = params;
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [gameDetail, setGameDetail] = useState(null); // 게임의 상세 정보 상태 추가
  const [newComment, setNewComment] = useState('');
  const [isCommentEditOpen, setCommentEditOpen] = useState(false);
  const [editContent, setEditContent] = useState('');
  const [selectedComment, setSelectedComment] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const modalPlacement = 'center';
  const [activeButton, setActiveButton] = useState('');
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [checkedFiles, setCheckedFiles] = useState<boolean[]>([]);
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [selectedGameId, setSelectedGameId] = useState('');
  const [selectedGameName, setSelectedGameName] = useState('');
  const [selectedCommentId, setSelectedCommentId] = useState('');
  const [selectedCommentNickname, setSelectedCommentNickname] = useState('');
  const [selectedDeleteComment, setSelectedDeleteComment] = useState('');
  const [reCommentOpen, setReCommentOpen] = useState(false);
  const memberInfo = useRecoilValue(userState);
  const [message, setMessage] = useState('게시글을 작성하시겠습니까?');
  const [isOpen, setIsOpen] = useState(false);
  const [userInfo, setUserInfo] = useState({
    header: '',
    title: '',
    content: '',
  });
  const router = useRouter();

  useEffect(() => {
    const fetchArticleDetail = async () => {
      setLoading(true);
      const articleDetail = await articleAPI.getArticleDetail(articleId);
      setArticle(articleDetail);
      const gameDetailData = await gameAPI.getGameDetail(articleDetail.appId);
      setGameDetail(gameDetailData);

      setLoading(false);
    };

    fetchArticleDetail();
  }, [articleId]);

  useEffect(() => {
    if (article) {
      // 기존 게시글 정보를 폼에 설정
      setUserInfo({
        header: userInfo.header,
        title: article.name,
        content: article.content,
      });
    }
  }, [article, userInfo?.header]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserInfo((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleCommentSubmit = async (
    articleId,
    newComment,
    selectedCommentId
  ) => {
    await commentAPI.createComment(articleId, newComment, selectedCommentId);
    setNewComment('');
    router.refresh();
  };

  const handleEditSubmit = async (commentId: string, onClose) => {
    await commentAPI.updateComment(commentId, editContent);
    setEditContent('');
    router.refresh();
    onClose();
  };

  const handleDeleteSubmit = async (commentId: string) => {
    await commentAPI.deleteComment(commentId);
    setIsDeleteModalOpen(false);
    router.refresh();
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!article) {
    return <div>Article not found</div>;
  }

  const handleButtonClick = (buttonName: string) => {
    setActiveButton(buttonName);
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

  const handleClosePostModal = () => {
    setIsPostModalOpen(false);
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

  const handleArticleDeleteSubmit = async (articleId: string) => {
    await articleAPI.articleDelete(articleId);
    router.push('/article');
  };

  const handleSearch = async () => {
    setIsLoading(true);
    try {
      const response = await gameAPI.searchGameByName(0, 10, searchValue);
      setSearchResults(response.content);
      setIsSearchModalOpen(true);

      if (response.content.length === 0) {
        setMessage('검색한 게임이 없습니다. 다시 검색해주세요.');
        setIsOpen(true);
      }
    } catch (error) {
      handleAxiosError(error);
      setMessage('게임 검색 중 오류가 발생했습니다. 다시 시도해주세요.');
      setIsOpen(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseSearchModal = () => {
    setIsSearchModalOpen(false);
    setIsLoading(false);
  };

  const handleGameSelect = (appId, gameName) => {
    setSelectedGameId(appId);
    setSelectedGameName(gameName);
  };

  const handleGameSelectAppId = (appId, gameName, onClose) => {
    setSelectedGameId(appId);
    setSelectedGameName(gameName);
    setIsLoading(false);
    onClose();
    setSearchValue(selectedGameName);
  };

  const handleClickEditArticle = async (onClose) => {
    try {
      let fileUrls = null;

      if (selectedFiles.length > 0) {
        const formData = new FormData();
        selectedFiles.forEach((file) => {
          formData.append('file', file);
        });
        const response = await articleAPI.articleFileUpload(formData);
        fileUrls = response.join(',');
      }
      await articleAPI.articleUpdate(
        articleId,
        activeButton,
        userInfo.title,
        userInfo.content,
        selectedGameId, // 선택한 게임의 selectedGameId 사용
        fileUrls
      );

      if (
        activeButton === '' ||
        userInfo.title === '' ||
        userInfo.content === '' ||
        selectedGameId === ''
      ) {
        setMessage('모든 항목을 입력해주세요.');
        setIsOpen(true);
      } else {
        onClose();
        router.refresh();
      }
    } catch (error) {
      setMessage('게시글 수정에 실패했습니다.');
      setIsOpen(true);
    }
  };

  const handleDeleteCommentId = (commentId) => {
    setSelectedDeleteComment(commentId);
    setIsDeleteModalOpen(true);
  };

  const handleSelectedCommentId = (commentId) => {
    setSelectedComment(commentId);
  };

  const handleLike = async (commentId) => {
    await commentAPI.commentLike(commentId);
    localStorage.setItem('isLiked', 'true');
    router.refresh();
  };

  const handleReply = (commentId, commentNickname) => {
    setSelectedCommentId(commentId);
    setSelectedCommentNickname(commentNickname);
    setReCommentOpen(true);
  };

  const handleCancelReply = () => {
    setReCommentOpen(false);
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

  const handleArticleLike = async (articleId) => {
    const articleDetail = await articleAPI.getArticleDetail(articleId);
    setArticle(articleDetail);
  };

  const handleLikeClick = async (articleId) => {
    if (memberInfo !== null) {
      await articleAPI.articleLike(articleId);
      handleArticleLike(articleId);
    } else {
      setMessage('로그인 후 추천을 누를 수 있습니다.');
      setIsOpen(true);
    }
  };

  const handleCloseModal = () => {
    setIsOpen(false);
  };

  return (
    <div className="bg-white py-4">
      <div className="py-4 mx-auto max-w-7xl flex justify-between items-center">
        <Link href="/article">
          <Button
            className="py-2 px-4 rounded border-none"
            color="primary"
            variant="bordered"
          >
            커뮤니티로 돌아가기
          </Button>
        </Link>
        <Button
          className="py-2 px-4 rounded"
          color="primary"
          variant="bordered"
          onPress={() => setIsPostModalOpen(true)}
          style={{
            display:
              memberInfo !== null && article.memberId === memberInfo?.id
                ? 'block'
                : 'none',
          }}
        >
          수정
        </Button>
        {/* 게시글 수정 모달창 */}
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
                  게시글 수정
                </ModalHeader>
                <ModalBody>
                  <div className="flex gap-2">
                    <Button
                      color="primary"
                      variant={
                        activeButton === 'FREE_BOARD' ? 'solid' : 'ghost'
                      }
                      onClick={() => handleButtonClick('FREE_BOARD')}
                    >
                      자유
                    </Button>
                    <Button
                      color="primary"
                      variant={
                        activeButton === 'INFORMATION' ? 'solid' : 'ghost'
                      }
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

                      <Modal isOpen={isOpen} onOpenChange={setIsOpen}>
                        <ModalContent>
                          <ModalHeader className="flex flex-col gap-1">
                            게임
                          </ModalHeader>
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
                          <ModalBody className="flex mx-auto">
                            <div className="flex flex-col items-center gap-4">
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
                                    checked={selectedGameId === game.id}
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
                    name="title"
                    value={userInfo.title}
                    onChange={handleInputChange}
                    placeholder="제목을 입력해주세요."
                    className="mb-4"
                    rows={10}
                  />
                  <p>내용</p>
                  <Textarea
                    name="content"
                    value={userInfo.content}
                    onChange={handleInputChange}
                    placeholder="내용을 입력해주세요."
                    className="mb-4"
                    rows={10}
                  />
                  <hr style={{ border: '1px solid #ddd' }} />
                  {/*  파일 업로드  */}
                  <div
                    style={{
                      display: 'flex',
                      gap: '10px',
                      alignItems: 'center',
                    }}
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
                  <Button
                    color="danger"
                    onPress={() => handleArticleDeleteSubmit(articleId)}
                  >
                    삭제
                  </Button>
                  <Button color="danger" variant="light" onPress={onClose}>
                    취소
                  </Button>
                  <Button
                    color="primary"
                    onPress={() => handleClickEditArticle(onClose)}
                  >
                    수정
                  </Button>

                  <Modal isOpen={isOpen} onOpenChange={setIsOpen}>
                    <ModalContent>
                      <ModalHeader className="flex flex-col gap-1">
                        게시글 수정 실패
                      </ModalHeader>
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
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Modal>
      </div>
      <div className="max-w-7xl border border-blueLightGray shadow-gray text-left mx-auto p-8 rounded-3xl">
        <span
          className={`${getBackgroundColor(article.header)} rounded-sm text-white px-2 py-0.5 text-sm`}
        >
          {displayHeader(article.header)}
        </span>
        <div className="flex items-center justify-between mt-6">
          <div className="mr-4">
            <User
              name={<span className="font-bold">{article?.nickname}</span>}
              description={`게임: ${gameDetail?.name}`}
              avatarProps={{
                src: article?.memberImage,
              }}
            />
          </div>
          <div className="flex-shrink-0">
            {article && article.createdAt && (
              <div className="flex items-center">
                <p className="text-sm text-gray">
                  {new Date(article.createdAt).toLocaleString()}
                </p>
              </div>
            )}
          </div>
        </div>
        <div className="max-w-4xl">
          <h1 className="text-2xl font-bold mt-4">{article?.name}</h1>
        </div>
        <div className="flex flex-col mt-6">
          {article &&
            article.imagePath &&
            article.imagePath.split(',').map((imagePath, index) => (
              <Image
                key={index}
                src={imagePath.trim()} // 이미지 경로의 앞뒤 공백을 제거합니다.
                alt={`게시글 이미지 ${index + 1}`}
                width={500}
                height={500}
                className="rounded-lg mb-4" // 이미지 아래에 간격을 줍니다.
              />
            ))}
        </div>
        <div className="max-w-4xl">
          <p className="break-words text-textBlack">{article?.content}</p>
        </div>
        <div className="flex justify-end items-center mt-4">
          <div className="flex justify-between items-center mr-4">
            <Button
              className="bg-white text-textBlack"
              onClick={() => handleLikeClick(article.id)}
            >
              <Image
                src="/svgs/likeIcon.svg"
                alt="좋아요 아이콘"
                width={24}
                height={24}
              />
              {article.cntUp}
            </Button>

            <Modal isOpen={isOpen} onOpenChange={setIsOpen}>
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
                    onPress={handleCloseModal}
                    className="h-full text-sm"
                  >
                    확인
                  </Button>
                </ModalFooter>
              </ModalContent>
            </Modal>
          </div>
          <div className="flex justify-between items-center mr-4 gap-2">
            <Image
              src="/svgs/commentIcon.svg"
              alt="댓글 아이콘"
              width={20}
              height={20}
            />
            <span className="text-textBlack text-sm">
              {article?.commentCount}
            </span>
          </div>
        </div>
        <Divider className="bg-blueLightGray my-4" />
        <div className="flex justify-start items-center mt-5 pl-3">
          <p className="text-blueBlack font-bold">댓글</p>
        </div>
        <Divider className="bg-blueLightGray my-4" />
        <div className="mt-10">
          {article.comments.map((comment, index) => (
            <div
              key={comment.id}
              className={`flex flex-col py-2 max-w-${comment.parentCommentId !== null ? '3' : '6'}xl mx-auto mb-8 ${comment.parentCommentId === null ? 'border-b border-blueLightGray' : 'hidden'}`}
            >
              {/* 부모 댓글 내용 */}
              <div className="flex flex-col items-start justify-between">
                {/* 부모 댓글 정보 출력 */}
                <div className="w-full flex flex-row justify-between">
                  <User
                    name={comment.nickname}
                    avatarProps={{
                      src: comment.imagePath
                        ? comment.imagePath
                        : '/svgs/person.svg',
                    }}
                  />
                  <div className="flex flex-row items-center gap-2">
                    <Image
                      src="/svgs/likeIcon.svg"
                      alt="좋아요 아이콘"
                      width={24}
                      height={24}
                    />
                    <span>{comment.likes}</span>
                  </div>
                </div>
                <div className="mt-4">
                  <p>{comment.content}</p>
                  <p className="mt-4 text-sm text-gray">
                    {new Date(comment.createdAt).toLocaleString()}
                  </p>
                  <button
                    type="submit"
                    className="border-none text-sm"
                    onClick={() => handleReply(comment.id, comment.nickname)}
                  >
                    답글달기
                  </button>
                </div>
                <div className="ml-auto flex items-center mb-4">
                  <div className="flex flex-col ml-2">
                    <div className="ml-auto flex flex-row items-center gap-4">
                      <Button
                        className="py-2 px-4 rounded-xl w-20 text-white"
                        color="primary"
                        type="submit"
                        onClick={() => handleLike(comment.id)} // API 호출 연결
                      >
                        좋아요
                      </Button>
                      <Button
                        onPress={() => {
                          setCommentEditOpen(!isCommentEditOpen); // 수정 모달 열기/닫기 토글
                          handleSelectedCommentId(comment.id); // 선택된 댓글의 ID 설정
                        }}
                        className="py-2 px-4 rounded-xl w-20 text-white"
                        variant="solid"
                        color="secondary"
                        style={{
                          display:
                            memberInfo !== null &&
                            comment.memberId === memberInfo?.id
                              ? 'block'
                              : 'none',
                        }}
                      >
                        수정
                      </Button>

                      <Modal
                        isOpen={isCommentEditOpen}
                        size="3xl"
                        onOpenChange={setCommentEditOpen}
                      >
                        <ModalContent>
                          {(onClose) => (
                            <>
                              <ModalHeader className="flex flex-col gap-1">
                                댓글 수정
                              </ModalHeader>
                              <ModalBody style={{ wordWrap: 'break-word' }}>
                                <Input
                                  placeholder="내용을 입력해주세요."
                                  className="mb-4 flex-1"
                                  label="댓글 수정하기"
                                  value={editContent}
                                  onChange={(e) =>
                                    setEditContent(e.target.value)
                                  } // 댓글 내용만을 사용하도록 수정
                                />
                              </ModalBody>
                              <ModalFooter>
                                <Button
                                  color="danger"
                                  variant="solid"
                                  onClick={() => {
                                    handleDeleteCommentId(selectedComment);
                                  }}
                                >
                                  삭제
                                </Button>
                                <Button
                                  color="danger"
                                  variant="light"
                                  onPress={onClose}
                                >
                                  취소
                                </Button>
                                <Button
                                  color="primary"
                                  onClick={() =>
                                    handleEditSubmit(selectedComment, onClose)
                                  }
                                >
                                  수정
                                </Button>
                              </ModalFooter>
                            </>
                          )}
                        </ModalContent>
                      </Modal>
                      {isDeleteModalOpen && (
                        <Modal
                          isOpen={isDeleteModalOpen}
                          onOpenChange={() => setIsDeleteModalOpen(false)}
                        >
                          <ModalContent>
                            <ModalHeader>댓글 삭제</ModalHeader>
                            <ModalBody>정말로 삭제하시겠습니까?</ModalBody>
                            <ModalFooter>
                              <Button
                                color="danger"
                                variant="solid"
                                onClick={() => {
                                  handleDeleteSubmit(selectedDeleteComment);
                                }}
                              >
                                삭제
                              </Button>
                              <Button
                                color="primary"
                                onClick={() => setIsDeleteModalOpen(false)}
                              >
                                취소
                              </Button>
                            </ModalFooter>
                          </ModalContent>
                        </Modal>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              {/* 대댓글 출력 */}
              {article.comments.slice(index + 1).map(
                (childComment) =>
                  childComment.parentCommentId === comment.id && (
                    <div
                      key={childComment.id}
                      className="ml-8 py-2 flex justify-between"
                    >
                      <div className="flex items-center">
                        {/* 대댓글 아이콘 */}
                        <VscIndent
                          className="mr-2"
                          style={{ fontSize: '1.5rem' }}
                        />
                        {/* 대댓글 정보 */}
                        <User
                          name={
                            <span style={{ fontSize: '1.1rem' }}>
                              {childComment.nickname}
                            </span>
                          }
                          avatarProps={{
                            src: childComment.imagePath,
                            style: { border: '1px solid black' },
                          }}
                        />
                        <div className="mx-10">
                          <p>{childComment.content}</p>
                          <p className="mr-4 text-sm text-gray">
                            {new Date(childComment.createdAt).toLocaleString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex flex-col ml-2">
                        <div className="flex flex-col items-end">
                          <Button
                            className="py-2 px-4 rounded mb-2 w-20"
                            variant="ghost"
                            color="primary"
                            onClick={() => handleLike(childComment.id)} // API 호출 연결
                          >
                            좋아요 {childComment.likes}
                          </Button>
                          <Button
                            onPress={() => {
                              setCommentEditOpen(!isCommentEditOpen);
                              handleSelectedCommentId(childComment.id);
                            }}
                            className="py-2 px-4 rounded w-20"
                            variant="solid"
                            color="danger"
                            style={{
                              display:
                                memberInfo !== null &&
                                childComment.memberId === memberInfo?.id
                                  ? 'block'
                                  : 'none',
                            }}
                          >
                            수정
                          </Button>
                        </div>
                      </div>
                    </div>
                  )
              )}
            </div>
          ))}
        </div>
        {/* 선택한 댓글의 닉네임이 표시되는 창 */}
        {reCommentOpen && selectedCommentNickname && (
          <div className="max-w-7xl mx-auto flex flex-row justify-between">
            <div className="flex flex-row items-center rounded-lg p-2 w-fit flex-grow justify-between font-bold text-sm">
              {selectedCommentNickname} 님에게 답글을 남깁니다.
            </div>
            <button
              type="button"
              onClick={handleCancelReply}
              className="text-secondary"
            >
              취소
            </button>
          </div>
        )}

        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col items-start gap-4 mb-4">
            <User
              name={<span>{memberInfo?.nickname}</span>}
              avatarProps={{
                src: memberInfo?.imagePath
                  ? memberInfo.imagePath
                  : '/svgs/person.svg',
              }}
            />
            <Input
              type="text"
              placeholder={`${memberInfo === null ? '로그인 후 이용해주세요.' : '댓글을 작성하세요.'}`}
              className="flex-1"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              isDisabled={memberInfo === null}
            />
          </div>
          <div className="flex justify-end">
            <Button
              className="py-2 px-4 text-white"
              color="primary"
              radius="full"
              onClick={() => {
                if (reCommentOpen === true) {
                  handleCommentSubmit(articleId, newComment, selectedCommentId);
                } else {
                  handleCommentSubmit(articleId, newComment, null);
                }
              }}
              isDisabled={memberInfo === null}
            >
              댓글 작성
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ArticleDetail;
