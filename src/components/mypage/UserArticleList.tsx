import React, { useEffect, useState } from "react";
import {Card, CardBody, Avatar, CardFooter, Pagination} from '@nextui-org/react';
import membersAPI from "@/services/members";
import articleAPI from "@/services/article";
import gameAPI from "@/services/game";
import Image from "next/image";

const UserArticleList = ({ onUpdateMyArticleCount }) => {
    const [memberInfo, setMemberInfo] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [articles, setArticles] = useState([]);
    const [totalPages, setTotalPages] = useState(0);
    const [totalArticleCount, setTotalArticleCount] = useState(0);

    useEffect(() => {
        const getMemberByToken = async () => {
            const memberInfo = await membersAPI.getUserInfo();
            setMemberInfo(memberInfo);
            if (memberInfo === null) {
                setMemberInfo(null);
            }
        };
        getMemberByToken();
    }, []);

    useEffect(() => {
        const fetchLoggedInUserArticles = async () => {
            if (!memberInfo) {
                setArticles([]);
                setTotalPages(0);
                return;
            }
            const response = await articleAPI.getArticleList(currentPage - 1, 10, memberInfo.id);
            const { content, totalPages } = response;

            const articlesWithGameDetails = await Promise.all(
                content.map(async (article) => {
                    const gameDetail = await gameAPI.getGameDetail(article.appId);
                    return {
                        ...article,
                        gameDetail: gameDetail,
                    };
                })
            );

            setArticles(articlesWithGameDetails);
            setTotalPages(totalPages);
            setTotalArticleCount(content.length);
            onUpdateMyArticleCount(content.length);
        }
        fetchLoggedInUserArticles();
    }, [currentPage, memberInfo]);

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    return (
        <div>
            {articles.map((article) => (
                <Card key={article.id} className="text-black p-8 shadow-none drop-shadow-primary flex flex-row min-h-72 mb-4">
                    <CardBody className="w-fit flex flex-col gap-4 p-0">
                        <div className="flex flex-row items-center">
                            <Avatar src={article.memberImage} className="w-8 h-8 mr-2" />
                            <span className="text-black text-l">{article.nickname}</span>
                            <span className="text-blackGray text-xs">{article.username}</span>
                        </div>
                        <p className="text-xl font-bold">{article.name}</p>
                        <div className="text-sm">
                            {article.content}
                        </div>
                    </CardBody>
                    <CardFooter className="flex flex-col justify-between w-max p-0">
                        <div className="w-full flex flex-row gap-4 justify-end">
                            <div className="flex flex-row gap-2 justify-center">
                                <Image
                                    src="/svgs/recommend.svg"
                                    width={16}
                                    height={16}
                                    alt="recommend icon"
                                />
                                <span className="text-sm text-primary">{article.cntUp}</span>
                            </div>
                            <div className="flex flex-row items-center gap-2">
                                <Image
                                    src="/svgs/comment.svg"
                                    width={14}
                                    height={14}
                                    alt="comment icon"
                                />
                                <span className="text-sm text-primary">{article.commentCount}</span>
                            </div>
                        </div>
                        <Image
                            src={article.gameDetail.headerImagePath}
                            width={250}
                            height={250}
                            className="rounded-lg"
                            alt="Description of the image"
                        />
                    </CardFooter>
                </Card>
            ))}
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
};

export default UserArticleList;
