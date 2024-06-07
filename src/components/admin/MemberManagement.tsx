import React, { useEffect, useState } from 'react';
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
  Pagination,
  Spinner, // Import the Spinner component
} from '@nextui-org/react';
import adminAPI from '@/services/admin';
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
  { name: '가입 날짜', uid: 'createdAt' },
  { name: '회원 관리', uid: 'actions' },
];

export default function Dashboard() {
  const [users, setUsers] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true); // State to manage loading

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true); // Set loading to true before fetching data
        const response = await adminAPI.getMemberList();
        setUsers(response); // 응답 데이터를 상태로 설정
        // 페이지 네이션 처리 (예: totalPages 계산)
        setTotalPages(Math.ceil(response.length / 10)); // 예시로 페이지당 10개 항목
      } catch (error) {
        console.error('Error fetching member list:', error);
      } finally {
        setLoading(false); // Set loading to false after data is fetched
      }
    }
    fetchData();
  }, [currentPage]);

  const renderCell = React.useCallback((user, columnKey) => {
    const cellValue = user[columnKey];

    switch (columnKey) {
      case 'name':
        return (
          <User
            avatarProps={{
              radius: 'lg',
              src:
                user.imagePath ||
                `${process.env.NEXT_PUBLIC_FRONT_URL}/image/eao1.png`,
            }}
            description={user.nickname}
            name={cellValue}
          >
            {user.name}
          </User>
        );
      case 'id':
        return (
          <div className="flex flex-col">
            <p className="text-bold text-sm w-[200px] break-words">
              {user.username}
            </p>
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
        return (
          <p className="text-bold text-sm capitalize">
            {user.steamId || '연동 안됨'}
          </p>
        );
      case 'createdAt':
        return (
          <p className="text-bold text-xs capitalize">
            {new Date(user.createdAt).toLocaleString()}
          </p>
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
      {loading ? (
        <div className="flex justify-center items-center h-full">
          <Spinner /> {/* Display spinner while loading */}
        </div>
      ) : (
        <>
          <Table removeWrapper aria-label="회원 리스트" className="p-3">
            <TableHeader columns={columns}>
              {(column) => (
                <TableColumn key={column.uid} align="center">
                  {column.name}
                </TableColumn>
              )}
            </TableHeader>
            <TableBody
              items={users.slice((currentPage - 1) * 10, currentPage * 10)}
            >
              {(item) => (
                <TableRow key={item.username}>
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
              onChange={setCurrentPage}
            />
          </div>
        </>
      )}
    </div>
  );
}
