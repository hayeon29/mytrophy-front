'use client';
import { useEffect, useState } from 'react';
import clsx from 'clsx';
import Image from 'next/image';
import gameAPI from '@/services/game';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import moment from "moment";




  const trending = [
    {
      id: 1,
      title: 'Baldur\'s Gate 3',
      imageUrl: "https://firebasestorage.googleapis.com/v0/b/nomo-62b92.appspot.com/o/steam3.png?alt=media&token=55345148-49fb-444f-bbfe-65623d3f4684",
      price: '60,000원',
      releaseDate: '2023.07.01',
      platform: '스팀',
      languageSupport: false,
      category : ['액션','어드벤처','오픈 월드','풍부한 스토리','전투'],
    },
    {
      id: 2,
      title: 'HELLDIVERS™ 2',
      imageUrl: "https://firebasestorage.googleapis.com/v0/b/nomo-62b92.appspot.com/o/steam2.png?alt=media&token=da0a75bb-5eb7-423a-ac25-d62809224da6",
      price: '44,800원',
      releaseDate: '2023.07.02',
      platform: '스팀',
      languageSupport: false,
      category :['액션','어드벤처','오픈 월드','풍부한 스토리','전투'],
    },
    {
      id: 3,
      title: 'PUBG: BATTLEGROUNDS',
      imageUrl: 'https://firebasestorage.googleapis.com/v0/b/nomo-62b92.appspot.com/o/steam1.png?alt=media&token=1c4c9231-18bf-4145-b62a-6bee24e6e131',
      price: '무료',
      releaseDate: '2023.07.03',
      platform: '스팀',
      languageSupport: true,
      category : ['액션','어드벤처','오픈 월드','풍부한 스토리','전투'],
    },
    {
          id: 4,
          title: 'PUBG: BATTLEGROUNDS',
          imageUrl: `${process.env.NEXT_PUBLIC_FRONT_URL}/svgs/logo.svg`,
          price: '무료',
          releaseDate: '2023.07.03',
          platform: '스팀',
          languageSupport: true,
          category : ['액션','어드벤처','오픈 월드','풍부한 스토리','전투'],
        },
  ];

function CustomNextArrow(props) {
  const { className, style, onClick } = props;
  return (
    <div
      className={`${className} custom-arrow custom-next-arrow`}
      style={{ ...style, display: 'block', background: 'rgba(230,230,230, 0.5)', borderRadius: '50%', width: '60px', height: '60px', zIndex: 1 }}
      onClick={onClick}
    >
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#007BFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ position: 'relative',top:'18px', left: '18px' }}>
        <line x1="5" y1="12" x2="19" y2="12"></line>
        {/*<line x1="11" y1="5" x2="11" y2="19"></line> */}
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
        <line x1="19" y1="12" x2="5" y2="12"></line>
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
  'MIXED': '복합적',
  'MOSTLY_NEGATIVE': '대체로 부정적',
  'VERY_NEGATIVE': '매우 부정적',
  'UNKNOWN': '정보 없음'
};
export default function Recommend() {
  const [gameDetailsByRelease, setGameDetailsByRelease] = useState([]);
  const [gameDetailsByTop, setGameDetailsByTop] = useState([]);
  const [gameDetailsByPositive, setGameDetailsByPositive] = useState([]);

  useEffect(() => {
    const fetchGameDetailsByRelease = async () => {
      try {
        const details = await gameAPI.getGameDetailsByRelease();
        console.log(details.content);
        setGameDetailsByRelease(details.content);
      } catch (error) {
        console.error('Error fetching game details:', error);
      }
    };

    fetchGameDetailsByRelease();
  }, []);
  useEffect(() => {
      const fetchGameDetailsByTop = async () => {
        try {
          const details = await gameAPI.getGameDetailsByTop();
          console.log(details.content);
          setGameDetailsByTop(details.content);
        } catch (error) {
          console.error('Error fetching game details:', error);
        }
      };

      fetchGameDetailsByTop();
    }, []);
    useEffect(() => {
          const fetchGameDetailsByPositive = async () => {
            try {
              const details = await gamesAPI.getGameDetailsByPositive();
              console.log(details.content);
              console.log(details.content[0].getGameCategoryDTOList[1].name);
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
             <div className="bg-white py-5 sm:py-10" >
               <div className="mx-auto max-w-7xl px-6 lg:px-8">
                 <div className="mx-auto max-w-2xl lg:mx-0">
                   <p className="pb-5 text-3xl leading-8  text-black-600 font-bold" >신규 출시</p>
                 </div>
                 <Slider {...settings}>
                   {gameDetailsByRelease.map((post) => (
                     <div key={post.id} className="p-2">
                       <div className="overflow-hidden rounded-3xl bg-white text-sm leading-6 shadow-lg ring-1 ring-gray-900/5">
                         <Image  className = "w-full h-64 object-cover" src={post.headerImagePath} alt={post.title} width={500} height={200}  />
                         <div className="p-6">
                           <h3 className="text-lg font-semibold text-gray-900 mb-1">{truncateString(post.name, 35)}</h3>

                           {post.getGameCategoryDTOList.slice(0, 4).map((category) => {
                             const shortenedName = category.name.length > 7
                               ? `${category.name.slice(0, 7)}..`
                               : category.name;
                             return (
                               <span key={category.name} className="text-gray-600 rounded bg-blue-100 ring-1 sm:px-0.5 py-1 mx-1">
                                 {shortenedName}
                               </span>
                             );
                           })}
                           <p className="text-gray-600 mt-2"><strong>가격</strong>&nbsp; {post.price}원</p>
                           <p className="text-gray-600"><strong>평가</strong>&nbsp; {positivityMapping[post.positive]}</p>
                           <p className="text-gray-600"><strong>출시일</strong> &nbsp; {moment(post.releaseDate).format('YYYY.MM.DD')}</p>
                           <p className="text-gray-600 flex"><strong>한국어 지원 여부</strong> &nbsp;
                            {post.koIsPosible ?
                           (<img className = "w-6 h-6 flex"  src="https://firebasestorage.googleapis.com/v0/b/nomo-62b92.appspot.com/o/free-icon-checkmark-8832119.png?alt=media&token=c1d8aa90-2ea5-487d-b2da-dc253ab2af75"/>) :
                           (<img  className = "w-5 h-5 flex" src="https://firebasestorage.googleapis.com/v0/b/nomo-62b92.appspot.com/o/free-icon-letter-x-9972749.png?alt=media&token=9c5cf909-d02f-486b-8233-dfee3ee16a7e"/>)}  </p>
                         </div>
                       </div>
                     </div>
                   ))}
                 </Slider>
               </div>
             </div>

             <div className="bg-blue-50 py-24 sm:py-10">
               <div className="mx-auto max-w-7xl px-6 lg:px-8">
                 <div className="mx-auto max-w-2xl lg:mx-0">
                   <p className="pb-5 text-3xl leading-8  text-black-600 font-bold" >인기 게임</p>
                 </div>
                 <Slider {...settings}>
                   {gameDetailsByTop.filter(post => post.id && post.name).map((post) => (
                     <div key={post.id} className="p-2">
                       <div className="overflow-hidden rounded-3xl bg-white text-sm leading-6 shadow-lg ring-1 ring-gray-900/5">
                         <Image className = "w-full h-64 object-cover"src={post.headerImagePath} alt={post.title} width={500} height={300} />
                         <div className="p-6">
                           <h3 className="text-lg font-semibold text-gray-900 mb-1">{post.name}</h3>
                           {post.getGameCategoryDTOList.slice(0, 4).map((category) => {
                             const shortenedName = category.name.length > 7
                               ? `${category.name.slice(0, 7)}..`
                               : category.name;
                             return (
                               <span key={category.name} className="text-gray-600 rounded bg-blue-100 ring-1 sm:px-0.5 py-1 mx-1">
                                 {shortenedName}
                               </span>
                             );
                           })}
                           <p className="text-gray-600 mt-2"><strong>가격</strong>&nbsp; {post.price}원</p>
                           <p className="text-gray-600"><strong>평가</strong>&nbsp; {positivityMapping[post.positive]}</p>
                           <p className="text-gray-600"><strong>출시일</strong> &nbsp; {moment(post.releaseDate).format('YYYY.MM.DD')}</p>
                           <p className="text-gray-600 flex"><strong>한국어 지원 여부</strong> &nbsp;
                            {post.koIsPosible ?
                           (<img className = "w-6 h-6 flex"  src="https://firebasestorage.googleapis.com/v0/b/nomo-62b92.appspot.com/o/free-icon-checkmark-8832119.png?alt=media&token=c1d8aa90-2ea5-487d-b2da-dc253ab2af75"/>) :
                           (<img  className = "w-5 h-5 flex" src="https://firebasestorage.googleapis.com/v0/b/nomo-62b92.appspot.com/o/free-icon-letter-x-9972749.png?alt=media&token=9c5cf909-d02f-486b-8233-dfee3ee16a7e"/>)}  </p>
                         </div>
                       </div>
                     </div>
                   ))}
                 </Slider>
               </div>
             </div>
             <div className="bg-white py-24 sm:py-10">
               <div className="mx-auto max-w-7xl px-6 lg:px-8">
                 <div className="mx-auto max-w-2xl lg:mx-0">
                   <p className="pb-5 text-3xl leading-8  text-black-600 font-bold" >내가 추천한 게임</p>
                 </div>
                 <Slider {...settings}>
                   {gameDetailsByPositive.map((post) => (
                     <div key={post.id} className="p-2">
                       <div className="overflow-hidden rounded-3xl bg-white text-sm leading-6 shadow-lg ring-1 ring-gray-900/5">
                       <Image className = "w-full h-64 object-cover"src={post.headerImagePath} alt={post.title} width={500} height={300} />
                         <div className="p-6">
                           <h3 className="text-lg font-semibold text-gray-900 mb-1">{post.name}</h3>
                           {post.getGameCategoryDTOList.slice(0, 4).map((category) => {
                             const shortenedName = category.name.length > 7
                               ? `${category.name.slice(0, 7)}..`
                               : category.name;
                             return (
                               <span key={category.name} className="text-gray-600 rounded bg-blue-100 ring-1 sm:px-0.5 py-1 mx-1">
                                 {shortenedName}
                               </span>
                             );
                           })}
                           <p className="text-gray-600 mt-2"><strong>가격</strong>&nbsp; {post.price}원</p>
                           <p className="text-gray-600"><strong>평가</strong>&nbsp; {positivityMapping[post.positive]}</p>
                           <p className="text-gray-600"><strong>출시일</strong> &nbsp; {moment(post.releaseDate).format('YYYY.MM.DD')}</p>
                           <p className="text-gray-600 flex"><strong>한국어 지원 여부</strong> &nbsp;
                            {post.koIsPosible ?
                           (<img className = "w-6 h-6 flex"  src="https://firebasestorage.googleapis.com/v0/b/nomo-62b92.appspot.com/o/free-icon-checkmark-8832119.png?alt=media&token=c1d8aa90-2ea5-487d-b2da-dc253ab2af75"/>) :
                           (<img  className = "w-5 h-5 flex" src="https://firebasestorage.googleapis.com/v0/b/nomo-62b92.appspot.com/o/free-icon-letter-x-9972749.png?alt=media&token=9c5cf909-d02f-486b-8233-dfee3ee16a7e"/>)}  </p>
                         </div>
                       </div>
                     </div>
                   ))}
                 </Slider>
               </div>
             </div>

             <div className="bg-blue-50 py-24 sm:py-10">
               <div className="mx-auto max-w-7xl px-6 lg:px-8">
                 <div className="mx-auto max-w-2xl lg:mx-0">
                   <p className="pb-5 text-3xl leading-8  text-black-600 font-bold" >압도적으로 긍정적인 게임</p>
                 </div>
                 <Slider {...settings}>
                   {gameDetailsByPositive.map((post) => (
                     <div key={post.id} className="p-2">
                       <div className="overflow-hidden rounded-3xl bg-white text-sm leading-6 shadow-lg ring-1 ring-gray-900/5">
                       <Image className = "w-full h-64 object-cover"src={post.headerImagePath} alt={post.title} width={500} height={300} />
                         <div className="p-6">
                           <h3 className="text-lg font-semibold text-gray-900 mb-1">{post.name}</h3>
                           {post.getGameCategoryDTOList.slice(0, 4).map((category) => {
                             const shortenedName = category.name.length > 7
                               ? `${category.name.slice(0, 7)}..`
                               : category.name;
                             return (
                               <span key={category.name} className="text-gray-600 rounded bg-blue-100 ring-1 sm:px-0.5 py-1 mx-1">
                                 {shortenedName}
                               </span>
                             );
                           })}
                           <p className="text-gray-600 mt-2"><strong>가격</strong>&nbsp; {post.price}원</p>
                           <p className="text-gray-600"><strong>평가</strong>&nbsp; {positivityMapping[post.positive]}</p>
                           <p className="text-gray-600"><strong>출시일</strong> &nbsp; {moment(post.releaseDate).format('YYYY.MM.DD')}</p>
                           <p className="text-gray-600 flex"><strong>한국어 지원 여부</strong> &nbsp;
                            {post.koIsPosible ?
                           (<img className = "w-6 h-6 flex"  src="https://firebasestorage.googleapis.com/v0/b/nomo-62b92.appspot.com/o/free-icon-checkmark-8832119.png?alt=media&token=c1d8aa90-2ea5-487d-b2da-dc253ab2af75"/>) :
                           (<img  className = "w-5 h-5 flex" src="https://firebasestorage.googleapis.com/v0/b/nomo-62b92.appspot.com/o/free-icon-letter-x-9972749.png?alt=media&token=9c5cf909-d02f-486b-8233-dfee3ee16a7e"/>)}  </p>
                         </div>
                       </div>
                     </div>
                   ))}
                 </Slider>
               </div>
             </div>
        </div>

  );
}
