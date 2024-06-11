'use client';
import { useEffect, useState } from 'react';
import clsx from 'clsx';
import Image from 'next/image';
import gameAPI from '@/services/game';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import moment from "moment";
import { FaCheck, FaTimes } from "react-icons/fa";
import Link from 'next/link';
import { Spinner } from '@nextui-org/react';

function CustomNextArrow(props) {
  const { className, style, onClick } = props;
  return (
    <div
      className={`${className} custom-arrow custom-next-arrow`}
      style={{ ...style, display: 'block', background: 'rgba(230,230,230, 0.5)', borderRadius: '50%', width: '60px', height: '60px', zIndex: 1 }}
      onClick={onClick}
    >
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#007BFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ position: 'relative',top:'18px', left: '18px' }}>
        <polyline points="12 5 19 12 12 19"></polyline>
      </svg>
    </div>
  );
}
function CustomPrevArrow(props) {
  const { className, style, onClick } = props;
  return (
    <div
      className={`${className} custom-arrow custom-prev-arrow`}
      style={{ ...style, display: 'block', background: 'rgba(230,230,230, 0.5)', borderRadius: '50%' , width: '60px', height: '60px', zIndex: 1}}
      onClick={onClick}
    >
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#007BFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ position: 'relative',top:'18px', left: '18px' }}>
        <polyline points="12 19 5 12 12 5"></polyline>
      </svg>
    </div>
  );
}

const settings = {
  dots: true,
  infinite: true,
  speed: 500,
  slidesToShow: 3,
  slidesToScroll: 1,
  autoplay: true,
  autoplaySpeed: 3000,
  pauseOnHover: true,
  nextArrow: <CustomNextArrow />,
  prevArrow: <CustomPrevArrow />,
};
const positivityMapping = {
  'OVERWHELMING_POSITIVE': '압도적으로 긍정적',
  'VERY_POSITIVE': '매우 긍정적',
  'MOSTLY_POSITIVE': '대체로 긍정적',
  'MIXED': '혼합적',
  'MOSTLY_NEGATIVE': '대체로 부정적',
  'VERY_NEGATIVE': '매우 부정적',
  'UNKNOWN': '정보 없음'
};
export default function Recommend() {
  const [gameDetailsByRelease, setGameDetailsByRelease] = useState([]);
  const [gameDetailsByTop, setGameDetailsByTop] = useState([]);
  const [gameDetailsByPositive, setGameDetailsByPositive] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loadingTopGames, setLoadingTopGames] = useState(true);
  const [loadingDateGames, setLoadingDateGames] = useState(true);

  useEffect(() => {
    const fetchGameDetailsByRelease = async () => {
    setLoadingDateGames(true);
      try {
        const details = await gameAPI.getGameDetailsByRelease();
        setGameDetailsByRelease(details.content);
      } catch (error) {
        console.error('Error fetching game details:', error);
      }finally{
        setLoadingDateGames(false);
      }
    };

    fetchGameDetailsByRelease();
  }, []);
  useEffect(() => {
      const fetchGameDetailsByTop = async () => {
      setLoadingTopGames(true);
        try {
          const details = await gameAPI.getGameDetailsByTop();
          setGameDetailsByTop(details.content);
        } catch (error) {
          console.error('Error fetching game details:', error);
        }finally{
           setLoadingTopGames(false);
        }
      };

      fetchGameDetailsByTop();
    }, []);
    useEffect(() => {
    const token = localStorage.getItem('access');
        if(token) {
          setIsLoggedIn(true);
        } else {
          setIsLoggedIn(false);
        }
      }, []);

    useEffect(() => {
          const fetchGameDetailsByPositive = async () => {
            try {
              const details = await gameAPI.getGameDetailsByPositive();
              setGameDetailsByPositive(details.content);
            } catch (error) {
              console.error('Error fetching game details:', error);
            }
          };

          fetchGameDetailsByPositive();
    }, []);
    const truncateString = (str, num) => {
        if (str.length <= num) {
          return str;
        }
        return str.slice(0, num) + '..';
      };
    if (!gameDetailsByTop || !gameDetailsByRelease) {
       return <div>Loading...</div>;
    }
  return (

        <div>
        <style jsx global>{`
                .slick-prev:before, .slick-next:before {
                  display: none; // 기본 화살표 아이콘 숨기기
                }
              `}</style>
              <div className="w-full flex justify-center">
                      <Image
                        src="/svgs/event_header.svg"
                        alt="Event Header"
                        width={1280}
                        height={300}
                        priority
                        className="w-full h-auto"
                      />
                    </div>
             <div className="bg-white py-5 sm:py-10" >
               <div className="mx-auto max-w-7xl px-6 lg:px-8">
                 <div className="mx-auto max-w-2xl lg:mx-0">
                   <p className="pb-5 text-2xl leading-8  text-black-600 font-bold" >신규 출시</p>
                 </div>
                 {loadingDateGames ? (
                 <div className="flex justify-center items-center w-full h-[400px]">
                   <Spinner color="primary" size="lg" />
                 </div>
                 ):(
                 <Slider {...settings}>
                   {gameDetailsByRelease.map((post) => (
                     <div key={post.id} className="p-4">
                     <Link href={`/game/${String(post.id)}`}>
                       <div className="overflow-hidden rounded-3xl bg-white text-sm leading-6 shadow-lg hover:shadow-xl">
                         <Image  className = "w-full h-48 object-cover" src={post.headerImagePath} alt={post.title} width={500} height={200}  />
                         <div className="p-6">
                           <h3 className="text-lg font-bold text-gray-900 mb-1">{truncateString(post.name, 35)}</h3>
                           {post.getGameCategoryDTOList.slice(0, 4).map((category) => {
                             const shortenedName = category.name.length > 7
                               ? `${category.name.slice(0, 7)}..`
                               : category.name;
                             return (
                               <span key={category.name} className="text-gray-600 rounded bg-blue-100 ring-1 sm:px-0.5 py-1 mx-1" style ={{backgroundColor: '#D2DAF8'}}>
                                 {shortenedName}
                               </span>
                             );
                           })}
                           <p className="mt-2"><span className="font-bold mr-2">가격</span>&nbsp;<span>{post.price==0 ? "무료": `${post.price}원` }</span></p>
                           <span className="font-bold mr-2">평가</span>&nbsp;<span>{positivityMapping[post.positive]}</span>
                           <p className="text-gray-600"><strong>출시일</strong> &nbsp;{moment(post.releaseDate).format('YYYY.MM.DD')}</p>
                           <div className="flex items-center">
                                <span className="font-bold mr-2">한국어 지원 여부</span>
                                {post.koIsPosible ? (
                                    <FaCheck className="text-green-500" />
                                ) : (
                                    <FaTimes className="text-red-500" />
                                )}
                           </div>
                         </div>
                       </div></Link>
                     </div>
                   ))}
                 </Slider>)}

               </div>
             </div>

             <div className="bg-blue-50 py-24 sm:py-10">
               <div className="mx-auto max-w-7xl px-6 lg:px-8">
                 <div className="mx-auto max-w-2xl lg:mx-0">
                   <p className="pb-5 text-2xl leading-8  text-black-600 font-bold" >인기 게임</p>
                 </div>
                 {loadingTopGames ? (
                 <div className="flex justify-center items-center w-full h-[400px]">
                   <Spinner color="primary" size="lg" />
                 </div>
                  ) : (
                  <Slider {...settings}>
                    {gameDetailsByTop.filter(post => post.id && post.name).map((post) => (
                      <div key={post.id} className="p-4">
                      <Link href={`/game/${String(post.id)}`}>
                        <div className="overflow-hidden rounded-3xl bg-white text-sm leading-6 shadow-lg hover:shadow-xl">
                          <Image className = "w-full h-48 object-cover"src={post.headerImagePath} alt={post.title} width={500} height={300} />
                          <div className="p-6">
                            <h3 className="text-lg font-bold text-gray-900 mb-1">{post.name}</h3>
                            {post.getGameCategoryDTOList.slice(0, 4).map((category) => {
                              const shortenedName = category.name.length > 7
                                ? `${category.name.slice(0, 7)}..`
                                : category.name;
                              return (
                                <span key={category.name} className="text-gray-600 rounded bg-blue-100 ring-1 sm:px-0.5 py-1 mx-1" style ={{backgroundColor: '#D2DAF8'}}>
                                  {shortenedName}
                                </span>
                              );
                            })}
                            <p className="mt-2"><span className="font-bold mr-2">가격</span>&nbsp;<span>{post.price==0 ? "무료": `${post.price}원` }</span></p>
                            <span className="font-bold mr-2">평가</span>&nbsp;<span>{positivityMapping[post.positive]}</span>
                            <p><strong>출시일</strong> &nbsp;{moment(post.releaseDate).format('YYYY.MM.DD')}</p>
                            <div className="flex items-center">
                                 <span className="font-bold mr-2">한국어 지원 여부</span>
                                 {post.koIsPosible ? (
                                     <FaCheck className="text-green-500" />
                                 ) : (
                                     <FaTimes className="text-red-500" />
                                  )}
                             </div>
                          </div>
                        </div></Link>
                      </div>
                    ))}
                  </Slider>)}
               </div>
             </div>
             <div className="bg-white py-24 sm:py-10">
               <div className="mx-auto max-w-7xl px-6 lg:px-8">
                 <div className="mx-auto max-w-2xl lg:mx-0">
                   <p className="pb-5 text-2xl leading-8  text-black-600 font-bold" >내가 추천한 게임</p>
                 </div>
                 {isLoggedIn ? (
                 <Slider {...settings}>
                   {gameDetailsByPositive.map((post) => (
                     <div key={post.id} className="p-4">
                     <Link href={`/game/${String(post.id)}`}>
                       <div className="overflow-hidden rounded-3xl bg-white text-sm leading-6 shadow-lg hover:shadow-xl">
                       <Image className = "w-full h-48 object-cover"src={post.headerImagePath} alt={post.title} width={500} height={300} />
                         <div className="p-6">
                           <h3 className="text-lg font-bold text-gray-900 mb-1">{post.name}</h3>
                           {post.getGameCategoryDTOList.slice(0, 4).map((category) => {
                             const shortenedName = category.name.length > 7
                               ? `${category.name.slice(0, 7)}..`
                               : category.name;
                             return (
                               <span key={category.name} className="text-gray-600 rounded bg-blue-100 ring-1 sm:px-0.5 py-1 mx-1" style ={{backgroundColor: '#D2DAF8'}}>
                                 {shortenedName}
                               </span>
                             );
                           })}
                           <p className="mt-2"><span className="font-bold mr-2">가격</span>&nbsp;<span>{post.price==0 ? "무료": `${post.price}원` }</span></p>
                           <span className="font-bold mr-2">평가</span>&nbsp;<span>{positivityMapping[post.positive]}</span>
                           <p className="text-gray-600"><strong>출시일</strong> &nbsp;{moment(post.releaseDate).format('YYYY.MM.DD')}</p>
                           <div className="flex items-center">
                                <span className="font-bold mr-2">한국어 지원 여부</span>
                                {post.koIsPosible ? (
                                    <FaCheck className="text-green-500" />
                                ) : (
                                    <FaTimes className="text-red-500" />
                                )}
                           </div>
                         </div>
                       </div></Link>
                     </div>
                   ))}
                 </Slider>) :(
                 <div className="flex flex-col items-center justify-center w-full h-full">
                   <p className="text-lg font-semibold text-center mb-4">
                     MyTrophy에 가입하고 추천 게임을 확인하세요
                   </p>
                   <Link href="/signup">
                     <button className="px-4 py-2 bg-[#FF8289] text-white rounded-lg hover:bg-[#FB5A91] transition duration-200">
                       회원가입
                     </button>
                   </Link>
                 </div>)}
               </div>
             </div>

             <div className="bg-blue-50 py-24 sm:py-10">
               <div className="mx-auto max-w-7xl px-6 lg:px-8">
                 <div className="mx-auto max-w-2xl lg:mx-0">
                   <p className="pb-5 text-2xl leading-8  text-black-600 font-bold" >압도적으로 긍정적인 게임</p>
                 </div>
                 <Slider {...settings}>
                   {gameDetailsByPositive.map((post) => (
                     <div key={post.id} className="p-4">
                     <Link href={`/game/${String(post.id)}`}>
                       <div className="overflow-hidden rounded-3xl bg-white text-sm leading-6 shadow-lg hover:shadow-xl">
                       <Image className = "w-full h-48 object-cover"src={post.headerImagePath} alt={post.title} width={500} height={300} />
                         <div className="p-6">
                           <h3 className="text-lg font-bold text-gray-900 mb-1">{post.name}</h3>
                           {post.getGameCategoryDTOList.slice(0, 4).map((category) => {
                             const shortenedName = category.name.length > 7
                               ? `${category.name.slice(0, 7)}..`
                               : category.name;
                             return (
                               <span key={category.name} className="text-gray-600 rounded bg-blue-100 ring-1 sm:px-0.5 py-1 mx-1" style ={{backgroundColor: '#D2DAF8'}}>
                                 {shortenedName}
                               </span>
                             );
                           })}
                           <p className="mt-2"><span className="font-bold mr-2">가격</span>&nbsp;<span>{post.price==0 ? "무료": `${post.price}원` }</span></p>
                           <span className="font-bold mr-2">평가</span>&nbsp;<span>{positivityMapping[post.positive]}</span>
                           <p className="text-gray-600"><strong>출시일</strong> &nbsp;{moment(post.releaseDate).format('YYYY.MM.DD')}</p>
                           <div className="flex items-center">
                                <span className="font-bold mr-2">한국어 지원 여부</span>
                                {post.koIsPosible ? (
                                    <FaCheck className="text-green-500" />
                                ) : (
                                    <FaTimes className="text-red-500" />
                                )}
                           </div>
                         </div>
                       </div></Link>
                     </div>
                   ))}
                 </Slider>
               </div>
             </div>
        </div>

  );
}
