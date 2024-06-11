'use client';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import gameAPI from '@/services/game';
import ReactPaginate from 'react-paginate';
import { FaCheck, FaTimes } from "react-icons/fa";
import Link from 'next/link';
import { Spinner } from '@nextui-org/react';

export default function GameList() {
  const [gameDetails, setGameDetails] = useState([]);
  const [sortOption, setSortOption] = useState('최신순');
  const [selectedCategoryIds, setSelectedCategoryIds] = useState([]); // 카테고리 ID를 관리합니다.
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [currentPage, setCurrentPage] = useState(0);
  const [totalItems, setTotalItems] = useState(0); // 총 아이템 수
  const [totalPages, setTotalPages] =useState(0);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchTotalItems();
    handleApplyFilters();
  }, [selectedCategoryIds, priceRange]);

  useEffect(() => {
    loadMoreData(currentPage);
  }, [currentPage, sortOption]);

  const handleSortChange = (event) => {
    setSortOption(event.target.value);
  };

  const handleCategoryChange = (categoryId) => {
    setSelectedCategoryIds((prev) =>
      prev.includes(categoryId) ? prev.filter((id) => id !== categoryId) : [...prev, categoryId]
    );
  };

  const handlePriceChange = (e) => {
    setPriceRange({ ...priceRange, [e.target.name]: e.target.value });
  };

  const handlePageClick = async (data) => {
    const selectedPage = data.selected;
    setCurrentPage(selectedPage);
  };

  const handleApplyFilters = async () => {
    setCurrentPage(0);
    await loadMoreData(0); // 첫 페이지 데이터를 불러오기
  };

  const fetchTotalItems = async () => {
    try {
      const response = await gameAPI.getTotalItems(); // 총 게임 수를 반환하는 엔드포인트 호출
      setTotalItems(response);
    } catch (error) {
      console.error('Error fetching total items:', error);
    }
  };

  const loadMoreData = async (page) => {
    const filterData = {
      page: page + 1,
      size: itemsPerPage,
      keyword: '',
      categoryIds: selectedCategoryIds,
      minPrice: priceRange.min,
      maxPrice: priceRange.max,
      isFree: priceRange.min === '0' && priceRange.max === '0',
      startDate: null,
      endDate: null,
      nameSortDirection: sortOption === '이름순' ? 'ASC' : null,
      priceSortDirection: sortOption === '가격순' ? 'ASC' : null,
      recommendationSortDirection: null,
      dateSortDirection: sortOption === '최신순' ? 'DESC' : null,
    };

    try {
      const details = await gameAPI.getFilteredGames(filterData);
      setGameDetails(details.content);
      console.log(details.content);
      setTotalPages(details.totalPages);
      console.log(details.totalPages);
    } catch (error) {
      console.error('Error applying filters:', error);
    }
  };

  const categories = [
    { id: 101, name: '액션' },
    { id: 102, name: '전략' },
    { id: 103, name: 'RPG' },
    { id: 104, name: '캐주얼' },
    { id: 109, name: '레이싱' },
    { id: 118, name: '스포츠' },
    { id: 123, name: '인디' },
    { id: 125, name: '어드벤처' },
    { id: 128, name: '시뮬레이션' },
    { id: 154, name: '교육' },
    { id: 31, name: 'VR 지원' },
    { id: 49, name: 'PvP' },
    { id: 9, name: '협동' },
    { id: 1, name: '멀티 플레이어' },
    { id: 2, name: '싱글 플레이어' },
    { id: 62, name: '가족' },
    { id: 170, name: '앞서 해보기' },
    { id: 157, name: '유틸리티' },
  ];

  const positivityMapping = {
    OVERWHELMING_POSITIVE: '압도적으로 긍정적',
    VERY_POSITIVE: '매우 긍정적',
    MOSTLY_POSITIVE: '대체로 긍정적',
    MIXED: '복합적',
    MOSTLY_NEGATIVE: '대체로 부정적',
    VERY_NEGATIVE: '매우 부정적',
    UNKNOWN: '정보 없음',
  };

  const truncateString = (str, num) => {
    if (str.length <= num) {
      return str;
    }
    return str.slice(0, num) + '..';
  };

  // totalPages = Math.ceil(totalItems / itemsPerPage);

  return (
    <div className="bg-white py-5 sm:py-10">
      <style jsx global>{`
        .pagination {
          display: flex;
          justify-content: center;
          padding: 1rem 0;
          list-style: none;
        }

        .page-item {
          margin: 0 0.25rem;
        }

        .page-link {
          padding: 0.5rem 0.75rem;
          border: 1px solid #ddd;
          border-radius: 0.25rem;
          color: #007bff;
          text-decoration: none;
          cursor: pointer;
        }

        .page-link:hover {
          background-color: #e9ecef;
        }

        .active .page-link {
          background-color: #007bff;
          color: white;
          border-color: #007bff;
        }
      `}</style>
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
          <div className="w-3/4">
            <div className="grid grid-cols-1 gap-6">
              {gameDetails.map((post) => (
              <Link href={`/game/${String(post.id)}`}>
                <div key={post.id} className="flex items-start p-4 rounded-lg bg-white shadow-md">

                  <Image className="w-72 h-32 object-cover rounded-lg" src={post.headerImagePath} alt={post.name} width={300} height={96} />
                  <div className="ml-4 flex flex-col justify-between flex-grow">
                    <div>
                      <h2 className="text-xl font-bold text-gray-900 mb-1">
                        {truncateString(post.name, 50)}
                      </h2>
                      <div className="flex flex-wrap mb-1">
                        {post.getGameCategoryDTOList.slice(0, 5).map((category) => {
                          const shortenedName = category.name.length > 10
                            ? `${category.name.slice(0, 10)}..`
                            : category.name;
                          return (
                            <span key={category.name} className="text-gray-600 rounded  sm:px-1 py-1 mx-1" style ={{backgroundColor: '#D2DAF8'}}>
                              {shortenedName}
                            </span>
                          );
                        })}
                      </div>
                      <p className="text-gray-600"> <strong>평가</strong>&nbsp;{positivityMapping[post.positive]}</p>
                      <div className="flex justify-between items-center mt-1">
                        <div className="flex items-center">
                             <span className="font-bold mr-2">한국어 지원 여부</span>
                             {post.koIsPosible ? (
                                 <FaCheck className="text-green-500" />
                             ) : (
                                 <FaTimes className="text-red-500" />
                             )}
                        </div>

                        <p className="text-gray-600"><strong>가격</strong>&nbsp; {post.price==0 ? "무료": `${post.price}원` }</p>
                      </div>
                    </div>
                  </div>
                </div></Link>
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
              pageClassName={'page-item'}
              pageLinkClassName={'page-link'}
              previousClassName={'page-item'}
              previousLinkClassName={'page-link'}
              nextClassName={'page-item'}
              nextLinkClassName={'page-link'}
              breakClassName={'page-item'}
              breakLinkClassName={'page-link'}
              activeClassName={'active'}
            />
          </div>
          {/* Filter Section */}
          <div className="w-1/4 pl-6">
            <div className="mb-4   ">
              <h4 className="font-bold mb-2 ">카테고리</h4>
              <div className="grid grid-cols-2 gap-2 bg-gray-100 shadow-md p-4 rounded-lg">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    className={`px-2 py-1 rounded-full text-sm ${selectedCategoryIds.includes(category.id) ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                    onClick={() => handleCategoryChange(category.id)}
                  >
                    {category.name}
                  </button>
                ))}
              </div>
            </div>
            <div className="mb-4">
              <h4 className="font-bold mb-2">가격</h4>
              <div className="bg-gray-100 shadow-md p-4 rounded-lg ">
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
                    placeholder="최소 금액"
                    className="border border-gray-300 rounded-md p-2 w-full mr-2"
                    disabled={priceRange.min === '0' && priceRange.max === '0'}
                  /><br />
                  <input
                    type="number"
                    name="max"
                    value={priceRange.max}
                    onChange={handlePriceChange}
                    placeholder="최대 금액"
                    className="border border-gray-300 rounded-md p-2 w-full"
                    disabled={priceRange.min === '0' && priceRange.max === '0'}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
