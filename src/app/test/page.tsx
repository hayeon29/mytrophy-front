'use client';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import gamesAPI from '@/services/games';
import ReactPaginate from 'react-paginate';

export default function GameList() {
  const [gameDetails, setGameDetails] = useState([]);
  const [sortOption, setSortOption] = useState('최신순');
  const [selectedCategoryIds, setSelectedCategoryIds] = useState([]); // 카테고리 ID를 관리합니다.
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [currentPage, setCurrentPage] = useState(0);
  const [totalItems, setTotalItems] = useState(0); // 총 아이템 수
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
      const response = await gamesAPI.getTotalItems(); // 총 게임 수를 반환하는 엔드포인트 호출
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
      const details = await gamesAPI.getFilteredGames(filterData);
      setGameDetails(details.content);
    } catch (error) {
      console.error('Error applying filters:', error);
    }
  };

  const categories = [
    { id: 1, name: '액션' },
    { id: 2, name: '1인칭 슈팅' },
    { id: 3, name: '3인칭 슈팅' },
    { id: 4, name: '격투 및 무술' },
    { id: 5, name: '슈팅업' },
    { id: 6, name: '아케이드 및 리듬' },
    { id: 7, name: '플랫폼 게임 및 러너' },
    { id: 8, name: '액션 슬래시' },
    { id: 9, name: 'RPG' },
    { id: 10, name: 'JRPG' },
    { id: 11, name: '로그라이크 및 로그라이트' },
    { id: 12, name: '액션 RPG' },
    { id: 13, name: '어드벤처 RPG' },
    { id: 14, name: '전략 및 전술 RPG' },
    { id: 15, name: '턴제 RPG' },
    { id: 16, name: '파티 기반 RPG' },
    { id: 17, name: '전략' },
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

  const totalPages = Math.ceil(totalItems / itemsPerPage);

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
                <div key={post.id} className="flex items-start p-4 rounded-lg bg-white shadow-md">
                  <Image className="w-48 h-28 object-cover rounded-lg" src={post.headerImagePath} alt={post.name} width={96} height={96} />
                  <div className="ml-4 flex flex-col justify-between flex-grow">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">
                        {truncateString(post.name, 15)}
                      </h3>
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
            <div className="mb-4">
              <h4 className="font-bold mb-2">카테고리</h4>
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
              <div className="bg-gray-100 shadow-md p-4 rounded-lg">
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
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded-md"
              onClick={handleApplyFilters}
            >
              설정
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
