'use client';

import React, { useCallback, useEffect, useState } from 'react';
import Image from 'next/image';
import gameAPI from '@/services/game';
import { FaCheck, FaTimes } from 'react-icons/fa';
import Link from 'next/link';
import { Pagination, Spinner } from '@nextui-org/react';
import { useSearchParams, useRouter } from 'next/navigation';
import Category from '@/components/home/Category';
import { HomeCategory } from '@/types/HomeCategory';
import GAME_CATEGORY from '@/constants/gameCategory';
import { handleAxiosError } from '@/utils/handleAxiosError';

export default function GameList() {
  const [gameDetails, setGameDetails] = useState([]);
  const [sortOption, setSortOption] = useState('최신순');
  const [selectedCategoryIds, setSelectedCategoryIds] = useState([]);
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [keyword, setKeyword] = useState('');

  const itemsPerPage = 10;

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

  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const keywordFromURL = searchParams.get('keyword') || '';
    setKeyword(keywordFromURL);
  }, [searchParams]);

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
    router.push(`/gamelist?page=${page}`);
  };

  const loadMoreData = useCallback(
    async (page) => {
      const filterData = {
        page,
        size: itemsPerPage,
        keyword,
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
        handleAxiosError(error);
      } finally {
        setLoading(false);
      }
    },
    [keyword, priceRange.max, priceRange.min, selectedCategoryIds, sortOption]
  );

  const handleApplyFilters = async () => {
    setCurrentPage(1);
    await loadMoreData(1);
    router.push(`/gamelist?page=1`);
  };

  useEffect(() => {
    if (keyword != null) loadMoreData(currentPage);
  }, [currentPage, sortOption, loadMoreData, keyword]);

  return (
    <div className="bg-white py-5 sm:py-10">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="flex justify-between items-center mb-4">
          <div className="mx-auto max-w-2xl lg:mx-0">
            <p className="pb-5 text-3xl leading-8 text-black-600 font-bold">
              게임 목록
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <input
              type="text"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="검색"
              className="border border-gray-300 rounded-md p-2"
            />
            <button
              type="button"
              onClick={handleApplyFilters}
              className="bg-blue-500 text-white rounded-md p-2"
            >
              검색
            </button>
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
        </div>
        <div className="flex">
          <div className="w-3/4">
            {loading ? (
              <div className="flex justify-center items-center h-full">
                <Spinner />
              </div>
            ) : (
              <div>
                <div className="grid grid-cols-1 gap-6">
                  {gameDetails.map((post) => (
                    <Link href={`/game/${String(post.id)}`} key={post.id}>
                      <div
                        key={post.id}
                        className="flex items-start p-4 rounded-lg bg-white shadow-md hover:shadow-xl"
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
                              {truncateString(post.name, 40)}
                            </h3>
                            <Category
                              categories={
                                post.getGameCategoryDTOList as HomeCategory[]
                              }
                            />
                            <p className="text-gray-600">
                              {' '}
                              {positivityMapping[post.positive]}
                            </p>
                            <div className="flex justify-between items-center mt-1">
                              <div className="flex items-center">
                                <span className="font-bold mr-2">
                                  한국어 지원 여부
                                </span>
                                {post.koIsPosible ? (
                                  <FaCheck className="text-green-500" />
                                ) : (
                                  <FaTimes className="text-red-500" />
                                )}
                              </div>
                              <p className="text-gray-600">
                                <strong>가격</strong>&nbsp;{' '}
                                {post.price === 0 ? '무료' : `${post.price}원`}{' '}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
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
          <div className="w-1/4 pl-6">
            <div className="mb-4">
              <h4 className="font-bold mb-2">카테고리</h4>
              <div className="grid grid-cols-2 gap-2 bg-gray-100 shadow-md p-4 rounded-lg">
                {GAME_CATEGORY.map((category) => (
                  <button
                    type="button"
                    key={category.id}
                    className={`px-2 py-1 rounded-full text-sm ${
                      selectedCategoryIds.includes(category.id)
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-200'
                    }`}
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
          </div>
        </div>
      </div>
    </div>
  );
}
