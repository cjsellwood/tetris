import { useEffect, useState } from "react";
import "./App.css";
import useInterval from "./useInterval";
import { rotate } from "./rotate";

export interface Square {
  active?: boolean;
  name?: string;
  orientation?: number;
}

interface TetrisHook {
  start: () => void;
  speedUp: () => void;
  board: Square[][];
  gameOver: boolean;
}

const useTetris = (): TetrisHook => {
  const [timing, setTiming] = useState<null | number>(null);
  const [board, setBoard] = useState<Square[][]>(
    new Array(20).fill(new Array(10).fill({}))
  );
  const [activePiece, setActivePiece] = useState(false);
  const [gameOver, setGameOver] = useState(false);

  const gameLoop = () => {
    if (!activePiece) {
      spawnBlock();
    } else {
      moveDown();
    }
  };

  const spawnBlock = () => {
    const newBoard = [
      ...board.map((row) => [...row.map((square) => ({ ...square }))]),
    ];

    const shapes = [
      [
        [1, 3],
        [1, 4],
        [1, 5],
        [1, 6],
      ],
      [
        [0, 4],
        [0, 5],
        [1, 4],
        [1, 5],
      ],
      [
        [0, 4],
        [1, 3],
        [1, 4],
        [1, 5],
      ],
      [
        [0, 3],
        [1, 3],
        [1, 4],
        [1, 5],
      ],
      [
        [0, 5],
        [1, 3],
        [1, 4],
        [1, 5],
      ],

      [
        [0, 4],
        [0, 5],
        [1, 3],
        [1, 4],
      ],

      [
        [0, 3],
        [0, 4],
        [1, 4],
        [1, 5],
      ],
    ];

    const names = ["I", "O", "T", "J", "L", "S", "Z"];

    const selectedShape = Math.floor(Math.random() * 7);

    // Game is over if shape would cover another shape
    if (shapes[selectedShape].some((x) => newBoard[x[0]][x[1]].name)) {
      setTiming(null);
      setGameOver(true);
      return;
    }

    const newBlock: Square = {
      active: true,
      name: names[selectedShape],
      orientation: 0,
    };

    shapes[selectedShape].forEach((x) => {
      newBoard[x[0]][x[1]] = { ...newBlock };
    });

    setBoard(newBoard);
    setActivePiece(true);
  };

  const moveDown = () => {
    const newBoard = [
      ...board.map((row) => [...row.map((square) => ({ ...square }))]),
    ];

    // Check if can move down
    if (shouldStop(newBoard)) {
      // Set to inactive
      for (let i = 0; i < newBoard.length; i++) {
        for (let j = 0; j < newBoard[i].length; j++) {
          if (newBoard[i][j].active) {
            newBoard[i][j] = { name: newBoard[i][j].name, active: false };
          }
        }
      }
      setBoard(newBoard);
      setActivePiece(false);
      return;
    }

    // Move piece down
    for (let i = newBoard.length - 1; i >= 0; i--) {
      for (let j = 0; j < newBoard[i].length; j++) {
        if (newBoard[i][j].active) {
          newBoard[i + 1][j] = newBoard[i][j];
          newBoard[i][j] = {};
        }
      }
    }
    setBoard(newBoard);
  };

  const shouldStop = (board: Square[][]) => {
    for (let j = 0; j < board[0].length; j++) {
      let activeI = -1;
      // Find lowest active piece in each row
      for (let i = board.length - 1; i >= 0; i--) {
        if (board[i][j].active) {
          activeI = i;
          break;
        }
      }
      // If no active piece in column continue
      if (activeI === -1) {
        continue;
      }

      // If piece would move off board or cover an existing piece stop movement
      if (
        activeI === 19 ||
        (!board[activeI + 1][j].active && board[activeI + 1][j].name)
      ) {
        return true;
      }
    }
    return false;
  };

  useInterval(gameLoop, timing);
  const start = () => {
    setTiming(500);
  };

  const speedUp = () => {
    setTiming((timing) => (timing || 500) - 100);
  };

  useEffect(() => {
    const keyClick = (e: KeyboardEvent) => {
      console.log(e);

      if (e.key === "ArrowLeft" || e.key === "a") {
        moveLeft();
      }

      if (e.key === "ArrowRight" || e.key === "d") {
        moveRight();
      }

      if (e.key === "ArrowDown" || e.key === "s") {
        moveDown();
      }

      if (e.key === "ArrowUp" || e.key === "w") {
        rotatePiece();
      }
    };

    document.addEventListener("keydown", keyClick);

    return () => {
      document.removeEventListener("keydown", keyClick);
    };
  }, [board]);

  const moveLeft = () => {
    // Don't move if hitting wall all another piece
    if (stopLeft(board)) {
      return;
    }
    const newBoard = [
      ...board.map((row) => [...row.map((square) => ({ ...square }))]),
    ];

    for (let i = 0; i < newBoard.length; i++) {
      for (let j = 0; j < newBoard[i].length; j++) {
        if (newBoard[i][j].active) {
          newBoard[i][j - 1] = newBoard[i][j];
          newBoard[i][j] = {};
        }
      }
    }
    setBoard(newBoard);
  };

  const stopLeft = (board: Square[][]) => {
    for (let i = 0; i < board.length; i++) {
      let activeJ = -1;
      // Find leftmost active piece in each row
      for (let j = 0; j < board[i].length; j++) {
        if (board[i][j].active) {
          activeJ = j;
          break;
        }
      }
      // If no active piece in row continue
      if (activeJ === -1) {
        continue;
      }

      // If piece would move off board or cover an existing piece stop movement
      if (
        activeJ === 0 ||
        (!board[i][activeJ - 1].active && board[i][activeJ - 1].name)
      ) {
        return true;
      }
    }
    return false;
  };

  const moveRight = () => {
    // Don't move if hitting wall all another piece
    if (stopRight(board)) {
      return;
    }

    const newBoard = [
      ...board.map((row) => [...row.map((square) => ({ ...square }))]),
    ];

    for (let i = 0; i < newBoard.length; i++) {
      for (let j = newBoard[i].length - 1; j >= 0; j--) {
        if (newBoard[i][j].active) {
          newBoard[i][j + 1] = newBoard[i][j];
          newBoard[i][j] = {};
        }
      }
    }
    setBoard(newBoard);
  };

  const stopRight = (board: Square[][]) => {
    for (let i = 0; i < board.length; i++) {
      let activeJ = -1;
      // Find leftmost active piece in each row
      for (let j = board[i].length - 1; j >= 0; j--) {
        if (board[i][j].active) {
          activeJ = j;
          break;
        }
      }
      // If no active piece in row continue
      if (activeJ === -1) {
        continue;
      }

      // If piece would move off board or cover an existing piece stop movement
      if (
        activeJ === 9 ||
        (!board[i][activeJ + 1].active && board[i][activeJ + 1].name)
      ) {
        return true;
      }
    }
    return false;
  };

  const rotatePiece = () => {
    const newBoard = rotate(board);
    // Can not rotate
    if (!newBoard) {
      return;
    }
    setBoard(newBoard);
  };

  return { start, speedUp, board, gameOver };
};

function App() {
  const { start, speedUp, board, gameOver } = useTetris();

  return (
    <div className="App">
      <button onClick={() => start()}>Start</button>
      <button onClick={() => speedUp()}>Speed Up</button>
      <div className="board">
        {board.map((row, i) => {
          return (
            <div className="row" key={"row" + i}>
              {row.map((square, j) => {
                return (
                  <div
                    className={`square ${square.name}`}
                    key={"square" + j}
                  ></div>
                );
              })}
            </div>
          );
        })}
      </div>
      {gameOver && <h1>GAME OVER</h1>}
    </div>
  );
}

export default App;
