'use client';
import { useEffect, useState } from 'react';
import clsx from 'clsx';
import Image from 'next/image';
import gamesAPI from '@/services/games';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const  Gamelist = [
    {
      id: 1,
      title: 'Animal Trainer Simulator: Prologue',
      imageUrl: "https://firebasestorage.googleapis.com/v0/b/nomo-62b92.appspot.com/o/steam2.png?alt=media&token=da0a75bb-5eb7-423a-ac25-d62809224da6", // 이미지 경로를 적절히 수정하세요
      price: '무료',
      releaseDate: '2023.06.01',
      platform: '스팀',
      languageSupport: '한국어 지원',
      category : ['시뮬레이션','캐주얼','귀여운','분위기 있는','경엉'],
    },
    {
      id: 2,
      title: 'Morbid: The Lords of Ire',
      imageUrl: `${process.env.NEXT_PUBLIC_FRONT_URL}/svgs/logo.svg`, // 이미지 경로를 적절히 수정하세요
      price: '무료',
      releaseDate: '2023.06.02',
      platform: '스팀',
      languageSupport: '한국어 지원',
      category : ['시뮬레이션','캐주얼','귀여운','분위기 있는','경엉'],
    },
    {
      id: 3,
      title: 'Ghost of Tsushima 디렉터스 컷',
      imageUrl: `${process.env.NEXT_PUBLIC_FRONT_URL}/svgs/logo.svg`, // 이미지 경로를 적절히 수정하세요
      price: '₩62,800원',
      releaseDate: '2023.06.03',
      platform: '스팀',
      languageSupport: '한국어 지원',
      category : ['시뮬레이션','캐주얼','귀여운','분위기 있는','경엉'],
    },
  ];

  const trending = [
    {
      id: 1,
      title: 'Baldur\'s Gate 3',
      imageUrl: '/path/to/baldurs_gate_image.png', // 이미지 경로를 적절히 수정하세요
      price: '₩60,000원',
      releaseDate: '2023.07.01',
      platform: '스팀',
      languageSupport: '한국어 지원',
      category : ['액션','어드벤처','오픈 월드','풍부한 스토리','전투'],
    },
    {
      id: 2,
      title: 'HELLDIVERS™ 2',
      imageUrl: '/path/to/helldivers_image.png', // 이미지 경로를 적절히 수정하세요
      price: '₩44,800원',
      releaseDate: '2023.07.02',
      platform: '스팀',
      languageSupport: '한국어 지원',
      category :['액션','어드벤처','오픈 월드','풍부한 스토리','전투']
    },
    {
      id: 3,
      title: 'PUBG: BATTLEGROUNDS',
      imageUrl: '/path/to/pubg_image.png', // 이미지 경로를 적절히 수정하세요
      price: '무료',
      releaseDate: '2023.07.03',
      platform: '스팀',
      languageSupport: '한국어 지원',
      category : ['액션','어드벤처','오픈 월드','풍부한 스토리','전투'],
    },
    {
          id: 4,
          title: 'PUBG: BATTLEGROUNDS',
          imageUrl: '/path/to/pubg_image.png', // 이미지 경로를 적절히 수정하세요
          price: '무료',
          releaseDate: '2023.07.03',
          platform: '스팀',
          languageSupport: '한국어 지원',
          category : ['액션','어드벤처','오픈 월드','풍부한 스토리','전투'],
        },
  ];
// function CustomNextArrow(props) {
//   const { className, style, onClick } = props;
//   return (
//     <div
//       className={`${className} custom-arrow custom-next-arrow`}
//       style={{ ...style, display: 'block', borderRadius: '50%', width: '60px', height: '60px', zIndex: 1 }}
//       onClick={onClick}
//     >
//     </div>
//   );
// }
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
  slidesToShow: 4,
  slidesToScroll: 1,
  nextArrow: <CustomNextArrow />,
  prevArrow: <CustomPrevArrow />,
};

export default function Gamelist() {
  const [gameDetails, setGameDetails] = useState([]);
/*
  useEffect(() => {
    const fetchGameDetails = async () => {
      try {
        const details = await gamesAPI.getGameDetails();
        console.log(details);
        setGameDetails(details);
      } catch (error) {
        console.error('Error fetching game details:', error);
      }
    };

    fetchGameDetails();
  }, []);*/


  return (

        <div>
        <style jsx global>{`
                .slick-prev:before, .slick-next:before {
                  display: none; // 기본 화살표 아이콘 숨기기
                }
              `}</style>
             <div className="bg-white py-24 sm:py-10" >
               <div className="mx-auto max-w-7xl px-6 lg:px-8">
                 <div className="mx-auto max-w-2xl lg:mx-0">
                   <p className="mt-2 py-5 text-3xl leading-8  text-black-600 font-bold" >신규 출시</p>
                 </div>
                 <Slider {...settings}>
                   {newReleases.map((post) => (
                     <div key={post.id} className="p-2">
                       <div className="overflow-hidden rounded-3xl bg-white text-sm leading-6 shadow-lg ring-1 ring-gray-900/5">
                         <Image  className = "w-full h-64 object-cover" src={post.imageUrl} alt={post.title} width={500} height={200}  />
                         <div className="p-6">
                           <h3 className="text-lg font-semibold text-gray-900">{post.title}</h3>

                           <p className="text-gray-600">
                           {post.category}
                           </p>
                           <p className="text-gray-600">가격: {post.price}</p>
                           <p className="text-gray-600">출시일: {post.releaseDate}</p>
                           <p className="text-gray-600">플랫폼: {post.platform}</p>
                           <p className="text-gray-600">언어 지원: {post.languageSupport}</p>
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
                   <p className="mt-2 py-5 text-3xl leading-8  text-black-600 font-bold" >인기 급상승</p>
                 </div>
                 <Slider {...settings}>
                   {trending.map((post) => (
                     <div key={post.id} className="p-2">
                       <div className="overflow-hidden rounded-3xl bg-white text-sm leading-6 shadow-lg ring-1 ring-gray-900/5">
                         <Image className = "w-full h-64 object-cover"src={post.imageUrl} alt={post.title} width={500} height={300} />
                         <div className="p-6">
                           <h3 className="text-lg font-semibold text-gray-900">{post.title}</h3>
                           <p className="text-gray-600">{post.category}</p>
                           <p className="text-gray-600">가격: {post.price}</p>
                           <p className="text-gray-600">출시일: {post.releaseDate}</p>
                           <p className="text-gray-600">플랫폼: {post.platform}</p>
                           <p className="text-gray-600">언어 지원: {post.languageSupport}</p>

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
                                <p className="mt-2 py-5 text-3xl leading-8  text-black-600 font-bold" >내가 추천한 게임</p>
                              </div>
                              <Slider {...settings}>
                                {newReleases.map((post) => (
                                  <div key={post.id} className="p-2">
                                    <div className="overflow-hidden rounded-3xl bg-white text-sm leading-6 shadow-lg ring-1 ring-gray-900/5">
                                      <Image  className = "w-full h-64 object-cover" src={post.imageUrl} alt={post.title} width={500} height={200}  />
                                      <div className="p-6">
                                        <h3 className="text-lg font-semibold text-gray-900">{post.title}</h3>
                                        <p className="text-gray-600">가격: {post.price}</p>
                                        <p className="text-gray-600">출시일: {post.releaseDate}</p>
                                        <p className="text-gray-600">플랫폼: {post.platform}</p>
                                        <p className="text-gray-600">언어 지원: {post.languageSupport}</p>
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
                                <p className="mt-2 py-5 text-3xl leading-8  text-black-600 font-bold" >압도적으로 긍정적인 게임</p>
                              </div>
                              <Slider {...settings}>
                                {trending.map((post) => (
                                  <div key={post.id} className="p-2">
                                    <div className="overflow-hidden rounded-3xl bg-white text-sm leading-6 shadow-lg ring-1 ring-gray-900/5">
                                      <Image className = "w-full h-64 object-cover"src={post.imageUrl} alt={post.title} width={500} height={300} />
                                      <div className="p-6">
                                        <h3 className="text-lg font-semibold text-gray-900">{post.title}</h3>
                                        <p className="text-gray-600">가격: {post.price}</p>
                                        <p className="text-gray-600">출시일: {post.releaseDate}</p>
                                        <p className="text-gray-600">플랫폼: {post.platform}</p>
                                        <p className="text-gray-600">언어 지원: {post.languageSupport}</p>
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
