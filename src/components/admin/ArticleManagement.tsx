import React from 'react';
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Chip,
  Tooltip,
} from '@nextui-org/react';
import { DeleteIcon } from '../../../public/icon/DeleteIcon';

export default function ArticleManagement() {
  const headerColorMap = {
    FREE_BOARD: 'danger',
    INFORMATION: 'success',
    GUIDE: 'warning',
    REVIEW: 'secondary',
    CHATTING: 'primary',
  };

  const columns = [
    { name: 'id', uid: 'id' },
    { name: '제목', uid: 'title' },
    { name: '댓글 수', uid: 'comments' },
    { name: '말머리', uid: 'header' },
    { name: '작성자', uid: 'author' },
    { name: '작성 일자', uid: 'date' },
    { name: '', uid: 'delete' },
  ];

  const articles = [
    {
      id: 1,
      title: '대머리 독수리 오형제 살인사건',
      comments: 4,
      header: 'REVIEW',
      author: '찬돌',
      date: '2024-06-04 10:22:32',
    },
  ];

  const renderCell = (item, columnKey) => {
    switch (columnKey) {
      case 'id':
        return item.id;
      case 'title':
        return item.title;
      case 'comments':
        return item.comments;
      case 'header':
        return (
          <Chip
            className="capitalize"
            color={headerColorMap[item.header]}
            size="sm"
            variant="flat"
          >
            {item.header}
          </Chip>
        );
      case 'author':
        return item.author;
      case 'date':
        return <span className="text-xs">{item.date}</span>;
      case 'delete':
        return (
          <Tooltip color="danger" content="게시물 삭제">
            <span className="text-lg text-danger cursor-pointer active:opacity-50">
              <DeleteIcon />
            </span>
          </Tooltip>
        );
      default:
        return null;
    }
  };

  return (
    <div className="m-4">
      <div className="m-4">
        <p className="text-2xl">게시물 관리</p>
      </div>
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
      </div>
    </div>
  );
}
