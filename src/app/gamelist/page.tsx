'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import gameAPI from '@/services/game';
import { Pagination, Spinner } from '@nextui-org/react';

export default function GameList() {
  const [gameDetails, setGameDetails] = useState([]);
  const [sortOption, setSortOption] = useState('최신순');
  const [selectedCategoryIds, setSelectedCategoryIds] = useState([]);
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [totalItems, setTotalItems] = useState(0); // 총 아이템 수

  const itemsPerPage = 10;

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
    return `${str.slice(0, num)}..`;
  };

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    fetchTotalItems();
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    handleApplyFilters();
  }, [selectedCategoryIds, priceRange]);

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    loadMoreData(currentPage);
  }, [currentPage, sortOption]);

  const handleSortChange = (event) => {
    setSortOption(event.target.value);
  };

  const handleCategoryChange = (categoryId) => {
    setSelectedCategoryIds((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const handlePriceChange = (e) => {
    setPriceRange({ ...priceRange, [e.target.name]: e.target.value });
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleApplyFilters = async () => {
    setCurrentPage(1);
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    await loadMoreData(1);
  };

  const fetchTotalItems = async () => {
    try {
      const response = await gameAPI.getTotalItems();
      setTotalItems(response);
    } catch (error) {
      console.error('Error fetching total items:', error);
    }
  };

  const loadMoreData = async (page) => {
    const filterData = {
      page,
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
      setLoading(true);
      const details = await gameAPI.getFilteredGames(filterData);
      setGameDetails(details.content);
      setTotalPages(details.totalPages);
    } catch (error) {
      console.error('Error applying filters:', error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="bg-white py-5 sm:py-10">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="flex justify-between items-center mb-4">
          <div className="mx-auto max-w-2xl lg:mx-0">
            <p className="pb-5 text-3xl leading-8 text-black-600 font-bold">
              게임 목록
            </p>
          </div>
          <select
            value={sortOption}
            onChange={handleSortChange}
            className="border border-gray-300 rounded-md p-2"
          >
            <option value="최신순">최신순</option>
            <option value="이름순">이름순</option>
            <option value="가격순">가격순</option>
          </select>
        </div>
        <div className="flex">
          <div className="w-3/4">
            {/* Game List Section */}
            {loading ? (
              <div className="flex justify-center items-center h-full">
                <Spinner />
              </div>
            ) : (
              <div>
                <div className="grid grid-cols-1 gap-6">
                  {gameDetails.map((post) => (
                    <div
                      key={post.id}
                      className="flex items-start p-4 rounded-lg bg-white shadow-md"
                    >
                      <Image
                        className="object-cover rounded-lg"
                        src={post.headerImagePath}
                        alt={post.name}
                        width={250}
                        height={130}
                      />
                      <div className="ml-4 flex flex-col justify-between flex-grow">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 mb-1">
                            {truncateString(post.name, 15)}
                          </h3>
                          <div className="flex flex-wrap mb-1">
                            {post.getGameCategoryDTOList
                              .slice(0, 5)
                              .map((category) => {
                                const shortenedName =
                                  category.name.length > 10
                                    ? `${category.name.slice(0, 10)}..`
                                    : category.name;
                                return (
                                  <span
                                    key={category.name}
                                    className="text-gray-600 rounded bg-blue-100 ring-1 sm:px-0.5 py-1 mx-1"
                                  >
                                    {shortenedName}
                                  </span>
                                );
                              })}
                          </div>
                          <p className="text-gray-600">
                            {' '}
                            {positivityMapping[post.positive]}
                          </p>
                          <div className="flex justify-between items-center mt-1">
                            <p className="text-gray-600 flex items-center">
                              <strong>한국어 지원:</strong>
                              {post.koIsPosible ? (
                                <img
                                  className="w-6 h-6 ml-2"
                                  src="https://firebasestorage.googleapis.com/v0/b/nomo-62b92.appspot.com/o/free-icon-checkmark-8832119.png?alt=media&token=c1d8aa90-2ea5-487d-b2da-dc253ab2af75"
                                  alt="지원"
                                />
                              ) : (
                                <img
                                  className="w-6 h-6 ml-2"
                                  src="https://firebasestorage.googleapis.com/v0/b/nomo-62b92.appspot.com/o/free-icon-letter-x-9972749.png?alt=media&token=9c5cf909-d02f-486b-8233-dfee3ee16a7e"
                                  alt="미지원"
                                />
                              )}
                            </p>
                            <p className="text-gray-600">
                              <strong>가격:</strong> {post.price}원
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex justify-center mt-4">
                  <Pagination
                    total={totalPages}
                    initialPage={1}
                    page={currentPage}
                    onChange={handlePageChange}
                  />
                </div>
              </div>
            )}
          </div>
          {/* Filter Section */}
          <div className="w-1/4 pl-6">
            <div className="mb-4">
              <h4 className="font-bold mb-2">카테고리</h4>
              <div className="grid grid-cols-2 gap-2 bg-gray-100 shadow-md p-4 rounded-lg">
                {categories.map((category) => (
                  // eslint-disable-next-line react/button-has-type
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
                  />
                  <br />
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
            {/* eslint-disable-next-line react/button-has-type */}
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
