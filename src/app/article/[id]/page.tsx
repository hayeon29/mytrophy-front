"use client";

import React, { useState, useEffect } from 'react';
import articleAPI from '@/services/article';
import gameAPI from '@/services/game';
import membersAPI from '@/services/members';
import commentAPI from '@/services/comment';
import Link from 'next/link';
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
    Textarea
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
    const {isOpen, onOpen, onOpenChange} = useDisclosure();
    const [editContent, setEditContent] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [commentToDelete, setCommentToDelete] = useState(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);


    useEffect(() => {
        const fetchArticleDetail = async () => {
            try {
                setLoading(true);
                const articleDetail = await articleAPI.getArticleDetail(articleId);
                setArticle(articleDetail);
                console.log(articleDetail);

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

                setCommentAuthors(authorsMap);
            } catch (error) {
                console.error('Error fetching article detail:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchArticleDetail();
    }, [articleId]);

    const handleCommentSubmit = async () => {
        try {
            await commentAPI.createComment(articleId, newComment);
            setNewComment('');
        } catch (error) {
            console.error('Error creating comment:', error);
        }
    };

    const handleEditSubmit = async (commentId: string) => {
        try {
            await commentAPI.updateComment(commentId, editContent);
            setIsEditing(false);
            setEditContent('');
        } catch (error) {
            console.error('Error updating comment:', error);
        }
    };

    const handleDeleteSubmit = async (commentId: string) => {
        try {
            await commentAPI.deleteComment(commentId);
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


    return (
        <div className="bg-white py-4">
            <div className="py-4 mx-auto max-w-7xl">
                <Button
                className="py-2 px-4 rounded border-none"
            >
                <Link href="/article">
                    커뮤니티로 돌아가기
                </Link>
            </Button>
            </div>

            <div className="max-w-7xl border border-gray p-4 rounded-lg shadow-md text-left mx-auto">
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
                                <p className="text-gray-500 text-sm mr-2">작성 날짜:</p>
                                <p className="text-gray-500 text-sm">{formattedDate}</p>
                            </div>
                        )}
                    </div>
                </div>
                <div className="flex justify-center mt-6">
                    <Image
                        src={article?.imagePath}
                        alt="게시글 사진"
                        width={400}
                        height={400}
                        className="rounded-lg"
                    />
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
                    <p className="mr-60 text-lg text-primary">추천</p>
                    <p className="text-lg text-primary">공유하기</p>
                </div>
                <hr style={{border: '1px solid #ddd'}} className="mt-5"/>

                <div className="mt-10">
                    {article.comments.map((comment) => (
                        <div key={comment.id} className="flex border-b border-gray-300 py-2 items-center justify-between max-w-5xl mx-auto mb-8">
                            <Image
                                src={`${process.env.NEXT_PUBLIC_FRONT_URL}/svgs/logo.svg`}
                                alt="프로필 사진"
                                width={50}
                                height={50}
                                className="rounded-full mx-5"
                            />
                            <div className="mx-10">
                                <p style={{ fontSize: '1.2rem' }}>{comment.memberId}</p>
                                <p>{comment.content}</p>
                            </div>
                            <div className="ml-auto flex items-center">
                                <div className="flex flex-col ml-2">
                                    <p className="mr-4">작성 날짜: {comment.createdAt}</p>
                                    <Button
                                        className="py-2 px-4 rounded mb-2"
                                        variant="ghost"
                                        color="primary"
                                    >
                                        좋아요 {comment.likes}
                                    </Button>

                                    <Button onPress={onOpen}
                                            className="py-2 px-4 rounded"
                                            variant="solid"
                                            color="danger">수정</Button>
                                    <Modal
                                        isOpen={isOpen}
                                        size="3xl"
                                        onOpenChange={onOpenChange}
                                    >
                                        <ModalContent>
                                            {(onClose) => (
                                                <>
                                                    <ModalHeader className="flex flex-col gap-1">댓글 수정</ModalHeader>
                                                    <ModalBody style={{ wordWrap: 'break-word' }}>
                                                        <Textarea
                                                            placeholder="내용을 입력해주세요."
                                                            className="mb-4 flex-1"
                                                            label="댓글 수정하기"
                                                            value={editContent}
                                                            onChange={(e) => setEditContent(e.target.value)}
                                                        />
                                                    </ModalBody>
                                                    <ModalFooter>
                                                        <Button
                                                            color="danger"
                                                            variant="solid"
                                                            onClick={() => {
                                                                setCommentToDelete(comment);
                                                                setIsDeleteModalOpen(true);
                                                            }}
                                                        >
                                                            삭제
                                                        </Button>
                                                        <Button color="danger" variant="light" onPress={onClose}>
                                                            취소
                                                        </Button>
                                                        <Button color="primary" onClick={() => handleEditSubmit(comment.id)}>
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
                                                            handleDeleteSubmit(commentToDelete.id);
                                                            setIsDeleteModalOpen(false);
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
                    ))}
                </div>
                <div className="max-w-5xl mx-auto">
                    <div className="flex items-center gap-4">
                        <User
                            name={<span style={{ fontSize: '1.1rem' }}>로그인 한 유저 닉네임</span>}
                            avatarProps={{
                                src: "",
                                style: { border: '1px solid black' }
                            }}
                        />
                        <Input type="text" label="댓글 작성하기" className="flex-1" value={newComment} onChange={(e) => setNewComment(e.target.value)} />
                        <Button
                            className="py-2 px-4 rounded"
                            variant="ghost"
                            color="primary"
                            onClick={handleCommentSubmit}
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
