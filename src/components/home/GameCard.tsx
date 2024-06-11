import React, { useState, useEffect } from "react";
import {Card, CardFooter, CardBody, Image, Button, useDisclosure} from "@nextui-org/react";
import { FaCheck, FaTimes } from "react-icons/fa";
import { FaRegFaceFrown, FaRegFaceGrin, FaRegFaceGrinSquint } from "react-icons/fa6";
import Category from "./Category";
import homeAPI from "@/services/home";
import GameReviewModal from "./GameReviewModal";
import Link from "next/link";

export default function GameCard({ game , idKey}) {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [reviewIcon, setReviewIcon] = useState(<FaRegFaceGrin className="text-gray-400" />);

    useEffect(() => {
        console.log(idKey);
        async function fetchReviewStatus() {
            try {
                const response = await homeAPI.getMyReview(game[idKey]);
                const { reviewStatus } = response.data;

                if (reviewStatus) {
                    switch (reviewStatus) {
                        case "BAD":
                            setReviewIcon(<FaRegFaceFrown className="text-red-500" />);
                            break;
                        case "GOOD":
                            setReviewIcon(<FaRegFaceGrin className="text-yellow-500" />);
                            break;
                        case "PERFECT":
                            setReviewIcon(<FaRegFaceGrinSquint className="text-green-500" />);
                            break;
                        default:
                            setReviewIcon(<FaRegFaceGrin className="text-[#A9B0BD]" />);
                            break;
                    }
                } else {
                    setReviewIcon(<FaRegFaceGrin className="text-[#A9B0BD]" />);
                }
            } catch (error) {
                setReviewIcon(<FaRegFaceGrin className="text-[#A9B0BD]" />);
            }
        }

        fetchReviewStatus();
    }, [game[idKey]]);

    const submitReview = async (status) => {
        try {
            await homeAPI.submitReview(game[idKey], status);
            alert("게임 평가 성공");
            switch (status) {
                case "BAD":
                    setReviewIcon(<FaRegFaceFrown className="text-red-500" />);
                    break;
                case "GOOD":
                    setReviewIcon(<FaRegFaceGrin className="text-yellow-500" />);
                    break;
                case "PERFECT":
                    setReviewIcon(<FaRegFaceGrinSquint className="text-green-500" />);
                    break;
                default:
                    setReviewIcon(<FaRegFaceGrin className="text-[#A9B0BD]" />);
                    break;
            }

            onClose();
        } catch (error) {
            alert("게임 평가 실패");
        }
    };

    return (
        <>
        <Card isHoverable
              className="shadow-lg rounded-2xl w-[350px] h-full flex flex-col m-0 p-0 transition-shadow duration-300 ease-in-out hover:shadow-2xl" >
            <CardBody className="p-0 flex-grow">
                <Link href={`/game/${String(game.id)}`} className="block">
                    <Image
                        src={game.headerImagePath}
                        alt={game.name}
                        className="object-cover w-full h-auto"
                        style={{
                            borderTopLeftRadius: 'inherit',
                            borderTopRightRadius: 'inherit',
                            borderBottomLeftRadius: 0,
                            borderBottomRightRadius: 0,
                        }}
                    />
                </Link>
            </CardBody>
            <CardFooter className="p-5 bg-white flex flex-col">
                <div className="space-y-2 text-left">
                    <div className="flex items-center justify-between">
                        <Link href={`/game/${String(game.id)}`} className="text-xl font-bold text-black block transition-colors duration-300 ease-in-out hover:text-[#2E396C]">
                            {game.name}
                        </Link>
                        <Button
                            isIconOnly 
                            color="default"
                            onPress={onOpen}
                            className="bg-transparent"
                        >
                            {React.cloneElement(reviewIcon, { size: 24 })}
                        </Button>
                    </div>
                    <div className="h-[84px]">
                        <div className="flex flex-wrap gap-2">
                            <Category categories={game.getGameCategoryDTOList || []} />
                        </div>
                    </div>
                    <div className="text-[#1E293B]">
                        <div>
                            <span className="font-bold mr-2">가격</span>
                            <span>{game.price === 0 ? "무료" : `${game.price}원`}</span>
                        </div>
                        <div className="mt-1">
                            <span className="font-bold mr-2">평가</span>
                            <span>{game.positive}</span>
                        </div>
                        <div className="flex items-center mt-1">
                            <span className="font-bold mr-2">한국어 지원 여부</span>
                            {game.koIsPosible ? (
                                <FaCheck className="text-green-500" />
                            ) : (
                                <FaTimes className="text-red-500" />
                            )}
                        </div>
                    </div>
                </div>    
            </CardFooter>
        </Card>

        <GameReviewModal
            visible={isOpen}
            onClose={onClose}
            onSubmit={submitReview}
            gameName={game.name}
            backgroundImage={game.headerImagePath}
        />
        </>
    )
}