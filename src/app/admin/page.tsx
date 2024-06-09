'use client';

import React, { useState } from 'react';
import { Listbox, ListboxItem, Selection } from '@nextui-org/react';
import { ListboxWrapper } from '@/components/admin/ListboxWrapper';
import Container from '@/components/admin/Container';
import Dashboard from '@/components/admin/Dashboard';
import MemberManagement from '@/components/admin/MemberManagement';
import ArticleManagement from '@/components/admin/ArticleManagement';
import GameManagement from '@/components/admin/GameManagement';

export default function Admin() {
  const [selectedItem, setSelectedItem] = useState<string | null>(null);

  const handleItemClick = (itemKey: string) => {
    setSelectedItem(itemKey);
  };

  const [selectedKeys, setSelectedKeys] = useState<Set<string>>(
    new Set(['text'])
  );

  const handleSelectionChange = (keys: Selection) => {
    if (keys instanceof Set) {
      setSelectedKeys(keys as Set<string>);
    } else {
      setSelectedKeys(new Set([keys as string]));
    }
  };

  const renderContent = () => {
    switch (selectedItem) {
      case 'dashboard':
        return <Dashboard />;
      case 'member-management':
        return <MemberManagement />;
      case 'article-management':
        return <ArticleManagement />;
      case 'game-management':
        return <GameManagement />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="bg-gray h-screen mx-auto">
      <div style={{ display: 'flex', padding: '20px' }}>
        <Container>
          <ListboxWrapper>
            <Listbox
              aria-label="Single selection example"
              variant="flat"
              disallowEmptySelection
              selectionMode="single"
              selectedKeys={selectedKeys}
              onSelectionChange={handleSelectionChange}
            >
              <ListboxItem
                key="dashboard"
                onClick={() => handleItemClick('dashboard')}
              >
                대시보드
              </ListboxItem>
              <ListboxItem
                key="member-management"
                onClick={() => handleItemClick('member-management')}
              >
                회원 관리
              </ListboxItem>
              <ListboxItem
                key="article-management"
                onClick={() => handleItemClick('article-management')}
              >
                게시물 관리
              </ListboxItem>
              <ListboxItem
                key="game-management"
                onClick={() => handleItemClick('game-management')}
              >
                게임 관리
              </ListboxItem>
            </Listbox>
          </ListboxWrapper>
          <div className="bg-white w-full border-small ml-4 px-1 py-2 rounded-small border-primary">
            {renderContent()}
          </div>
        </Container>
      </div>
    </div>
  );
}
