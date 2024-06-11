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
  useDisclosure,
  Input,
  Textarea,
  Checkbox, Card, CardHeader, Avatar, CardBody,
} from '@nextui-org/react';
import articleAPI from "@/services/article";
import gameAPI from "@/services/game";

export default function Article() {
  const {isOpen, onOpen, onOpenChange} = useDisclosure();
  const modalPlacement = 'center';
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [checkedFiles, setCheckedFiles] = useState<boolean[]>([]);
  const [activeButton, setActiveButton] = useState('');
  const [articles, setArticles] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [searchValue, setSearchValue] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedAppId, setSelectedAppId] = useState(null);
  const [userInfo, setUserInfo] = useState({
    header: '',
    name: '',
    content: '',
  });


  useEffect(() => {
    const fetchArticles = async () => {
      try {
        setLoading(true);

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
                gameDetail: gameDetail,
              };
            })
        );

        // 게임 세부 정보가 추가된 게시물 목록으로 상태를 업데이트
        setArticles(articlesWithGameDetails);
      } catch (error) {
        console.error('Error fetching articles:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, [currentPage]);

  const handleSearch = async () => {
    try {
      setIsLoading(true);
      const response = await gameAPI.searchGameByName(searchValue);
      setSearchResults(response);
      console.log('검색 결과:', response);
    } catch (error) {
        console.error('게임 검색에 실패했습니다:', error);
    }
  }

  const handleGameSelect = (appId) => {
    setSelectedAppId(appId);
  };

  const handleClickCreateArticle = async (onClose) => {
    try {
      let fileUrls: string[] | null = null; // 파일 URL 배열을 초기화

      if (selectedFiles.length > 0) {
        const formData = new FormData();
        selectedFiles.forEach((file) => {
          formData.append('file', file);
        });

        // 파일 업로드 API를 호출하여 파일 URL 배열을 가져옴
        const response = await articleAPI.articleFileUpload(formData);

        // 파일이 업로드되었다면 파일 URL 배열을 설정
        fileUrls = response.length > 0 ? response : null;
      }

      console.log('imagePaths:', fileUrls); // 파일 URL들을 로그로 출력

      await articleAPI.articleCreate(
          activeButton,
          userInfo.name,
          userInfo.content,
          570,
          fileUrls
      );

      onClose();
    } catch (error) {
      console.error('게시글 작성에 실패했습니다:', error);
    }
  };



  const handleClick = async (header) => {
    try {
      setLoading(true);

      const response = await articleAPI.getArticlesByHeader(header, currentPage - 1, 10);
      setArticles(response.content);
      setTotalPages(response.totalPages);
      setActiveButton(header);
    } catch (error) {
      console.error('게시글 목록을 불러오는데 실패했습니다:', error);
    } finally {
      setLoading(false);
    }
  };

    const handleLike = async (articleId) => {
      try {
        // 게시글을 추천하고 결과를 받아옴
        const response = await articleAPI.articleLike(articleId);

        // 추천 후에 게시글 정보를 업데이트하거나 필요한 작업을 수행할 수 있습니다.
      } catch (error) {
        // 오류 발생 시
        console.error('게시글 추천에 실패했습니다:', error);
      }
    };

    const handleLikeClick = (article) => {
      handleLike(article.id); // 게시글 추천 함수 호출
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

    return (
        <div className="bg-white h-screen mx-auto">
          <div className="max-w-7xl mx-auto relative bg-white pt-4">
            <div className="flex justify-left items-center p-0 gap-4">
              <Button
                  color="primary"
                  variant={activeButton === 'FREE_BOARD' ? 'solid' : 'ghost'}
                  onClick={() => handleClick('FREE_BOARD')}
              >
                자유
              </Button>
              <Button
                  color="primary"
                  variant={activeButton === 'INFORMATION' ? 'solid' : 'ghost'}
                  onClick={() => handleClick('INFORMATION')}
              >
                정보
              </Button>
              <Button
                  color="primary"
                  variant={activeButton === 'GUIDE' ? 'solid' : 'ghost'}
                  onClick={() => handleClick('GUIDE')}
              >
                공략
              </Button>
              <Button
                  color="primary"
                  variant={activeButton === 'REVIEW' ? 'solid' : 'ghost'}
                  onClick={() => handleClick('REVIEW')}
              >
                리뷰
              </Button>
              <Button
                  color="primary"
                  variant={activeButton === 'CHATING' ? 'solid' : 'ghost'}
                  onClick={() => handleClick('CHATING')}
              >
                채팅
              </Button>
            </div>
          </div>
          <div className="bg-white flex justify-center items-center py-4">
            <div
                className="w-full max-w-7xl border border-gray p-4 flex items-center rounded-lg h-26 shadow-md text-left">
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
                        </div>
                        {searchResults.length > 0 && (
                            <div className="mt-4">
                              <ul>
                                {searchResults.map((game) => (
                                    <li
                                        key={game.id}
                                        className="border-b border-gray-200 py-2 cursor-pointer"
                                        onClick={() => handleGameSelect(game.appId)}
                                    >
                                      {game.name}
                                    </li>
                                ))}
                              </ul>
                            </div>
                        )}
                      </div>

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
                      <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
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
                        <Button color="danger" variant="light" onClick={handleDeleteAllFiles}>
                          파일 전체 삭제
                        </Button>
                        <Button color="danger" variant="light" onClick={handleDeleteSelectedFiles}>
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
                      <Button color="primary" onPress={handleClickCreateArticle}>
                        작성
                      </Button>
                    </ModalFooter>
                  </>
              )}
            </ModalContent>
          </Modal>

          {/* 게시글 Cards */}
          <div className="flex flex-col justify-center items-center py-4">
            {articles.map((article) => (
                <Card key={article.id} className="w-full max-w-7xl mb-4">
                  {/* Card Header */}
                  <CardHeader className="justify-between flex-row px-6 py-4">
                    <div className="flex gap-5 items-center">
                      <Avatar
                          isBordered
                          radius="full"
                          size="md"
                          src={article.memberImage}
                      />
                      <div className="flex gap-1 items-center">
                        <h4 className="text-small font-semibold leading-none text-default-600">
                          {article.nickname} {/* 유저 이름 */}
                        </h4>
                        <h5 className="text-small tracking-tight text-default-400">
                          {article.username} {/* 유저 아이디 */}
                        </h5>
                      </div>
                    </div>
                    {/* Counts */}
                    <div className="flex gap-3 items-center">
                      <button onClick={handleLikeClick}>
                        <Image key={article.id} width={16} alt="vector" src="/svgs/likeIcon.svg"/>
                      </button>
                      <span className="text-sm text-gray-500 text-default-400">
            {article.cntUp}
          </span>
                      <Image width={16} alt="comment" src="/svgs/commentIcon.svg"/>
                      <span className="text-sm text-gray-500 text-default-400">
            {article.commentCount}
          </span>
                    </div>
                  </CardHeader>
                  <div className="flex p-4">
                    <CardBody className="px-3 py-0 text-small text-black flex-grow cursor-pointer">
                      <Link href={`/article/${article.id}`}>
                      <h1 className="text-lg font-bold">{article.name}</h1>
                      {/* 화면 너비가 768px 이하일 때, 최대 15자만 보여줌 */}
                      <p className="hidden sm:block">
                        {article.content.length > 300
                            ? article.content.slice(0, 300) + "..."
                            : article.content}
                      </p>
                      {/* 화면 너비가 768px 이하일 때, 최대 15자만 보여줌 */}
                      <p className="sm:hidden">
                        {article.content.length > 15
                            ? article.content.slice(0, 15) + "..."
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
            />
          </div>
        </div>
    );
  }

