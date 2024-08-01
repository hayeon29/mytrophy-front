'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import articleAPI from '@/services/article';
import gameAPI from '@/services/game';
import { handleAxiosError } from '@/utils/handleAxiosError';
import ARTICLE_CATEGORY from '@/constants/articleCategory';
import { ARTICLE_SEARCH } from '@/constants/SortOption';
import PageSelectButton from '@/components/common/PageSelectButton';
import Edit from '@/components/icon/Edit';

import { useModal } from '@/hooks/useModal';
import OkModal from '@/components/modals/OkModal';
import { ArticleListType } from '@/types/Article';
import OptionSelection from '@/components/common/OptionSelection';

export default function Article() {
  const [activeButton, setActiveButton] = useState('');
  const [articles, setArticles] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedSortOption, setSelectedSortOption] = useState('제목');
  const searchRef = useRef<HTMLInputElement>(null);
  const { modal, openModal } = useModal();

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        // 게시글 목록 가져오기
        const response = await articleAPI.getArticleList(currentPage - 1, 10);
        const articles = response.content;
        setArticles(articles);
        setTotalPages(response.totalPages);

        // 각 게시물의 appId를 사용하여 게임 세부 정보를 가져오기
        const articlesWithGameDetails = await Promise.all(
          articles.map(async (article) => {
            // 게임 세부 정보를 가져오고
            const gameDetail = (await gameAPI.getGameDetail(article.appId))
              .data;

            // 해당 게임 세부 정보를 해당 게시물에 추가하여 새로운 객체를 생성
            return {
              ...article,
              gameDetail,
            };
          })
        );

        // 게임 세부 정보가 추가된 게시물 목록으로 상태를 업데이트
        setArticles(articlesWithGameDetails);
      } catch (error) {
        handleAxiosError(error);
      }
    };

    fetchArticles();
  }, [currentPage]);

  const handleClick = async (header) => {
    try {
      let response;

      if (activeButton === header) {
        // 이미 눌렀던 버튼을 다시 누르면 전체 게시글을 가져옵니다.
        response = await articleAPI.getArticleList(currentPage - 1, 10);
        setActiveButton('ALL');
      } else {
        // 새로운 헤더를 클릭한 경우 해당 헤더의 게시글을 가져옵니다.
        response = await articleAPI.getArticlesByHeader(
          header,
          currentPage - 1,
          10
        );
        setActiveButton(header);
      }

      // 가져온 게시글의 상세 정보를 함께 가져와서 articlesWithGameDetails를 생성합니다.
      const articlesWithGameDetails = await Promise.all(
        response.content.map(async (article) => {
          const gameDetail = (await gameAPI.getGameDetail(article.appId)).data;
          return {
            ...article,
            gameDetail,
          };
        })
      );

      // 게임 세부 정보가 추가된 게시물 목록으로 상태를 한 번에 업데이트합니다.
      setArticles(articlesWithGameDetails);
      setTotalPages(response.totalPages);
    } catch (error) {
      // 에러가 발생한 경우 처리합니다.
      handleAxiosError(error);
    }
  };

  const handleSortOptionClick = (option: string) => {
    setSelectedSortOption(option);
  };

  const ArticleBackgroundColor = {
    FREE_BOARD: 'bg-primary',
    INFORMATION: 'bg-sky-400',
    GUIDE: 'bg-yellow-300',
    REVIEW: 'bg-second',
  };

  const handleSearchClick = async () => {
    if (searchRef.current.value.length <= 0) {
      openModal(<OkModal message="키워드를 작성해주세요." />);
      searchRef.current.blur();
      return;
    }
    const searchResponse = await articleAPI.getArticlesByKeyword({
      target: ARTICLE_SEARCH[selectedSortOption],
      keyword: searchRef.current.value,
    });

    if (searchResponse.status === 200) {
      const searchResult = searchResponse.data as ArticleListType;
      setArticles(searchResult.content);
      setTotalPages(searchResult.totalPages);
    }
  };

  return (
    <>
      {modal.component}
      <div className="bg-whiteBlue flex flex-col items-center h-full min-h-[calc(100vh-80px)]">
        <div className="w-full max-w-1280 min-w-1024 relative pt-4 flex flex-row justify-between items-center">
          {/* 카테고리 선택 */}
          <div className="flex justify-left items-center p-0 gap-4">
            {Object.keys(ARTICLE_CATEGORY).map((value) => {
              return (
                <button
                  key={value}
                  type="button"
                  color="primary"
                  onClick={() => handleClick(value)}
                  className={`${activeButton === value ? 'bg-primary text-white border-primary' : 'bg-white text-blueBlack border-blueLightGray'} border-1 rounded-md px-4 py-2 text-sm`}
                >
                  {ARTICLE_CATEGORY[value]}
                </button>
              );
            })}
          </div>
          <div className="flex flex-row items-center gap-x-3">
            {/* 옵션 선택 컴포넌트 */}
            <OptionSelection
              selectedSortOption={selectedSortOption}
              handleSortOptionClick={handleSortOptionClick}
              optionData={ARTICLE_SEARCH}
            />
            {/* 검색 컴포넌트 */}
            <div>
              <input
                type="text"
                placeholder="검색하기"
                className="py-3 pl-5 pr-10 w-72 rounded-full border-1 border-blueLightGray focus:border-primary outline-none text-sm"
                ref={searchRef}
                onKeyUp={(event) => {
                  if (event.key === 'Enter') {
                    handleSearchClick();
                  }
                }}
              />
              <Image
                src="svgs/search.svg"
                width={16}
                height={16}
                alt="검색 아이콘"
                className="absolute top-1/2 right-5 cursor-pointer"
                onClick={handleSearchClick}
              />
            </div>
          </div>
        </div>
        {/* 게시글 Cards */}
        <div className="w-full max-w-1280 min-w-1024 flex flex-col justify-center items-center py-4 gap-y-6 relative">
          {articles.length === 0 ? (
            <div className="w-full py-8 rounded-3xl bg-white border-1 border-blueLightGray drop-shadow-primary text-center text-blueLightGray text-2xl">
              검색 결과가 없습니다.
            </div>
          ) : (
            articles.map((article) => (
              <div
                key={article.id}
                className="w-full bg-white border-1 border-blueLightGray rounded-2xl drop-shadow-primary p-8 flex flex-col gap-y-4"
              >
                {/* Card Header */}
                <div className="flex flex-row justify-between">
                  <div className="flex gap-x-3 items-center">
                    <Image
                      width={32}
                      height={32}
                      className="w-8 h-8 rounded-full object-cover"
                      alt={`${article.id}의 프로필 사진`}
                      src={article.memberImage || 'svgs/person.svg'}
                    />
                    <div className="flex gap-1 items-start flex-col sm:flex-row sm:items-center">
                      <h5 className="text-sm leading-none text-blackGray">
                        {article.nickname} {/* 유저 이름 */}
                      </h5>
                      <h4 className="text-sm tracking-tight text-blackGray">
                        ({article.username}) {/* 유저 아이디 */}
                      </h4>
                    </div>
                    {ARTICLE_CATEGORY[article.header] && (
                      <span
                        className={`${ArticleBackgroundColor[article.header]} rounded-sm text-white px-2 py-0.5 text-sm mr-2`}
                      >
                        {ARTICLE_CATEGORY[article.header]}
                      </span>
                    )}
                  </div>
                  {/* Counts */}
                  <div className="flex items-center ">
                    <Image
                      width={16}
                      height={16}
                      alt="recommend"
                      src="/svgs/recommend.svg"
                    />
                    <span className="text-sm text-primary ml-[6px] mr-4">
                      {article.cntUp}
                    </span>
                    <Image
                      width={16}
                      height={16}
                      alt="comment"
                      src="/svgs/commentIcon.svg"
                    />
                    <span className="text-sm text-primary ml-[6px]">
                      {article.commentCount}
                    </span>
                  </div>
                </div>
                <div className="flex flex-col gap-y-3 text-black">
                  <div className="flex-grow">
                    <Link
                      href={`/article/${article.id}`}
                      className="flex flex-col"
                    >
                      <h1 className="font-bold text-xl">{article.name}</h1>
                    </Link>
                  </div>
                  <div className="flex flex-row justify-between">
                    <p className="overflow-ellipsis text-sm line-clamp-5">
                      {article.content}
                    </p>
                    {/* Image */}
                    {article.gameDetail && (
                      <Image
                        width={240}
                        height={144}
                        alt="side image"
                        src={article.gameDetail.headerImagePath}
                        className="bg-white"
                      />
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
          <Link href="/article/write/modal">
            <span
              role="presentation"
              className="fixed w-20 h-20 bg-primary rounded-full bottom-8 right-8 flex items-center justify-center drop-shadow-primary cursor-pointer"
            >
              <Edit fill="#FFFFFF" width={32} height={32} />
            </span>
          </Link>
          <PageSelectButton
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            totalPage={totalPages}
          />
        </div>
      </div>
    </>
  );
}
