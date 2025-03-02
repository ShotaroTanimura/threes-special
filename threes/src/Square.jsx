import React from 'react';
import { GiCat, GiDog } from 'react-icons/gi'; // react-icons を使用

function Square({ value, onClick }) {
  const renderMark = () => {
    if (value === 'X') return <GiCat />;
    if (value === 'O') return <GiDog />;
    return null;
  };

  return (
    <button className="square" onClick={onClick}>
      {renderMark()}
    </button>
  );
}

export default Square;
