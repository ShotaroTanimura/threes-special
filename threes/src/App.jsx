// App.js
import React, { useState, useEffect } from 'react';
import './App.css';
import { FaRegCircle } from "react-icons/fa";
import { VscChromeClose } from "react-icons/vsc";
// 各セルのコンポーネント
function Square({ value, onClick }) {
  const renderMark = () => {
    if (value === 'O') return <FaRegCircle />;
    if (value === 'X') return <VscChromeClose />;
    return null;
  };

  return (
    <button className="square" onClick={onClick}>
      {renderMark()}
    </button>
  );
}


// 盤面全体を描画するコンポーネント（3×3のグリッド）
function Board({ squares, onClick }) {
  return (
    <div className="board-grid">
      {squares.map((sq, i) => (
        <Square
          key={i}
          value={sq ? sq.player : null}
          onClick={() => onClick(i)}
        />
      ))}
    </div>
  );
}

// ゲームの状態管理および特殊ルールの実装
function Game({ onGameOver }) {
  const [squares, setSquares] = useState(Array(9).fill(null));
  const [moveCount, setMoveCount] = useState(1);
  const [xIsNext, setXIsNext] = useState(true);
  const [gameOver, setGameOver] = useState(false);

  const handleClick = (i) => {
    if (squares[i] || gameOver) return;
    const currentPlayer = xIsNext ? 'O' : 'X';
    const newSquares = squares.slice();
    newSquares[i] = { player: currentPlayer, order: moveCount };
    setMoveCount(moveCount + 1);

    // 特殊ルール：相手の印が3個の場合、最も古い印を削除
    const opponent = currentPlayer === 'O' ? 'X' : 'O';
    const opponentMarks = newSquares
      .map((sq, index) => (sq && sq.player === opponent ? { ...sq, index } : null))
      .filter((sq) => sq !== null);

    if (opponentMarks.length === 3) {
      const oldest = opponentMarks.reduce((prev, curr) =>
        prev.order < curr.order ? prev : curr
      );
      newSquares[oldest.index] = null;
      setXIsNext(opponent === 'O');
    } else {
      setXIsNext(!xIsNext);
    }

    setSquares(newSquares);
  };

  useEffect(() => {
    const winner = calculateWinner(squares);
    if (winner && !gameOver) {
      setGameOver(true);
      setTimeout(() => {
        alert("勝者: " + winner);
        onGameOver();
      }, 100);
    }
  }, [squares, gameOver, onGameOver]);

  const status = calculateWinner(squares)
    ? '勝者: ' + calculateWinner(squares)
    : '次のプレイヤー: ' + (xIsNext ? 'O' : 'X');

  return (
    <div className="game">
      <Board squares={squares} onClick={handleClick} />
      <div className="game-info">{status}</div>
    </div>
  );
}

// 勝利条件の判定関数
function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (
      squares[a] &&
      squares[b] &&
      squares[c] &&
      squares[a].player === squares[b].player &&
      squares[a].player === squares[c].player
    ) {
      return squares[a].player;
    }
  }
  return null;
}

// アプリ全体を管理するコンポーネント
function App() {
  const [gameStarted, setGameStarted] = useState(false);

  const startGame = () => {
    setGameStarted(true);
  };

  const handleGameOver = () => {
    setGameStarted(false);
  };

  return (
    <div className="app">
      {gameStarted ? (
        <Game onGameOver={handleGameOver} />
      ) : (
        <button onClick={startGame}>Start Game</button>
      )}
    </div>
  );
}

export default App;
