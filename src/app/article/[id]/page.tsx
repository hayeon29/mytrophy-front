"use client";

import React, { useState, useEffect } from 'react';
import articleAPI from '@/services/article';
import gameAPI from '@/services/game';
import membersAPI from '@/services/members';
import commentAPI from '@/services/comment';
import Link from 'next/link';
import { VscIndent } from "react-icons/vsc";
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
    useDisclosure,
    Textarea, Checkbox
} from "@nextui-org/react";

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
    const [commentAuthors, setCommentAuthors] = useState({});
    const [newComment, setNewComment] = useState("");
    const [isCommentEditOpen, setCommentEditOpen] = useState(false);
    const [editContent, setEditContent] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [selectedComment, setSelectedComment] = useState(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const modalPlacement = 'center';
    const [activeButton, setActiveButton] = useState('');
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [checkedFiles, setCheckedFiles] = useState<boolean[]>([]);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [isPostModalOpen, setIsPostModalOpen] = useState(false);
    const [searchValue, setSearchValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchResults, setSearchResults] = useState([]);
    const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
    const [selectedGameId, setSelectedGameId] = useState('');
    const [selectedGameName, setSelectedGameName] = useState('');
    const [gameTotalPages, setGameTotalPages] = useState(1);
    const [isLiked, setIsLiked] = useState(false);
    const [selectedCommentId, setSelectedCommentId] = useState('');
    const [selectedCommentNickname, setSelectedCommentNickname] = useState('');
    const [selectedDeleteComment, setSelectedDeleteComment] = useState('');
    const [reCommentOpen, setReCommentOpen] = useState(false);
    const [memberInfo, setMemberInfo] = useState('');
    const [userInfo, setUserInfo] = useState({
        header: '',
        name: '',
        content: '',
    });

    const getMemberByToken = async () => {
        try {
            const response = await membersAPI.getUserInfo();
            setMemberInfo(response.data);
        } catch (error) {
            console.error('토큰으로 멤버 정보를 가져오는 데 실패했습니다:', error);
        }
    };

    useEffect(() => {
        const fetchArticleDetail = async () => {
            try {
                setLoading(true);
                const articleDetail = await articleAPI.getArticleDetail(articleId);
                setArticle(articleDetail);

                // 게임의 상세 정보 가져오기
                const gameDetailData = await gameAPI.getGameDetail(articleDetail.appId);
                setGameDetail(gameDetailData);

                // 댓글 작성자 정보 가져오기
                const authorPromises = articleDetail.comments.map(async (comment) => {
                    const commentMemberDetail = await membersAPI.getMemberById(comment.memberId);
                    return { commentId: comment.id, ...commentMemberDetail };
                });

                const authors = await Promise.all(authorPromises);
                const authorsMap = authors.reduce((acc, author) => {
                    acc[author.commentId] = author;
                    return acc;
                }, {});

                console.log(articleDetail);
                setCommentAuthors(authorsMap);
            } catch (error) {
                console.error('Error fetching article detail:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchArticleDetail();
        getMemberByToken();
        const isLiked = localStorage.getItem('isLiked') === 'true';
        setIsLiked(isLiked);
    }, [articleId]);



    const handleCommentSubmit = async (articleId, newComment, selectedCommentId) => {
        try {
            await commentAPI.createComment(articleId, newComment, selectedCommentId);
            setNewComment('');
            window.location.reload();
        } catch (error) {
            console.error('Error creating comment:', error);
        }
    };


    const handleEditSubmit = async (commentId: string, onClose) => {
        try {
            await commentAPI.updateComment(commentId, editContent);
            setIsEditing(false);
            setEditContent('');
            window.location.reload();
            onClose();
        } catch (error) {
            console.error('Error updating comment:', error);
        }
    };

    const handleDeleteSubmit = async (commentId: string) => {
        try {
            await commentAPI.deleteComment(commentId);
            setIsDeleteModalOpen(false);
            window.location.reload();
        } catch (error) {
            console.error('Error deleting comment:', error);
        }
    };


    if (loading) {
        return <div>Loading...</div>;
    }

    if (!article) {
        return <div>Article not found</div>;
    }

    const createdAtDate = new Date(article.createdAt);
    const formattedDate = `${createdAtDate.getFullYear()}년 ${createdAtDate.getMonth() + 1}월 ${createdAtDate.getDate()}일 ${createdAtDate.getHours()}시 ${createdAtDate.getMinutes()}분`;

    const handleButtonClick = (buttonName: string) => {
        setActiveButton(buttonName);
    };

    const handleInput = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setUserInfo((prevUserInfo) => ({
            ...prevUserInfo,
            [name]: value,
        }));
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
        try {
            await articleAPI.articleDelete(articleId);
            window.location.href = '/article';
        } catch (error) {
            console.error('게시글 삭제에 실패했습니다:', error);
        }
    };

    const handleSearch = async () => {
        try {
            setIsLoading(true);
            const response = await gameAPI.searchGameByName(currentPage - 1, 10, searchValue);
            setSearchResults(response.content);
            setIsSearchModalOpen(true);
            setGameTotalPages(response.totalPages);
        } catch (error) {
            console.error('게임 검색에 실패했습니다:', error);
        }
    }

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
                userInfo.name,
                userInfo.content,
                selectedGameId, // 선택한 게임의 selectedGameId 사용
                fileUrls
            );

            onClose();
        } catch (error) {
            console.error('게시글 수정에 실패했습니다:', error);
        }
    };

    const handleDeleteCommentId = (commentId) => {
        setSelectedDeleteComment(commentId);
        setIsDeleteModalOpen(true);
    }

    const handleSelectedCommentId = (commentId) => {
        setSelectedComment(commentId);
    }

    const handleLike = async (commentId) => {
        try {
            // 게시글을 추천하고 결과를 받아옴
            const response = await commentAPI.commentLike(commentId);
            localStorage.setItem('isLiked', 'true');
            window.location.reload();
            setIsLiked(true);
        } catch (error) {
            // 오류 발생 시
            console.error('댓글 추천에 실패했습니다:', error);
        }
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
            case 'CHATING':
                return 'bg-black';
            default:
                return 'bg-gray-500';
        }
    };

    return (
        <div className="bg-white py-4">
            <div className="py-4 mx-auto max-w-7xl flex justify-between items-center">
                <Link href="/article">
                <Button className="py-2 px-4 rounded border-none" color="primary" variant="bordered">
                    커뮤니티로 돌아가기
                </Button>
                </Link>
                <Button className="py-2 px-4 rounded" color="primary" variant="bordered" onPress={() => setIsPostModalOpen(true)}>수정</Button>
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
                                        <Button
                                            color="primary"
                                            variant={activeButton === 'CHATING' ? 'solid' : 'ghost'}
                                            onClick={() => handleButtonClick('CHATING')}
                                        >
                                            채팅
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
                                    </div>
                                    <>
                                        <Modal isOpen={isSearchModalOpen} onOpenChange={handleCloseSearchModal}>
                                            <ModalContent>
                                                {(onClose) => (
                                                    <>
                                                        <ModalHeader className="flex flex-col gap-1 items-center">게임 검색</ModalHeader>
                                                        <ModalBody className="flex mx-auto">
                                                            <div className="flex flex-col items-center gap-4">
                                                                {searchResults.map((game, index) => (
                                                                    <div key={index} className="flex items-center gap-2">
                                                                        <input
                                                                            type="checkbox"
                                                                            onChange={() => handleGameSelect(game.id, game.name)}
                                                                            checked={selectedGameId === game.id}
                                                                        />
                                                                        <label>{game.name}</label>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </ModalBody>
                                                        <ModalFooter>
                                                            <Button color="danger" variant="light" onPress={onClose}>
                                                                취소
                                                            </Button>
                                                            <Button color="primary" onPress={() => handleGameSelectAppId(selectedGameId, selectedGameName, onClose)}>
                                                                선택
                                                            </Button>
                                                        </ModalFooter>
                                                    </>
                                                )}
                                            </ModalContent>
                                        </Modal>
                                    </>

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
                                    <Button color="danger" onPress={() => handleArticleDeleteSubmit(articleId)}>
                                        삭제
                                    </Button>
                                    <Button color="danger" variant="light" onPress={onClose}>
                                        취소
                                    </Button>
                                    <Button color="primary" onPress={() => handleClickEditArticle(onClose)}>
                                        수정
                                    </Button>
                                </ModalFooter>
                            </>
                        )}
                    </ModalContent>
                </Modal>
            </div>
            <div className="max-w-7xl border border-gray p-4 rounded-lg shadow-md text-left mx-auto">
                <span className={`${getBackgroundColor(article.header)} rounded-sm text-white px-2 py-0.5 text-sm mr-2`}>
                    {article.header}
                </span>
                <div className="flex items-center justify-between">
                    <div className="mr-4">
                        <User
                            name={<span style={{ fontSize: '1.1rem' }}>{article?.nickname}</span>}
                            description={gameDetail?.name}
                            avatarProps={{
                                src: article?.memberImage,
                                style: { border: '1px solid black' }
                            }}
                        />
                    </div>
                    <div className="flex-shrink-0">
                        {article && article.createdAt && (
                            <div className="flex items-center">
                                <p className="text-gray-500 text-sm">{new Date(article.createdAt).toLocaleString()}</p>
                            </div>
                        )}
                    </div>
                </div>
                <div className="flex flex-col items-center mt-6">
                    {article && article.imagePath && article.imagePath.split(',').map((imagePath, index) => (
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
                <div className="mt-8 max-w-4xl mx-auto">
                    <p style={{ wordWrap: 'break-word' }}>{article?.content}</p>
                </div>
                <div className="flex justify-end mt-4">
                    <div className="flex items-center mr-4">
                        <Image
                            src={`${process.env.NEXT_PUBLIC_FRONT_URL}/svgs/likeIcon.svg`}
                            alt="좋아요 아이콘"
                            width={25}
                            height={25}
                            className="mr-2"
                        />
                        <p className="text-gray-500 text-medium ml-1">{article?.cntUp}</p>
                    </div>
                    <div className="flex items-center mr-4">
                        <Image
                            src={`${process.env.NEXT_PUBLIC_FRONT_URL}/svgs/commentIcon.svg`}
                            alt="댓글 아이콘"
                            width={25}
                            height={25}
                            className="mr-2"
                        />
                        <p className="text-gray-500 text-medium ml-1">{article?.commentCount}</p>
                    </div>
                </div>
                <hr style={{border: '1px solid #ddd'}} className="mt-20"/>
                <div className="flex justify-center items-center mt-5">
                    <p className="text-lg text-primary">댓글</p>
                </div>
                <hr style={{border: '1px solid #ddd'}} className="mt-5"/>
                <div className="mt-10">
                    {article.comments.map((comment, index) => (
                        <div key={comment.id} className={`flex flex-col py-2 max-w-${comment.parentCommentId !== null ? '3' : '6'}xl mx-auto mb-8 ${comment.parentCommentId === null ? 'border-b border-gray-300' : 'hidden'}`}>
                            {/* 부모 댓글 내용 */}
                            <div className="flex items-center justify-between">
                                {/* 부모 댓글 정보 출력 */}
                                <User
                                    name={<span style={{ fontSize: '1.1rem' }}>{comment.nickname}</span>}
                                    avatarProps={{
                                        src: comment.imagePath,
                                        style: { border: '1px solid black' }
                                    }}
                                />
                                <div className="mx-10">
                                    <p>{comment.content}</p>
                                    <p className="mr-4 text-sm text-gray">
                                        {new Date(comment.createdAt).toLocaleString()}
                                    </p>
                                    <button className="border-none text-sm" onClick={() => handleReply(comment.id, comment.nickname)}>
                                        답글달기
                                    </button>
                                </div>
                                <div className="ml-auto flex items-center">
                                    <div className="flex flex-col ml-2">
                                        <div className="ml-auto flex flex-col items-end">
                                            <Button
                                                className="py-2 px-4 rounded mb-2 w-20"
                                                variant="ghost"
                                                color="primary"
                                                onClick={() => handleLike(comment.id)} // API 호출 연결
                                            >
                                                좋아요 {comment.likes}
                                            </Button>
                                            <Button
                                                onPress={() => {
                                                    setCommentEditOpen(!isCommentEditOpen); // 수정 모달 열기/닫기 토글
                                                    handleSelectedCommentId(comment.id); // 선택된 댓글의 ID 설정
                                                }}
                                                className="py-2 px-4 rounded w-20"
                                                variant="solid"
                                                color="danger"
                                                style={{ display: comment.memberId === memberInfo.id ? 'block' : 'none' }}
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
                                                            <ModalHeader className="flex flex-col gap-1">댓글 수정</ModalHeader>
                                                            <ModalBody style={{ wordWrap: 'break-word' }}>
                                                                <Input
                                                                    placeholder="내용을 입력해주세요."
                                                                    className="mb-4 flex-1"
                                                                    label="댓글 수정하기"
                                                                    value={editContent}
                                                                    onChange={(e) => setEditContent(e.target.value)} // 댓글 내용만을 사용하도록 수정
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
                                                                <Button color="danger" variant="light" onPress={onClose}>
                                                                    취소
                                                                </Button>
                                                                <Button color="primary" onClick={() => handleEditSubmit(selectedComment, onClose)}>
                                                                    수정
                                                                </Button>
                                                            </ModalFooter>
                                                        </>
                                                    )}
                                                </ModalContent>
                                            </Modal>
                                            {isDeleteModalOpen && (
                                                <Modal isOpen={isDeleteModalOpen} onOpenChange={() => setIsDeleteModalOpen(false)}>
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
                                                            <Button color="primary" onClick={() => setIsDeleteModalOpen(false)}>
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
                            {article.comments.slice(index + 1).map((childComment) => (
                                childComment.parentCommentId === comment.id && (
                                    <div key={childComment.id} className={`ml-8 py-2 flex justify-between`}>
                                        <div className="flex items-center">
                                            {/* 대댓글 아이콘 */}
                                            <VscIndent className="mr-2" style={{ fontSize: '1.5rem' }} />
                                            {/* 대댓글 정보 */}
                                            <User
                                                name={<span style={{ fontSize: '1.1rem' }}>{childComment.nickname}</span>}
                                                avatarProps={{
                                                    src: childComment.imagePath,
                                                    style: { border: '1px solid black' }
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
                                                    style={{ display: childComment.memberId === memberInfo.id ? 'block' : 'none' }}
                                                >
                                                    수정
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                )
                            ))}
                        </div>
                    ))}


                </div>
                {/* 선택한 댓글의 닉네임이 표시되는 창 */}
                {reCommentOpen && selectedCommentNickname && (
                    <div className="max-w-5xl mx-auto">
                        <div className="flex flex-row items-center rounded-lg bg-gray p-2 max-w-max flex-grow justify-between">
                            {selectedCommentNickname} 님에게 답글을 남깁니다.
                        </div>
                        <button onClick={handleCancelReply}>취소</button>
                    </div>
                )}

                <div className="max-w-5xl mx-auto">
                    <div className="flex items-center gap-4">
                        <User
                            name={<span style={{ fontSize: '1.1rem' }}>{memberInfo.nickname}</span>}
                            avatarProps={{
                                src: memberInfo.imagePath,
                                style: { border: '1px solid black' }
                            }}
                        />
                        <Input
                            type="text"
                            label="댓글 작성하기"
                            className="flex-1"
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                        />
                        <Button
                            className="py-2 px-4 rounded"
                            variant="ghost"
                            color="primary"
                            onClick={() => {
                                if (reCommentOpen == true) {
                                    handleCommentSubmit(articleId, newComment, selectedCommentId);
                                } else {
                                    handleCommentSubmit(articleId, newComment, null);
                                }
                            }}
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
