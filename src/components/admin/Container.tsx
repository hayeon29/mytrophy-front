import React from 'react';

function Container({ children }) {
  return (
    <div
      style={{
        display: 'flex',
        width: '1280px',
        margin: '0 auto',
        padding: '24px',
      }}
    >
      {children}
    </div>
  );
}

export default Container;
