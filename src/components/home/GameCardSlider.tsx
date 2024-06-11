import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import SwiperCore from "swiper";
import GameCard from "./GameCard";

// 필요한 모듈 임포트
import { Navigation, Pagination } from "swiper/modules";

SwiperCore.use([Navigation, Pagination]);

const GameCardSlider = ({ games, idKey }) => {
    return (
        <div className="relative w-full h-full">
            <Swiper
                spaceBetween={0} // 슬라이드 간의 여백
                slidesPerView={Math.min(3, games.length)} // 기본 슬라이드 수
                navigation={true} // 내비게이션 활성화
                pagination={{ clickable: true }}
                loop={games.length >= 3} // 루프 모드 활성화
                breakpoints={{
                    1440: {
                        slidesPerView: 3,
                        spaceBetween: 10,
                    },
                    1024: {
                        slidesPerView: 2,
                        spaceBetween: 10, // breakpoint에 따른 슬라이드 간 여백
                    },
                    600: {
                        slidesPerView: 1,
                        spaceBetween: 5, // breakpoint에 따른 슬라이드 간 여백
                    },
                }}
            >
            {games.filter(game => game.id !== null).map(game => (
                <SwiperSlide key={game.id} className="flex justify-center">
                    <GameCard game={game} idKey={idKey} />
                </SwiperSlide>
            ))}    
            </Swiper>
            <style jsx global>{`
                .swiper-container {
                    width: 100%;
                }
                .swiper-slide {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    height: auto !important; // 슬라이드 높이 조정
                }
                .swiper-button-prev,
                .swiper-button-next {
                    width: 50px; /* 버튼의 너비를 조정 */
                    height: 50px; /* 버튼의 높이를 조정 */
                    z-index: 10; /* 버튼을 슬라이더 위에 표시 */
                    position: absolute; /* 버튼 위치 고정 */
                    top: 50%; /* 상하 가운데 정렬 */
                    transform: translateY(-50%); /* 상하 가운데 정렬 */
                    background: rgba(255, 255, 255, 0.1); /* 연한 백그라운드 */
                    border-radius: 50%; /* 동그란 버튼 */
                    backdrop-filter: blur(15px); /* 배경 블러 */
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: background 0.3s ease-in-out; /* 부드러운 전환 */
                }
                .swiper-button-prev::after,
                .swiper-button-next::after {
                    font-size: 24px; /* 화살표 아이콘 크기 조정 */
                    color: #5779E9; /* 화살표 아이콘 색상 조정 */
                }
                .swiper-pagination {
                    position: absolute;
                    bottom: -30px; // 페이지네이션을 슬라이더 하단으로 이동
                    width: 100%;
                    text-align: center;
                }
                .swiper-pagination-bullet {
                    margin: 0 5px; // dots 간의 간격을 조정
                }    
            `}</style>
        </div>
    );
};

export default GameCardSlider;
