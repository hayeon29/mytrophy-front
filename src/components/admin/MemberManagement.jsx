import React from 'react';
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  User,
  Chip,
  Tooltip,
} from '@nextui-org/react';
import { EditIcon } from '../../../public/icon/EditIcon';
import { DeleteIcon } from '../../../public/icon/DeleteIcon';
import { EyeIcon } from '../../../public/icon/EyeIcon';

const statusColorMap = {
  mytrophy: 'danger',
  naver: 'success',
  google: 'warning',
  steam: 'primary',
};

const columns = [
  { name: '이름', uid: 'name' },
  { name: 'ID/Email', uid: 'id' },
  { name: '로그인 타입', uid: 'loginType' },
  { name: '스팀 연동', uid: 'steamId' },
  { name: '가입 날짜', uid: 'created_at' },
  { name: '회원 관리', uid: 'actions' },
];

const users = [
  {
    id: 1,
    avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026024d', // image_path
    name: '김찬혁',
    nickname: '찬돌',
    username: 'chandol',
    email: 'chandol@gmail.com',
    loginType: 'mytrophy',
    steamId: '', // 없으면 null
    created_at: '2024-06-04 10:22:32.010524',
  },
  {
    id: 1,
    avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026024d', // image_path
    name: '김찬혁',
    nickname: '찬돌',
    username: 'chandol',
    email: 'chandol@gmail.com',
    loginType: 'naver',
    steamId: '1231423', // 없으면 null
    created_at: '2024-06-04 10:22:32.010524',
  },
  {
    id: 1,
    avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026024d', // image_path
    name: '김찬혁',
    nickname: '찬돌',
    username: 'chandol',
    email: 'chandol@gmail.com',
    loginType: 'steam',
    steamId: '1231423', // 없으면 null
    created_at: '2024-06-04 10:22:32.010524',
  },
];

export default function Dashboard() {
  const renderCell = React.useCallback((user, columnKey) => {
    const cellValue = user[columnKey];

    switch (columnKey) {
      case 'name':
        return (
          <User
            avatarProps={{ radius: 'lg', src: user.avatar }}
            description={user.email}
            name={cellValue}
          >
            {user.nickname}
          </User>
        );
      case 'id':
        return (
          <div className="flex flex-col">
            <p className="text-bold text-sm">{user.username}</p>
            <p className="text-bold text-sm text-default-600">{user.email}</p>
          </div>
        );
      case 'loginType':
        return (
          <Chip
            className="capitalize"
            color={statusColorMap[user.loginType]}
            size="sm"
            variant="flat"
          >
            {cellValue}
          </Chip>
        );
      case 'steamId':
        return <p className="text-bold text-sm capitalize">{user.steamId}</p>;
      case 'created_at':
        return (
          <p className="text-bold text-xs capitalize">{user.created_at}</p>
        );
      case 'actions':
        return (
          <div className="relative flex items-center gap-2">
            <Tooltip content="Details">
              <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
                <EyeIcon />
              </span>
            </Tooltip>
            <Tooltip content="Edit user">
              <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
                <EditIcon />
              </span>
            </Tooltip>
            <Tooltip color="danger" content="Delete user">
              <span className="text-lg text-danger cursor-pointer active:opacity-50">
                <DeleteIcon />
              </span>
            </Tooltip>
          </div>
        );
      default:
        return cellValue;
    }
  }, []);

  return (
    <div className="m-4">
      <div className="m-4">
        <p className="text-2xl">회원 관리</p>
      </div>
      <Table removeWrapper aria-label="회원 리스트" className="p-3">
        <TableHeader columns={columns}>
          {(column) => (
            <TableColumn key={column.uid} align="center">
              {column.name}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody items={users}>
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
  );
}
