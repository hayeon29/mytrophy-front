'use client';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import gamesAPI from '@/services/games';
import moment from "moment";

export default function GameList() {
  const [gameDetailsByRelease, setGameDetailsByRelease] = useState([]);

  useEffect(() => {
    const fetchGameDetails = async () => {
      try {
        const details = await gamesAPI.getGameDetailsByRelease();
        console.log(details.content);
        setGameDetailsByRelease(details.content);
      } catch (error) {
        console.error('Error fetching game details:', error);
      }
    };

    fetchGameDetails();
  }, []);

  return (
    <div className="bg-white py-5 sm:py-10">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:mx-0">
          <p className="pb-5 text-3xl leading-8 text-black-600 font-bold">게임 목록</p>
        </div>
        <div className="grid grid-cols-1 gap-6">
          {gameDetailsByRelease.map((post) => (
            <div key={post.id} className="flex items-start p-4 rounded-lg bg-white shadow-md">
              <Image className="w-48 h-24 object-cover rounded-lg" src={post.headerImagePath} alt={post.name} width={96} height={96} />
              <div className="ml-4 flex flex-col justify-between flex-grow">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{post.name}</h3>
                  <div className="flex flex-wrap mb-1">
                    {post.getGameCategoryDTOList.map((category) => (
                      <span key={category.id} className="text-gray-600 rounded bg-blue-100 ring-1 ring-gray-300 px-2 mx-1 mb-1">
                        {category.name}
                      </span>
                    ))}
                  </div>
                  <p className="text-gray-600"><strong>출시일:</strong> {moment(post.releaseDate).format('YYYY.MM.DD')}</p>
                  <div className="flex justify-between items-center mt-1">
                    <p className="text-gray-600 flex items-center"><strong>한국어 지원:</strong>
                      {post.koIsPosible ? (
                        <img className="w-6 h-6 ml-2" src="https://firebasestorage.googleapis.com/v0/b/nomo-62b92.appspot.com/o/free-icon-checkmark-8832119.png?alt=media&token=c1d8aa90-2ea5-487d-b2da-dc253ab2af75" alt="지원" />
                      ) : (
                        <img className="w-6 h-6 ml-2" src="https://firebasestorage.googleapis.com/v0/b/nomo-62b92.appspot.com/o/free-icon-letter-x-9972749.png?alt=media&token=9c5cf909-d02f-486b-8233-dfee3ee16a7e" alt="미지원" />
                      )}
                    </p>
                    <p className="text-gray-600"><strong>가격:</strong> {post.price}원</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
