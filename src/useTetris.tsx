import { useEffect, useState } from "react";
import useInterval from "./useInterval";
import { rotate } from "./rotate";
import {
  blockedDown,
  blockedLeft,
  blockedRight,
  lockBlock,
  moveDown,
  moveLeft,
  moveRight,
} from "./movement";

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
  level: number;
  lines: number;
  score: number;
  highScore: number;
}

const useTetris = (): TetrisHook => {
  const [timing, setTiming] = useState<null | number>(null);
  const [board, setBoard] = useState<Square[][]>(
    new Array(20).fill(new Array(10).fill({}))
  );
  const [activePiece, setActivePiece] = useState(false);
  const [gameOver, setGameOver] = useState(true);
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [lines, setLines] = useState(0);
  const [highScore, setHighScore] = useState(0);

  const gameLoop = () => {
    if (!activePiece) {
      spawnBlock();
    } else if (blockedDown(board)) {
      const newBoard = lockBlock(board);
      setActivePiece(false);
      setBoard(newBoard);
    } else {
      const newBoard = moveDown(board);
      setBoard(newBoard);
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

  useInterval(gameLoop, timing);
  const start = () => {
    setTiming(500);
    setGameOver(false);
  };

  const speedUp = () => {
    setTiming((timing) => (timing || 500) - 100);
  };

  useEffect(() => {
    const keyClick = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft" || e.key === "a") {
        if (blockedLeft(board)) {
          return;
        }
        const newBoard = moveLeft(board);
        setBoard(newBoard);
      }

      if (e.key === "ArrowRight" || e.key === "d") {
        if (blockedRight(board)) {
          return;
        }
        const newBoard = moveRight(board);
        setBoard(newBoard);
      }

      if (e.key === "ArrowDown" || e.key === "s") {
        if (blockedDown(board)) {
          return;
        }
        const newBoard = moveDown(board);
        setBoard(newBoard);
      }

      if (e.key === "ArrowUp" || e.key === "w") {
        const newBoard = rotate(board);
        // Can not rotate
        if (!newBoard) {
          return;
        }
        setBoard(newBoard);
      }
    };

    document.addEventListener("keydown", keyClick);

    return () => {
      document.removeEventListener("keydown", keyClick);
    };
  }, [board]);

  return { start, speedUp, board, gameOver, level, lines, score, highScore };
};

export default useTetris;
