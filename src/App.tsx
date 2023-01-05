import { useState } from "react";
import "./App.css";

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
  let [gameInterval, setGameInterval] = useState(0);
  let [timing, setTiming] = useState(1000);
  let [board, setBoard] = useState<Square[][]>(
    new Array(20).fill(new Array(10).fill({}))
  );

  const start = () => {
    const newInterval = setInterval(gameLoop, timing);
    setGameInterval(newInterval);
  };

  const speedUp = () => {
    clearInterval(gameInterval);
    const newTiming = timing - 10;
    setTiming(newTiming);

    const newInterval = setInterval(gameLoop, newTiming);
    setGameInterval(newInterval);
  };

  const gameLoop = () => {};

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
                return <div className="square"></div>;
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default App;
