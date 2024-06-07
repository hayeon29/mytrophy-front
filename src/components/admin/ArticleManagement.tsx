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
  Pagination,
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
    { name: '내용', uid: 'content' },
    { name: '댓글 수', uid: 'commentCount' },
    { name: '말머리', uid: 'header' },
    { name: '작성자', uid: 'member_id' },
    { name: '작성 일자', uid: 'createdAt' },
    { name: '', uid: 'delete' },
  ];

  const articles = [
    {
      id: 1,
      content: '대머리 독수리 오형제 살인사건',
      commentCount: 4,
      header: 'REVIEW',
      member_id: '찬돌',
      createdAt: '2024-06-04 10:22:32',
    },
  ];

  const renderCell = (item, columnKey) => {
    switch (columnKey) {
      case 'id':
        return item.id;
      case 'content':
        return item.content;
      case 'commentCount':
        return item.commentCount;
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
      case 'member_id':
        return item.member_id;
      case 'createdAt':
        return <span className="text-xs">{item.createdAt}</span>;
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
        <div className="flex justify-center mt-4">
          <Pagination total={10} initialPage={1} />
        </div>
      </div>
    </div>
  );
}
