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
    const newBlock = {
      active: true,
      color: "red",
    };

    const newBoard = [
      ...board.map((row) => [...row.map((square) => ({ ...square }))]),
    ];
    newBoard[1][3] = newBlock;
    newBoard[1][4] = newBlock;
    newBoard[1][5] = newBlock;
    newBoard[1][6] = newBlock;
    setBoard(newBoard);
    setActivePiece(true);
  };

  const moveDown = () => {
    const newBoard = [
      ...board.map((row) => [...row.map((square) => ({ ...square }))]),
    ];

    // Check if can move down
    if (shouldStop(newBoard)) {
      setActivePiece(false);

      // Set to inactive
      for (let i = newBoard.length - 1; i >= 0; i--) {
        for (let j = 0; j < newBoard[i].length; j++) {
          if (newBoard[i][j].active) {
            newBoard[i][j] = { ...newBoard[i][j], active: false };
          }
        }
      }
      setBoard(newBoard);
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
    let stop = false;
    for (let j = 0; j < board[0].length; j++) {
      let activeI = null;
      // Find lowest active piece in each row
      for (let i = board.length - 1; i >= 0; i--) {
        if (board[i][j].active) {
          activeI = i;
          continue;
        }
      }
      // If piece would move off board or cover an existing piece stop movement
      if (activeI && (activeI + 1 === 20 || board[activeI + 1][j].color)) {
        return true;
      }
    }
    return stop;
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
