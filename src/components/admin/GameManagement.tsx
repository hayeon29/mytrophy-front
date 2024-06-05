import React from 'react';
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  Tooltip,
} from '@nextui-org/react';
import { DeleteIcon } from '../../../public/icon/DeleteIcon';

export default function Dashboard() {
  const columns = [
    { name: 'id', uid: 'id' },
    { name: '게임', uid: 'title' },
    { name: '가격', uid: 'price' },
    { name: '추천수', uid: 'recommendation' },
    { name: '발매일', uid: 'releaseDate' },
    { name: '', uid: 'delete' },
  ];

  const articles = [
    {
      id: 1,
      title: '대머리 독수리 오형제 살인사건',
      imagePath: '이미지 주소',
      price: 42000,
      recommendation: 4,
      releaseDate: '2024-06-04 10:22:32',
    },
  ];

  const renderCell = (item, columnKey) => {
    switch (columnKey) {
      case 'id':
        return item.id;
      case 'title':
        return (
          <div>
            <span>{item.imagePath}</span>
            <span>{item.title}</span>
          </div>
        );
      case 'price':
        return item.price;
      case 'recommendation':
        return item.recommendation;
      case 'releaseDate':
        return <span className="text-xs">{item.releaseDate}</span>;
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
        <p className="text-2xl">게임 관리</p>
      </div>
      <div className="flex justify-end m-4">
        <Button className="mx-4" color="success" variant="ghost">
          게임 업데이트
        </Button>
        <Button className="mr-4" color="primary" variant="ghost">
          게임 추가
        </Button>
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
