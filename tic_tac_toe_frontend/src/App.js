import React, { useState, useEffect } from 'react';
import './App.css';

/*
  Colors (from requirements):
    Accent:   #43a047  (green)
    Primary:  #1976d2  (blue)
    Secondary:#ffffff  (white)
*/

const ACCENT_COLOR = "#43a047";
const PRIMARY_COLOR = "#1976d2";
const SECONDARY_COLOR = "#ffffff";

function getResult(board) {
  // Returns { winner: 'X' | 'O' | null, isDraw: boolean }
  const lines = [
    [0, 1, 2], // Rows
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6], // Cols
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8], // Diags
    [2, 4, 6],
  ];
  for (let [a, b, c] of lines) {
    if (
      board[a] &&
      board[a] === board[b] &&
      board[a] === board[c]
    ) {
      return { winner: board[a], isDraw: false };
    }
  }
  if (board.every(cell => cell)) {
    return { winner: null, isDraw: true };
  }
  return { winner: null, isDraw: false };
}

// PUBLIC_INTERFACE
function App() {
  // X always starts
  const [board, setBoard] = useState(Array(9).fill(null));
  const [isXTurn, setIsXTurn] = useState(true);
  const [gameResult, setGameResult] = useState({ winner: null, isDraw: false });
  const [score, setScore] = useState({ X: 0, O: 0, draws: 0 });

  // Reset game but keep score
  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setIsXTurn(true);
    setGameResult({ winner: null, isDraw: false });
  };

  useEffect(() => {
    const result = getResult(board);
    setGameResult(result);
    // Increment score if win/draw
    if (result.winner) {
      setScore(s => ({ ...s, [result.winner]: s[result.winner] + 1 }));
    } else if (result.isDraw) {
      setScore(s => ({ ...s, draws: s.draws + 1 }));
    }
    // eslint-disable-next-line
  }, [board]);

  // PUBLIC_INTERFACE
  const handleCellClick = idx => {
    if (board[idx] || gameResult.winner || gameResult.isDraw) return;
    const newBoard = board.slice();
    newBoard[idx] = isXTurn ? "X" : "O";
    setBoard(newBoard);
    setIsXTurn(!isXTurn);
  };

  // For accessibility, keyboard support
  const handleCellKeyDown = (e, idx) => {
    if ((e.key === "Enter" || e.key === " ") && !board[idx] && !gameResult.winner && !gameResult.isDraw) {
      handleCellClick(idx);
    }
  };

  // Dynamic styles for colors
  useEffect(() => {
    document.documentElement.style.setProperty('--ttt-accent', ACCENT_COLOR);
    document.documentElement.style.setProperty('--ttt-primary', PRIMARY_COLOR);
    document.documentElement.style.setProperty('--ttt-secondary', SECONDARY_COLOR);
  }, []);

  let statusMessage;
  if (gameResult.winner) {
    statusMessage = (
      <span>
        <strong style={{ color: ACCENT_COLOR }}>
          {gameResult.winner} wins!
        </strong>
      </span>
    );
  } else if (gameResult.isDraw) {
    statusMessage = <span style={{ color: PRIMARY_COLOR }}><strong>It's a draw!</strong></span>;
  } else {
    statusMessage = (
      <span>
        <span style={{ color: isXTurn ? PRIMARY_COLOR : ACCENT_COLOR, fontWeight: 600 }}>
          {isXTurn ? "X" : "O"}
        </span>{" "}
        to move
      </span>
    );
  }

  return (
    <div className="ttt-app-bg">
      <div className="ttt-outer-container">
        <div className="ttt-scoreboard">
          <div className="ttt-score ttt-x-score">
            X&nbsp;<span>{score.X}</span>
          </div>
          <div className="ttt-score ttt-draw-score">
            Draws&nbsp;<span>{score.draws}</span>
          </div>
          <div className="ttt-score ttt-o-score">
            O&nbsp;<span>{score.O}</span>
          </div>
        </div>

        <div className="ttt-status" aria-live="polite">
          {statusMessage}
        </div>

        <div className="ttt-board" role="grid" aria-label="Tic Tac Toe board">
          {board.map((cell, idx) => (
            <button
              aria-label={`Cell ${idx % 3 + 1}, ${Math.floor(idx / 3) + 1}${cell ? ', ' + cell : ''}`}
              key={idx}
              className="ttt-cell"
              onClick={() => handleCellClick(idx)}
              onKeyDown={e => handleCellKeyDown(e, idx)}
              tabIndex={0}
              disabled={Boolean(cell) || Boolean(gameResult.winner) || Boolean(gameResult.isDraw)}
              style={{
                color: cell === "X" ? PRIMARY_COLOR : cell === "O" ? ACCENT_COLOR : "var(--text-primary)"
              }}
              role="gridcell"
            >
              {cell}
            </button>
          ))}
        </div>

        <button className="ttt-reset-btn" onClick={resetGame} aria-label="Reset game">
          Reset
        </button>
      </div>
      <footer className="ttt-footer">
        <span>
          <a
            href="https://reactjs.org/"
            className="ttt-footer-link"
            target="_blank"
            rel="noopener noreferrer"
          >Built with React</a>
        </span>
      </footer>
    </div>
  );
}

export default App;
