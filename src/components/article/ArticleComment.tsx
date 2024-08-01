'use client';

import { userState } from '@/recoils/userAtom';
import { CommentType } from '@/types/Article';
import { useRecoilValue } from 'recoil';
import Image from 'next/image';
import { useEffect, useMemo, useRef, useState } from 'react';
import { COMMENT_SORT } from '@/constants/SortOption';
import commentAPI from '@/services/comment';
import { handleAxiosError } from '@/utils/handleAxiosError';
import { useModal } from '@/hooks/useModal';
import OptionSelection from '../common/OptionSelection';
import CommentWithReply from './CommentWithReply';
import OkModal from '../modals/OkModal';
import OkCancelModal from '../modals/OkCancelModal';

export default function ArticleComment({
  articleId,
  commentData,
}: {
  articleId: string;
  commentData: CommentType[];
}) {
  const userData = useRecoilValue(userState);
  const [isMounted, setIsMounted] = useState(false);
  const { openModal } = useModal();
  const commentRef = useRef<HTMLTextAreaElement>(null);
  const commentDataToMount = useMemo(() => {
    const newCommentData = [];
    for (let i = 0; i < commentData.length; i += 1) {
      if (commentData[i].parentCommentId === null) {
        newCommentData.push([commentData[i], []]);
        for (let j = 0; j < commentData.length; j += 1) {
          if (commentData[i].id === commentData[j].parentCommentId) {
            newCommentData[i][1].push(commentData[j]);
          }
        }
      }
    }
    return newCommentData;
  }, [commentData]);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const [selectedSortOption, setSelectedSortOption] = useState('최신 순');

  const handleSortOptionClick = (option: string) => {
    setSelectedSortOption(option);
  };

  const handleCommentSubmit = async () => {
    if (commentRef.current.value.length === 0) {
      openModal(<OkModal message="내용을 작성해주세요." />);
      return;
    }
    try {
      await commentAPI
        .createComment({
          articleId,
          content: commentRef.current.value,
        })
        .then((response) => {
          if (response.status === 201) {
            if (window !== undefined) {
              window.location.reload();
            }
          }
        });
    } catch (error) {
      handleAxiosError(error);
    }
  };

  const handleDisabledTextArea = () => {
    openModal(
      <OkCancelModal
        message="로그인 후 댓글을 작성할 수 있습니다. 확인을 누르면 로그인 페이지로 이동합니다."
        okMessage="확인"
        onOk={() => {
          if (window !== undefined) {
            window.location.href = '/login';
          }
        }}
      />
    );
  };

  return (
    <div className="flex flex-col gap-y-4">
      <h2 className="font-bold text-xl">댓글</h2>
      {isMounted && userData && (
        <div className="flex flex-row gap-x-2 items-center">
          <Image
            src={userData?.imagePath || '/svgs/person.svg'}
            width={36}
            height={36}
            alt="로그인한 사용자 프로필 사진"
          />
          <span className="text-sm">
            {userData?.nickname || '로그인 한 유저'}
          </span>
        </div>
      )}
      <div className="flex flex-row gap-x-4">
        {isMounted && (
          <>
            <textarea
              className="w-full h-18 p-6 bg-blueLightGray rounded-xl text-sm outline-none whitespace-normal resize-none"
              placeholder={
                userData
                  ? '댓글을 작성하세요.'
                  : '로그인 후 댓글을 작성할 수 있습니다.'
              }
              onClick={() => {
                if (!userData) {
                  handleDisabledTextArea();
                }
              }}
              ref={commentRef}
            />
            <button
              type="button"
              className="text-white p-4 rounded-xl text-sm shrink-0 bg-primary disabled:bg-disable"
              onClick={handleCommentSubmit}
              disabled={!userData}
            >
              댓글 작성
            </button>
          </>
        )}
      </div>
      {commentData.length > 0 && (
        <>
          <OptionSelection
            selectedSortOption={selectedSortOption}
            handleSortOptionClick={handleSortOptionClick}
            optionData={COMMENT_SORT}
          />
          <div className="border-t border-blueGray">
            {commentDataToMount.map((eachComments) => {
              return (
                <CommentWithReply
                  key={eachComments[0].id}
                  mainComment={eachComments[0]}
                  subComments={eachComments[1]}
                />
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
