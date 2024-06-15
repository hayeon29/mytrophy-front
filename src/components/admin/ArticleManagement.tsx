import React, { useState, useEffect, useCallback } from 'react';
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Chip,
  Tooltip,
  Pagination,
  Spinner,
  Button,
  ModalFooter,
  ModalContent,
  ModalHeader,
  Modal,
  ModalBody,
  useDisclosure,
} from '@nextui-org/react';
import articleAPI from '@/services/article';
import Link from 'next/link';
import { handleAxiosError } from '@/utils/handleAxiosError';
import { DeleteIcon } from '../../../public/icon/DeleteIcon';
import { EyeIcon } from '../../../public/icon/EyeIcon';
import { EditIcon } from '../../../public/icon/EditIcon';

const headerColorMap = {
  FREE_BOARD: 'default',
  INFORMATION: 'success',
  GUIDE: 'warning',
  REVIEW: 'danger',
  CHATTING: 'primary',
};

export default function ArticleManagement() {
  const [articles, setArticles] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [selectedArticle, setSelectedArticle] = useState(null);
  const [editedArticle, setEditedArticle] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [articleToDelete, setArticleToDelete] = useState(null);

  const columns = [
    { name: 'id', uid: 'id' },
    { name: '말머리', uid: 'header' },
    { name: '내용', uid: 'content' },
    { name: '댓글 수', uid: 'commentCount' },
    { name: '추천 수', uid: 'likeCount' },
    { name: '작성자', uid: 'username' },
    { name: '작성 일자', uid: 'createdAt' },
    { name: '', uid: 'actions' },
  ];

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        setLoading(true);
        const response = await articleAPI.getArticleList(currentPage - 1, 10);
        setArticles(response.content);
        setTotalPages(response.totalPages);
      } catch (error) {
        handleAxiosError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, [currentPage]);

  const handleEdit = useCallback(
    (article) => {
      setSelectedArticle(article);
      setEditedArticle(article);
      onOpen();
    },
    [onOpen]
  );

  const handleDelete = async () => {
    try {
      await articleAPI.deleteArticle(articleToDelete.id);
      setArticles((prevArticles) =>
        prevArticles.filter((article) => article.id !== articleToDelete.id)
      );
    } catch (error) {
      handleAxiosError(error);
    } finally {
      setIsDeleteModalOpen(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedArticle({ ...editedArticle, [name]: value });
  };

  const handleSave = async () => {
    try {
      await articleAPI.updateArticle(editedArticle.id, editedArticle);
      setArticles((prevArticles) =>
        prevArticles.map((article) =>
          article.id === editedArticle.id ? editedArticle : article
        )
      );
      onClose();
    } catch (error) {
      handleAxiosError(error);
    }
  };

  const renderCell = useCallback(
    (article, columnKey) => {
      switch (columnKey) {
        case 'id':
          return article.id;
        case 'content':
          return (
            <div className="text-xs w-[200px] break-words">
              <p>
                {article.content.length > 40
                  ? `${article.content.substring(0, 40)}...`
                  : article.content}
              </p>
            </div>
          );
        case 'commentCount':
          return (
            <div className="w-[50px] break-words">{article.commentCount}</div>
          );
        case 'likeCount':
          return (
            <div className="w-[50px] break-words">{article.likeCount}</div>
          );
        case 'header':
          return (
            <Chip
              className="capitalize w-[100px]"
              color={headerColorMap[article.header]}
              size="sm"
              variant="flat"
            >
              {article.header}
            </Chip>
          );
        case 'username':
          return article.nickname;
        case 'createdAt':
          return (
            <p className="text-bold text-xs capitalize">
              {new Date(article.createdAt).toLocaleString()}
            </p>
          );
        case 'actions':
          return (
            <div className="relative flex items-center gap-2">
              <Tooltip content="게시물 조회">
                <Link href={`/article/${String(article.id)}`}>
                  <div className="text-lg text-default-400 cursor-pointer active:opacity-50">
                    <EyeIcon />
                    <span className="sr-only">게임 조회</span>
                  </div>
                </Link>
              </Tooltip>
              <Tooltip content="게시물 수정">
                <span
                  className="text-lg text-default-400 cursor-pointer active:opacity-50"
                  role="button"
                  tabIndex={0}
                  onKeyPress={() => handleEdit(article)}
                  onClick={() => handleEdit(article)}
                >
                  <span className="sr-only">게시물 수정</span>
                  <EditIcon />
                </span>
              </Tooltip>
              <Tooltip color="danger" content="게시물 삭제">
                <span
                  className="text-lg text-danger cursor-pointer active:opacity-50"
                  role="button"
                  tabIndex={0}
                  onKeyPress={() => {
                    setArticleToDelete(article);
                    setIsDeleteModalOpen(true);
                  }}
                  onClick={() => {
                    setArticleToDelete(article);
                    setIsDeleteModalOpen(true);
                  }}
                >
                  <span className="sr-only">게시물 삭제</span>
                  <DeleteIcon />
                </span>
              </Tooltip>
            </div>
          );
        default:
          return null;
      }
    },
    [handleEdit]
  );

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="m-4">
      <div className="m-4">
        <p className="text-2xl">게시물 관리</p>
      </div>
      {loading ? (
        <div className="flex justify-center items-center h-full">
          <Spinner /> {/* Display spinner while loading */}
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          <Table
            removeWrapper
            aria-label="게시물 리스트"
            className="p-3"
            selectionMode="single"
          >
            <TableHeader columns={columns}>
              {(column) => (
                <TableColumn key={column.uid} align="center">
                  {column.name}
                </TableColumn>
              )}
            </TableHeader>
            <TableBody items={articles}>
              {(item) => (
                <TableRow key={item.id}>
                  {(columnKey) => (
                    <TableCell>{renderCell(item, columnKey)}</TableCell>
                  )}
                </TableRow>
              )}
            </TableBody>
          </Table>
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

      <Modal isOpen={isOpen} onClose={onClose} size="3xl">
        <ModalContent>
          <>
            <ModalHeader className="flex flex-col gap-1">
              게시물 수정
            </ModalHeader>
            <ModalBody className="flex justify-center">
              {selectedArticle && (
                <Table
                  removeWrapper
                  isStriped
                  aria-label="게시물 정보"
                  className="p-3"
                >
                  <TableHeader>
                    <TableColumn align="center">항목</TableColumn>
                    <TableColumn align="center">내용</TableColumn>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell align="right">게시물 ID:</TableCell>
                      <TableCell>{selectedArticle.id}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell align="right">말머리:</TableCell>
                      <TableCell>
                        <input
                          type="text"
                          name="header"
                          value={editedArticle?.header || ''}
                          onChange={handleChange}
                        />
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell align="right">이름:</TableCell>
                      <TableCell>
                        <input
                          type="text"
                          name="name"
                          value={editedArticle?.name || ''}
                          onChange={handleChange}
                        />
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell align="right">내용:</TableCell>
                      <TableCell>
                        <textarea
                          name="content"
                          value={editedArticle?.content || ''}
                          onChange={handleChange}
                        />
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell align="right">이미지 경로:</TableCell>
                      <TableCell>
                        <input
                          type="text"
                          name="imagePath"
                          value={editedArticle?.imagePath || ''}
                          onChange={handleChange}
                        />
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell align="right">앱 ID:</TableCell>
                      <TableCell>
                        <input
                          type="number"
                          name="appId"
                          value={editedArticle?.appId || 0}
                          onChange={handleChange}
                        />
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              )}
            </ModalBody>
            <ModalFooter>
              <Button color="danger" onClick={onClose}>
                취소
              </Button>
              <Button onClick={handleSave}>저장</Button>
            </ModalFooter>
          </>
        </ModalContent>
      </Modal>

      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        size="sm"
      >
        <ModalContent>
          <ModalHeader>게시물 삭제</ModalHeader>
          <ModalBody>정말로 이 게시물을 삭제하시겠습니까?</ModalBody>
          <ModalFooter>
            <Button onClick={() => setIsDeleteModalOpen(false)}>취소</Button>
            <Button color="danger" onClick={handleDelete}>
              삭제
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}
