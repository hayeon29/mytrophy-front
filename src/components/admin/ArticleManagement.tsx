import React, { useState, useEffect } from 'react';
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
} from '@nextui-org/react';
import adminAPI from '@/services/admin';
import { DeleteIcon } from '../../../public/icon/DeleteIcon';
import { EyeIcon } from '../../../public/icon/EyeIcon';
import { EditIcon } from '../../../public/icon/EditIcon';

export default function ArticleManagement() {
  const [articles, setArticles] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);

  const headerColorMap = {
    FREE_BOARD: 'default',
    INFORMATION: 'success',
    GUIDE: 'warning',
    REVIEW: 'danger',
    CHATTING: 'primary',
  };

  const columns = [
    { name: 'id', uid: 'id' },
    { name: '말머리', uid: 'header' },
    { name: '내용', uid: 'content' },
    { name: '댓글 수', uid: 'commentCount' },
    { name: '추천 수', uid: 'commentCount' },
    { name: '작성자', uid: 'username' },
    { name: '작성 일자', uid: 'createdAt' },
    { name: '', uid: 'actions' },
  ];

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        setLoading(true);
        const response = await adminAPI.getArticleList(currentPage - 1, 10);
        setArticles(response.content);
        setTotalPages(response.totalPages);
      } catch (error) {
        console.error('Error fetching articles:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, [currentPage]);

  const renderCell = (article, columnKey) => {
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
              <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
                <EyeIcon />
              </span>
            </Tooltip>
            <Tooltip content="게시물 수정">
              <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
                <EditIcon />
              </span>
            </Tooltip>
            <Tooltip color="danger" content="게시물 삭제">
              <span className="text-lg text-danger cursor-pointer active:opacity-50">
                <DeleteIcon />
              </span>
            </Tooltip>
          </div>
        );
      default:
        return null;
    }
  };

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
    </div>
  );
}
