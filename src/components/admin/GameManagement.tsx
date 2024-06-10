import React, { useEffect, useState } from 'react';
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  Image,
  Tooltip,
  Pagination,
  Spinner,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from '@nextui-org/react';
import gameAPI from '@/services/game';
import { DeleteIcon } from '../../../public/icon/DeleteIcon';
import { EyeIcon } from '../../../public/icon/EyeIcon';
import { EditIcon } from '../../../public/icon/EditIcon';

const columns = [
  { name: 'id', uid: 'id' },
  { name: '게임', uid: 'title' },
  { name: '개발사/배급사', uid: 'developer' },
  { name: '가격', uid: 'price' },
  { name: '추천수', uid: 'recommendation' },
  { name: '발매일', uid: 'releaseDate' },
  { name: '', uid: 'actions' },
];

export default function GameManagement() {
  const [games, setGames] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [gameToDelete, setGameToDelete] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const response = await gameAPI.getGameList(currentPage, 10);
        setGames(response.content);
        setTotalPages(response.totalPages);
      } catch (error) {
        console.error('Error fetching game list:', error);
        setGames([]);
        setTotalPages(1);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [currentPage]);

  const handleDelete = async () => {
    try {
      await gameAPI.deleteGameById(gameToDelete.id);
      setGames(games.filter((game) => game.id !== gameToDelete.id));
      setIsDeleteModalOpen(false);
    } catch (error) {
      console.error('Error deleting game:', error);
    }
  };

  const renderCell = (game, columnKey) => {
    switch (columnKey) {
      case 'id':
        return game.id;
      case 'title':
        return (
          <div className="flex items-center gap-2 w-[300px]">
            <Image
              src={game.headerImagePath}
              alt="게임 헤더 이미지"
              width={90}
              height={40}
              radius="md"
            />
            <p className="w-[200px] break-words">{game.name}</p>
          </div>
        );
      case 'developer':
        return (
          <div>
            <p className="text-xs">{game.developer.slice(0, -1)}/</p>
            <p className="text-xs">{game.publisher.slice(0, -1)}</p>
          </div>
        );
      case 'price':
        return game.price;
      case 'recommendation':
        return game.recommendation;
      case 'releaseDate':
        return <span className="text-xs">{game.releaseDate}</span>;
      case 'actions':
        return (
          <div className="relative flex items-center gap-2">
            <Tooltip content="게임 조회">
              <button
                type="button"
                className="text-lg text-default-400 cursor-pointer active:opacity-50"
                onClick={() => {
                  /* Add your click handler function */
                }}
              >
                <EyeIcon />
                <span className="sr-only">게임 조회</span>
              </button>
            </Tooltip>
            <Tooltip content="게임 수정">
              <button
                type="button"
                className="text-lg text-default-400 cursor-pointer active:opacity-50"
                onClick={() => {
                  /* Add your click handler function */
                }}
              >
                <EditIcon />
                <span className="sr-only">게임 수정</span>
              </button>
            </Tooltip>
            <Tooltip color="danger" content="게임 삭제">
              <button
                type="button"
                className="text-lg text-danger cursor-pointer active:opacity-50"
                onClick={() => {
                  setGameToDelete(game);
                  setIsDeleteModalOpen(true);
                }}
              >
                <DeleteIcon />
                <span className="sr-only">게임 삭제</span>
              </button>
            </Tooltip>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="m-4">
      {/* Game Management Header */}
      <div className="m-4">
        <p className="text-2xl">게임 관리</p>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end m-4">
        <Button className="mx-4" color="success" variant="ghost">
          게임 업데이트
        </Button>
        <Button className="mr-4" color="primary" variant="ghost">
          게임 추가
        </Button>
      </div>

      {/* Game Table */}
      {loading ? (
        <div className="flex justify-center items-center h-full">
          <Spinner />
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          <Table
            removeWrapper
            aria-label="게임 리스트"
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
            <TableBody items={games}>
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
              onChange={(page) => setCurrentPage(page)}
            />
          </div>
        </div>
      )}
      {/* Delete Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        size="sm"
      >
        <ModalContent>
          <ModalHeader>게임 삭제</ModalHeader>
          <ModalBody>정말로 이 게임을 삭제하시겠습니까?</ModalBody>
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
