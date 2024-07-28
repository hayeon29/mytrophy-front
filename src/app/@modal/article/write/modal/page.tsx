'use client';

import Image from 'next/image';
import RouterModal from '@/components/modals/RouterModal';
import CommonArticle from '@/components/write/CommonArticle';
import PartyArticle from '@/components/write/PartyArticle';
import RatingArticle from '@/components/write/RatingArticle';
import ARTICLE_CATEGORY from '@/constants/articleCategory';
import { PartyContent, WriteContent } from '@/types/WriteContent';
import { ChangeEvent, useRef, useState } from 'react';
import GameSearchModal from '@/components/modals/GameSearchModal';
import { GetGameDetailDTO } from '@/types/GameDetail';
import withAuth from '@/app/PrivateRoute';
import { useModal } from '@/hooks/useModal';
import OkModal from '@/components/modals/OkModal';
import articleAPI from '@/services/article';

function ArticleModal() {
  const { modal, openModal } = useModal();
  const [selectedCategory, setSelectedCategory] = useState(0); // 현재 선택한 카테고리
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const content = useRef<WriteContent | PartyContent>({
    title: '',
    content: '',
    partySize: 0,
    partyOption: '',
    partyTime: '',
  }); // 내용
  const [isSearchOpened, setIsSearchOpened] = useState(false); // 검색창 열림 여부
  const [selectedGame, setSelectedGame] = useState<GetGameDetailDTO | null>(
    null
  );

  // 카테고리 클릭 시 '선택한 카테고리' 변경 함수
  const handleCategoryClick = (index) => {
    setSelectedCategory(index);
  };

  // 게시글 작성 시 내용 작성할 때마다 내용 값 저장하는 함수
  const handleContentChange = <
    T extends HTMLInputElement | HTMLTextAreaElement,
  >(
    event: ChangeEvent<T>
  ) => {
    content.current = {
      ...content.current,
      [event.target.name]:
        typeof content[event.target.name] === 'number'
          ? Number(event.target.value)
          : event.target.value,
    };
  };

  // 파일 첨부 시 화면에 파일 리스트 보여주기 위한 함수
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = event.target;
    setSelectedFiles((prev) => [...prev, ...Array.from(files)]);
  };

  // 파일 리스트에서 파일 삭제 시 발생하는 이벤트 함수
  const handleDeleteFileClick = (index: number) => {
    setSelectedFiles((prev) =>
      prev.filter((_, fileIndex) => fileIndex !== index)
    );
  };

  const handleSelectGame = (game: GetGameDetailDTO) => {
    setSelectedGame(game);
    setIsSearchOpened(false);
  };

  const handleArticleCompleteClick = async () => {
    if (content.current.title.length <= 0) {
      openModal(<OkModal message="제목을 작성해야 합니다." />);
      return;
    }

    if (content.current.content.length <= 0) {
      openModal(<OkModal message="내용을 작성해야 합니다." />);
      return;
    }

    let fileUrls: null | string = null;

    if (selectedFiles.length > 0) {
      const fileFormData = new FormData();
      for (let i = 0; i < selectedFiles.length; i += 1) {
        fileFormData.append('file', selectedFiles[i]);
      }
      fileUrls = (await articleAPI.articleFileUpload(fileFormData)).join(',');
    }

    const writeResponse = await articleAPI.articleCreate({
      header: Object.keys(ARTICLE_CATEGORY)[selectedCategory],
      name: content.current.title,
      content: content.current.content,
      appId: selectedGame?.id.toString(),
      imagePath: fileUrls,
    });

    if (writeResponse.status === 200) {
      openModal(
        <OkModal
          message="게시글 작성이 완료되었습니다."
          onClick={() => {
            if (typeof window !== undefined) {
              window.location.href = '/write';
            }
          }}
        />
      );
    } else {
      openModal(
        <OkModal message="게시글 작성에 실패했습니다. 다시 작성해주세요." />
      );
    }
  };

  return (
    <div className="w-full">
      {modal.component}
      {isSearchOpened && (
        <GameSearchModal
          onClose={() => {
            setIsSearchOpened(false);
          }}
          onSelect={handleSelectGame}
          selectedGame={selectedGame}
        />
      )}
      <RouterModal title="글쓰기">
        <div className="py-3 px-5 border-b-1 border-disable ">
          <div className="flex justify-left items-center p-0 gap-4">
            {Object.keys(ARTICLE_CATEGORY).map((value, index) => {
              return (
                <button
                  key={value}
                  type="button"
                  color="primary"
                  onClick={() => handleCategoryClick(index)}
                  className={`${index === selectedCategory ? 'bg-primary text-white border-primary' : 'bg-white text-blueBlack border-blueLightGray'} border-1 rounded-md px-4 py-2 text-sm`}
                >
                  {ARTICLE_CATEGORY[value]}
                </button>
              );
            })}
          </div>
        </div>
        <button
          type="button"
          className="w-full py-5 px-5 border-b-1 border-disable text-sm"
          onClick={() => setIsSearchOpened(true)}
        >
          {selectedGame ? (
            <div className="w-full flex flex-row gap-x-4 items-center text-sm cursor-pointer">
              {selectedGame.headerImagePath && (
                <Image
                  src={selectedGame.headerImagePath}
                  width={48}
                  height={22}
                  alt={`${selectedGame.name}의 게임 사진`}
                  className="object-cover"
                />
              )}
              <span className="text-ellipsis">{selectedGame.name}</span>
            </div>
          ) : (
            <p className="text-disable text-start">게임을 선택해주세요.</p>
          )}
        </button>
        <div className="py-4 px-5 border-b-1 border-disable">
          <input
            type="text"
            name="title"
            placeholder="제목을 입력해주세요."
            className="w-full outline-none text-sm"
            onChange={handleContentChange}
          />
        </div>
        <div className="flex flex-col">
          {(selectedCategory === 0 || selectedCategory === 1) && (
            <CommonArticle setContent={handleContentChange} />
          )}
          {selectedCategory === 2 && (
            <RatingArticle setContent={handleContentChange} />
          )}
          {selectedCategory === 3 && (
            <PartyArticle setContent={handleContentChange} />
          )}
          <div
            className={`flex flex-row gap-x-3 border-y-1 border-disable ${selectedFiles.length === 0 ? 'p-7' : 'p-4'}`}
          >
            {selectedFiles.map((value, index) => {
              return (
                <span
                  key={`${value.name}-${index}`}
                  className="flex flex-row gap-x-1 items-center"
                >
                  {value.name}
                  <button
                    type="button"
                    onClick={() => {
                      handleDeleteFileClick(index);
                    }}
                  >
                    <Image
                      src="/svgs/close.svg"
                      width={14}
                      height={14}
                      alt="파일 삭제 버튼"
                    />
                  </button>
                </span>
              );
            })}
          </div>
          <div className="flex flex-row justify-between p-4">
            <input
              type="file"
              className="hidden"
              id="articleFile"
              onChange={handleFileChange}
              multiple
            />
            <label
              htmlFor="articleFile"
              className="border-1 border-primary text-primary px-14 py-3 rounded-xl"
            >
              파일 선택
            </label>
            <button
              type="button"
              className="bg-primary px-14 py-3 rounded-xl text-white self-end"
              onClick={handleArticleCompleteClick}
            >
              작성 완료
            </button>
          </div>
        </div>
      </RouterModal>
    </div>
  );
}

export default withAuth(ArticleModal);
