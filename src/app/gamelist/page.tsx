'use client';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import gamesAPI from '@/services/games';
import moment from "moment";
import ReactPaginate from 'react-paginate';

export default function GameList() {
  const [gameDetailsByRelease, setGameDetailsByRelease] = useState([]);
  const [gameDetails, setGameDetails] = useState([]);
  const [sortOption, setSortOption] = useState('최신순');
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchGameDetailsByRelease = async (page = 1) => {
      try {
        const details = await gamesAPI.getGameDetailsByRelease(page, itemsPerPage);
        setGameDetailsByRelease(details.content);
        setTotalPages(details.totalPages);
      } catch (error) {
        console.error('Error fetching game details:', error);
      }
    };

    fetchGameDetailsByRelease(currentPage + 1);
  }, [currentPage]);


useEffect(() => {
    const fetchGameDetails = async (page = 1) => {
      try {
        const details = await gamesAPI.getGameDetails(page, itemsPerPage);
        setGameDetails(details.content);
        setTotalPages(details.totalPages);
        console.log(details.content);
      } catch (error) {
        console.error('Error fetching game details:', error);
      }
    };

    fetchGameDetails(currentPage + 1);
  },  [currentPage]);


  const handleSortChange = (event) => {
    setSortOption(event.target.value);
    sortGames(event.target.value);
  };

  const sortGames = (option) => {
    let sortedGames = [...gameDetailsByRelease];
    if (option === '최신순') {
      sortedGames.sort((a, b) => new Date(b.releaseDate) - new Date(a.releaseDate));
    } else if (option === '이름순') {
      sortedGames.sort((a, b) => a.name.localeCompare(b.name));
    } else if (option === '가격순') {
      sortedGames.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
    }
    setGameDetailsByRelease(sortedGames);
  };

  const handleCategoryChange = (category) => {
    setSelectedCategories(prev =>
      prev.includes(category) ? prev.filter(c => c !== category) : [...prev, category]
    );
  };

  const handlePriceChange = (e) => {
    setPriceRange({ ...priceRange, [e.target.name]: e.target.value });
  };

  const handlePageClick = (data) => {
    setCurrentPage(data.selected);
  };

  const categories = [
    '액션', '1인칭 슈팅', '3인칭 슈팅', '격투 및 무술', '슈팅업',
    '아케이드 및 리듬', '플랫폼 게임 및 러너', '액션 슬래시', 'RPG',
    'JRPG', '로그라이크 및 로그라이트', '액션 RPG', '어드벤처 RPG',
    '전략 및 전술 RPG', '턴제 RPG', '파티 기반 RPG', '전략'
  ];
  const positivityMapping = {
    'OVERWHELMING_POSITIVE': '압도적으로 긍정적',
    'VERY_POSITIVE': '매우 긍정적',
    'MOSTLY_POSITIVE': '대체로 긍정적',
    'MIXED': '복합적',
    'MOSTLY_NEGATIVE': '대체로 부정적',
    'VERY_NEGATIVE': '매우 부정적',
    'UNKNOWN': '정보 없음'
  };

  return (
    <div className="bg-white py-5 sm:py-10">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="flex justify-between items-center mb-4">
          <div className="mx-auto max-w-2xl lg:mx-0">
            <p className="pb-5 text-3xl leading-8 text-black-600 font-bold">게임 목록</p>
          </div>
          <select value={sortOption} onChange={handleSortChange} className="border border-gray-300 rounded-md p-2">
            <option value="최신순">최신순</option>
            <option value="이름순">이름순</option>
            <option value="가격순">가격순</option>
          </select>
        </div>
        <div className="flex">
          {/* Game List Section */}
          <div className="w-4/5">
            <div className="grid grid-cols-1 gap-6">
              {gameDetailsByRelease.map((post) => (
                <div key={post.id} className="flex items-start p-4 rounded-lg bg-white shadow-md">
                  <Image className="w-48 h-28 object-cover rounded-lg" src={post.headerImagePath} alt={post.name} width={96} height={96} />
                  <div className="ml-4 flex flex-col justify-between flex-grow">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{post.name}</h3>
                      <div className="flex flex-wrap mb-1">
                        {post.getGameCategoryDTOList.slice(0, 5).map((category) => {
                          const shortenedName = category.name.length > 10
                            ? `${category.name.slice(0, 10)}..`
                            : category.name;
                          return (
                            <span key={category.name} className="text-gray-600 rounded bg-blue-100 ring-1 sm:px-0.5 py-1 mx-1">
                              {shortenedName}
                            </span>
                          );
                        })}
                      </div>
                      <p className="text-gray-600"> {positivityMapping[post.positive]}</p>
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
            <ReactPaginate
              previousLabel={'«'}
              nextLabel={'»'}
              breakLabel={'...'}
              breakClassName={'break-me'}
              pageCount={totalPages}
              marginPagesDisplayed={2}
              pageRangeDisplayed={5}
              onPageChange={handlePageClick}
              containerClassName={'pagination'}
              subContainerClassName={'pages pagination'}
              activeClassName={'active'}
            />
          </div>
          {/* Filter Section */}
          <div className="w-1/5 pl-6 ">
            <div className="mb-4 ">
              <h4 className="font-bold mb-2">카테고리</h4>
              <div className="grid grid-cols-2 gap-2 bg-gray shadow-md">
                {categories.map(category => (
                  <button
                    key={category}
                    className={`px-2 py-1 rounded-full text-sm ${selectedCategories.includes(category) ? 'bg-blue-500 text-white' : 'bg-white'}`}
                    onClick={() => handleCategoryChange(category)}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <h4 className="font-bold mb-2">가격</h4>
              <div className="mb-2">
                <label className="mr-2">
                  <input
                    type="radio"
                    name="price"
                    value="free"
                    onChange={() => setPriceRange({ min: '0', max: '0' })}
                    className="mr-1"
                  />
                  무료
                </label>
                <label>
                  <input
                    type="radio"
                    name="price"
                    value="custom"
                    onChange={() => setPriceRange({ min: '', max: '' })}
                    className="mr-1"
                  />
                  직접 입력
                </label>
              </div>
              <div className="flex">
                <input
                  type="number"
                  name="min"
                  value={priceRange.min}
                  onChange={handlePriceChange}
                  placeholder="최소 금액 입력"
                  className="border border-gray-300 rounded-md p-2 w-full mr-2"
                  disabled={priceRange.min === '0' && priceRange.max === '0'}
                />
                <input
                  type="number"
                  name="max"
                  value={priceRange.max}
                  onChange={handlePriceChange}
                  placeholder="최대 금액 입력"
                  className="border border-gray-300 rounded-md p-2 w-full"
                  disabled={priceRange.min === '0' && priceRange.max === '0'}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
