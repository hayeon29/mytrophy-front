import React, { useEffect, useState, useCallback } from 'react';
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
  Spinner,
  Button,
  ModalFooter,
  ModalContent,
  ModalHeader,
  Modal,
  ModalBody,
  useDisclosure,
} from '@nextui-org/react';
import membersAPI from '@/services/members';
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
  { name: '', uid: 'actions' },
];

export default function MemberManagement() {
  const [users, setUsers] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const pageSize = 10;
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [selectedUser, setSelectedUser] = useState(null);
  const [editedUser, setEditedUser] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const response = await membersAPI.getMemberList(
          currentPage - 1,
          pageSize
        );
        setUsers(response.content);
        setTotalPages(response.totalPages);
      } catch (error) {
        // 에러처리
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [currentPage]);

  const handleDelete = async () => {
    try {
      await membersAPI.deleteMemberById(userToDelete.id);
      setUsers(users.filter((user) => user.id !== userToDelete.id));
    } catch (error) {
      // 에러처리
    } finally {
      setIsDeleteModalOpen(false);
    }
  };

  const handleOpenModal = (user) => {
    setSelectedUser(user);
    setEditedUser(user);
    onOpen();
  };

  const handleEditUser = async () => {
    try {
      await membersAPI.updateMemberById(editedUser.id, editedUser);
      onClose();
    } catch (error) {
      // 에러처리
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedUser({ ...editedUser, [name]: value });
  };

  const renderCell = useCallback(
    (user, columnKey) => {
      const cellValue = user[columnKey];

      switch (columnKey) {
        case 'name':
          return (
            <User
              avatarProps={{
                radius: 'lg',
                src: user.imagePath || `/image/eao1.png`,
              }}
              description={user.nickname}
              name={cellValue}
            />
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
              <Tooltip content="회원 조회">
                <span
                  className="text-lg text-default-400 cursor-pointer active:opacity-50"
                  role="button"
                  tabIndex={0}
                  aria-label="회원 조회"
                  onClick={() => handleOpenModal(user)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      handleOpenModal(user);
                    }
                  }}
                >
                  <EyeIcon />
                </span>
              </Tooltip>
              <Tooltip content="회원 수정">
                <span
                  className="text-lg text-default-400 cursor-pointer active:opacity-50"
                  role="button"
                  tabIndex={0}
                  aria-label="회원 수정"
                  onClick={() => handleOpenModal(user)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      handleOpenModal(user);
                    }
                  }}
                >
                  <EditIcon />
                </span>
              </Tooltip>
              <Tooltip color="danger" content="회원 삭제">
                <span
                  className="text-lg text-danger cursor-pointer active:opacity-50"
                  role="button"
                  tabIndex={0}
                  aria-label="회원 삭제"
                  onClick={() => {
                    setUserToDelete(user);
                    setIsDeleteModalOpen(true);
                  }}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      setUserToDelete(user);
                      setIsDeleteModalOpen(true);
                    }
                  }}
                >
                  <DeleteIcon />
                </span>
              </Tooltip>
            </div>
          );
        default:
          return cellValue;
      }
    },
    [handleOpenModal, handleDelete, users]
  );

  return (
    <div className="m-4">
      <div className="m-4">
        <p className="text-2xl">회원 관리</p>
      </div>
      {loading ? (
        <div className="flex justify-center items-center h-full">
          <Spinner />
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
            <TableBody items={users}>
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

      <Modal isOpen={isOpen} onClose={onClose} size="3xl">
        <ModalContent>
          <>
            <ModalHeader className="flex flex-col gap-1">회원 정보</ModalHeader>
            <ModalBody className="flex justify-center">
              {selectedUser && (
                <Table
                  removeWrapper
                  isStriped
                  aria-label="회원 정보"
                  className="p-3"
                >
                  <TableHeader>
                    <TableColumn align="center">항목</TableColumn>
                    <TableColumn align="center">내용</TableColumn>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell align="right">회원 ID:</TableCell>
                      <TableCell>{selectedUser.id}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell align="right">회원 이름:</TableCell>
                      <TableCell>
                        <input
                          type="text"
                          name="name"
                          value={editedUser?.name || ''}
                          onChange={handleChange}
                        />
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell align="right">로그인 ID:</TableCell>
                      <TableCell>
                        <input
                          type="text"
                          name="username"
                          value={editedUser?.username || ''}
                          onChange={handleChange}
                        />
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell align="right">권한:</TableCell>
                      <TableCell>
                        <input
                          type="text"
                          name="role"
                          value={editedUser?.role || ''}
                          onChange={handleChange}
                        />
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell align="right">별명:</TableCell>
                      <TableCell>
                        <input
                          type="text"
                          name="nickname"
                          value={editedUser?.nickname || ''}
                          onChange={handleChange}
                        />
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell align="right">이메일:</TableCell>
                      <TableCell>
                        <input
                          type="text"
                          name="email"
                          value={editedUser?.email || ''}
                          onChange={handleChange}
                        />
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell align="right">스팀 ID:</TableCell>
                      <TableCell>
                        <input
                          type="text"
                          name="steamId"
                          value={editedUser?.steamId || ''}
                          onChange={handleChange}
                        />
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell align="right">로그인 형태:</TableCell>
                      <TableCell>
                        <input
                          type="text"
                          name="loginType"
                          value={editedUser?.loginType || ''}
                          onChange={handleChange}
                        />
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell align="right">프로필 이미지:</TableCell>
                      <TableCell>
                        <input
                          type="text"
                          name="imagePath"
                          value={editedUser?.imagePath || ''}
                          onChange={handleChange}
                        />
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              )}
            </ModalBody>
            <ModalFooter className="flex justify-center">
              <Button variant="ghost" color="danger" onClick={onClose}>
                닫기
              </Button>
              <Button color="primary" onClick={handleEditUser}>
                저장
              </Button>
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
          <ModalHeader>회원 삭제</ModalHeader>
          <ModalBody>정말로 이 회원을 삭제하시겠습니까?</ModalBody>
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
