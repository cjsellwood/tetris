import { useEffect, useRef, useState } from "react";
import "./App.css";

const useInterval = (callback: Function, delay: number | null) => {
  const savedCallback = useRef<undefined | Function>();

  // Remember the latest callback.
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the interval.
  useEffect(() => {
    function tick() {
      if (!savedCallback.current) {
        return;
      }
      savedCallback.current();
    }
    if (delay !== null) {
      let id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
};

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

    const newBoard = [...board.map((row) => [...row])];
    newBoard[1][3] = newBlock;
    newBoard[1][4] = newBlock;
    newBoard[1][5] = newBlock;
    newBoard[1][6] = newBlock;
    setBoard(newBoard);
    setActivePiece(true);
  };

  const moveDown = () => {
    const newBoard = [...board.map((row) => [...row])];
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

  useInterval(gameLoop, timing);
  const start = () => {
    setTiming(1000);
  };

  const speedUp = () => {
    setTiming((timing) => (timing || 1000) - 100);
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
        {board.map((row) => {
          return (
            <div className="row">
              {row.map((square) => {
                return (
                  <div
                    className="square"
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
