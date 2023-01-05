import { useState } from "react";
import "./App.css";
import useInterval from "./useInterval";

interface Square {
  active?: boolean;
  color?: string;
}

interface TetrisHook {
  start: () => void;
  speedUp: () => void;
  board: Square[][];
}

const useTetris = (): TetrisHook => {
  const [gameInterval, setGameInterval] = useState(0);
  const [timing, setTiming] = useState<null | number>(null);
  const [board, setBoard] = useState<Square[][]>(
    new Array(20).fill(new Array(10).fill({}))
  );
  const [activePiece, setActivePiece] = useState(false);

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

    const colors = [
      "lightskyblue",
      "yellow",
      "forestgreen",
      "royalblue",
      "darkorange",
      "springgreen",
      "red",
    ];

    const shape = Math.floor(Math.random() * 6);
    // const shape: number = 1;

    const newBlock: Square = {
      active: true,
      color: colors[shape],
    };

    shapes[shape].forEach((x) => {
      newBoard[x[0]][x[1]] = newBlock;
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
            newBoard[i][j] = { ...newBoard[i][j], active: false };
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
        (!board[activeI + 1][j].active && board[activeI + 1][j].color)
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

  return { start, speedUp, board };
};

function App() {
  const { start, speedUp, board } = useTetris();

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
                    className="square"
                    key={"square" + j}
                    style={{
                      backgroundColor: `${
                        square.color ? square.color : "black"
                      }`,
                    }}
                  ></div>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default App;
