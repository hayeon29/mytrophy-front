'use client';

import React, { useState } from 'react';
import { Listbox, ListboxItem } from '@nextui-org/react';
// eslint-disable-next-line import/extensions
import { ListboxWrapper } from '@/components/admin/ListboxWrapper';
import Container from '@/components/admin/Container';
import Dashboard from '@/components/admin/Dashboard';
import MemberManagement from '@/components/admin/MemberManagement';
import GameManagement from '@/components/admin/GameManagement';

export default function Admin() {
  const [selectedItem, setSelectedItem] = useState(null);

  const handleItemClick = (itemKey) => {
    setSelectedItem(itemKey);
  };

  const [selectedKeys, setSelectedKeys] = React.useState(new Set(['text']));

  const renderContent = () => {
    switch (selectedItem) {
      case 'dashboard':
        return <Dashboard />;
      case 'member-management':
        return <MemberManagement />;
      case 'game-management':
        return <GameManagement />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="bg-white h-screen mx-auto">
      <div style={{ display: 'flex', padding: '20px' }}>
        <Container>
          <ListboxWrapper>
            <Listbox
              aria-label="Single selection example"
              variant="flat"
              disallowEmptySelection
              selectionMode="single"
              selectedKeys={selectedKeys}
              onSelectionChange={setSelectedKeys}
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
                key="game-management"
                onClick={() => handleItemClick('game-management')}
              >
                게임 관리
              </ListboxItem>
            </Listbox>
          </ListboxWrapper>
          <div className="w-full border-small ml-4 px-1 py-2 rounded-small border-primary">
            {renderContent()}
          </div>
        </Container>
      </div>
    </div>
  );
}
