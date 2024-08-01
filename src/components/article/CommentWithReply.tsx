import { CommentType } from '@/types/Article';
import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { useRecoilValue } from 'recoil';
import { userState } from '@/recoils/userAtom';
import commentAPI from '@/services/comment';
import { handleAxiosError } from '@/utils/handleAxiosError';
import { useModal } from '@/hooks/useModal';
import Comment from './Comment';
import OkCancelModal from '../modals/OkCancelModal';
import OkModal from '../modals/OkModal';
import Recommend from '../icon/Recommend';

export default function CommentWithReply({
  mainComment,
  subComments,
}: {
  mainComment: CommentType;
  subComments: Array<CommentType>;
}) {
  const userData = useRecoilValue(userState);
  const [isMounted, setIsMounted] = useState(false);
  const [isReplyVisible, setIsReplyVisible] = useState(false);
  const [mainCommentRecommend, setMainCommentRecommend] = useState<
    [boolean, number]
  >([false, mainComment.likes]);
  const [replyCommentsRecommend, setReplyCommentsRecommend] = useState<
    Array<[boolean, number]>
  >(
    subComments.map((eachSubComment) => {
      return [false, eachSubComment.likes];
    })
  );
  const replyRef = useRef<HTMLTextAreaElement>(null);
  const { openModal } = useModal();

  const handleReplyVisibleClick = () => {
    setIsReplyVisible((prev) => !prev);
  };

  const handleReplySubmit = async () => {
    if (replyRef.current.value.length === 0) {
      openModal(<OkModal message="내용을 작성해주세요." />);
      return;
    }
    try {
      await commentAPI
        .createComment({
          articleId: mainComment.articleId.toString(),
          content: replyRef.current.value,
          parentCommentId: mainComment.id,
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

  const handleDeleteComment = async (commentId: string) => {
    openModal(
      <OkCancelModal
        message="댓글을 삭제하시겠습니까?"
        okMessage="삭제하기"
        onOk={async () => {
          await commentAPI
            .deleteComment(commentId)
            .then((response) => {
              if (response.status === 204) {
                openModal(
                  <OkModal
                    message="댓글이 삭제되었습니다."
                    onClick={() => {
                      if (window !== undefined) {
                        window.location.reload();
                      }
                    }}
                  />
                );
              }
            })
            .catch(handleAxiosError);
        }}
      />
    );
  };

  const handleReplyLikesClick = async (commentId: string, index: number) => {
    await commentAPI
      .commentLike(commentId)
      .then((response) => {
        if (response.status === 200) {
          setReplyCommentsRecommend((prev) => {
            const newReplyCommentsRecommend = [...prev];
            const clickedReply = newReplyCommentsRecommend[index];
            newReplyCommentsRecommend[index] = [
              !clickedReply[0],
              clickedReply[0] ? clickedReply[1] - 1 : clickedReply[1] + 1,
            ];
            return newReplyCommentsRecommend;
          });
        }
      })
      .catch(() => {
        openModal(<OkModal message="댓글 추천에 실패했습니다." />);
      });
  };

  const handleCommentLikesClick = async (commentId: string) => {
    await commentAPI
      .commentLike(commentId)
      .then((response) => {
        if (response.status === 200) {
          setMainCommentRecommend((prev) => [
            !prev[0],
            prev[0] ? prev[1] - 1 : prev[1] + 1,
          ]);
        }
      })
      .catch(() => {
        openModal(<OkModal message="댓글 추천에 실패했습니다." />);
      });
  };

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <div>
      {isMounted && (
        <div>
          {/* 댓글 */}
          <div className="flex flex-col text-sm border-b border-blueGray py-4">
            <Comment comment={mainComment} />
            <div className="text-blueLightBlack flex flex-row gap-x-2 mt-5">
              <button
                type="button"
                className={`flex flex-row items-center gap-x-1 border-1 rounded p-2 ${mainCommentRecommend[0] ? 'border-primary' : 'border-blueGray'}`}
                onClick={() => {
                  handleCommentLikesClick(mainComment.id.toString());
                }}
              >
                <Recommend isRecommended={mainCommentRecommend[0]} />
                <span
                  className={
                    mainCommentRecommend[0]
                      ? 'text-primary'
                      : 'text-blueLightBlack'
                  }
                >
                  {mainCommentRecommend[1]}
                </span>
              </button>
              <button
                type="button"
                className="flex flex-row items-center gap-x-1 border-1 border-blueGray rounded p-2"
                onClick={handleReplyVisibleClick}
              >
                {isReplyVisible ? '답글 숨기기' : '답글 조회'}
              </button>
              {Number(userData?.id) === mainComment.memberId && (
                <button
                  type="button"
                  className="flex flex-row items-center gap-x-1 border-1 border-blueGray rounded p-2"
                  onClick={() => {
                    handleDeleteComment(mainComment.id.toString());
                  }}
                >
                  삭제
                </button>
              )}
            </div>
          </div>
          {/* 답글 */}
          {isReplyVisible && (
            <div className="bg-whiteBlue px-4 border-b border-blueGray">
              {subComments.map((eachSubComments, index) => {
                return (
                  <div
                    key={eachSubComments.id}
                    className={`py-4 ${index >= 1 && 'border-t border-blueGray'}`}
                  >
                    <Comment
                      key={eachSubComments.id}
                      comment={eachSubComments}
                    />
                    <div className="flex flex-row gap-x-2 text-sm text-blueLightBlack mt-5">
                      <button
                        type="button"
                        className={`flex flex-row items-center gap-x-1 border-1 border-blueGray rounded p-2 text-sm text-blueLightBlack bg-white ${replyCommentsRecommend[index][0] ? 'border-primary' : 'border-blueGray'}`}
                        onClick={() => {
                          handleReplyLikesClick(
                            eachSubComments.id.toString(),
                            index
                          );
                        }}
                      >
                        <Recommend
                          isRecommended={replyCommentsRecommend[index][0]}
                        />
                        <span
                          className={
                            replyCommentsRecommend[index][0]
                              ? 'text-primary'
                              : 'text-blueLightBlack'
                          }
                        >
                          {replyCommentsRecommend[index][1]}
                        </span>
                      </button>
                      {Number(userData?.id) === eachSubComments.memberId && (
                        <button
                          type="button"
                          className="flex flex-row items-center gap-x-1 border-1 border-blueGray rounded p-2 bg-white"
                          onClick={() => {
                            handleDeleteComment(eachSubComments.id.toString());
                          }}
                        >
                          삭제
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
              <div
                className={`flex flex-col gap-y-4 py-4 ${subComments.length > 0 && 'border-t border-blueGray'}`}
              >
                <div className="flex flex-row gap-x-2 items-center">
                  <Image
                    src={userData?.imagePath || '/svgs/person.svg'}
                    width={36}
                    height={36}
                    alt="로그인한 사용자 프로필 사진"
                    className="rounded-full"
                  />
                  <span className="text-sm">
                    {userData?.nickname || '로그인 한 유저'}
                  </span>
                </div>
                <div className="flex flex-row gap-x-4 ">
                  <textarea
                    className="w-full h-18 p-6 bg-blueLightGray rounded-xl text-sm outline-none whitespace-normal resize-none"
                    placeholder={
                      isMounted && userData
                        ? '댓글을 작성하세요.'
                        : '로그인 후 댓글을 작성할 수 있습니다.'
                    }
                    ref={replyRef}
                  />
                  <button
                    type="button"
                    className="bg-primary text-white p-4 rounded-xl text-sm shrink-0"
                    onClick={handleReplySubmit}
                  >
                    댓글 작성
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
