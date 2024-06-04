import React from 'react';

export function ListboxWrapper({ children }) {
  return (
    <div className="bg-white w-full max-w-[260px] border-small px-1 py-2 rounded-small border-primary h-[160px]">
      {children}
    </div>
  );
}
