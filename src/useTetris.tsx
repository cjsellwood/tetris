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
  highScores: number[];
}

const useTetris = (): TetrisHook => {
  const [timing, setTiming] = useState<null | number>(null);
  const [board, setBoard] = useState<Square[][]>(
    new Array(20).fill(new Array(10).fill({}))
  );
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [lines, setLines] = useState(0);
  const [highScores, setHighScores] = useState([0, 0, 0, 0, 0]);

  const gameLoop = () => {
    if (!isActive()) {
      spawnBlock();
    } else if (blockedDown(board)) {
      const newBoard = lockBlock(board, scoreLines);
      setBoard(newBoard);
    } else {
      const newBoard = moveDown(board);
      setBoard(newBoard);
    }
  };

  const isActive = () => {
    for (let i = 0; i < board.length; i++) {
      for (let j = 0; j < board[j].length; j++) {
        if (board[i][j].active) {
          return true;
        }
      }
    }
    return false;
  }

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
      saveScores();
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
  };

  useInterval(gameLoop, timing);

  const start = () => {
    setGameOver(false);
  };

  const speedUp = () => {
    setTiming((timing) => (timing || 1000) - 100);
  };

  const scoreLines = (clearedLines: number) => {
    const newLevel = 1 + Math.floor((lines + clearedLines) / 10);
    const lineScores: { [n: number]: number } = {
      1: 40,
      2: 100,
      3: 300,
      4: 1200,
    };

    setLines((l) => l + clearedLines);
    setScore((s) => s + lineScores[clearedLines] * level);
    setLevel((l) => newLevel);
  };

  // Set and save high scores
  const saveScores = () => {
    const allScores = [...highScores, score];
    allScores.sort((a, b) => {
      if (a < b) {
        return 1;
      } else {
        return -1;
      }
    });
    setHighScores(allScores.slice(0, 5));
    localStorage.setItem("high", JSON.stringify(allScores.slice(0, 5)));
  };

  // Load stored high scores
  useEffect(() => {
    const storedScores = localStorage.getItem("high");
    if (!storedScores) {
      return;
    }
    setHighScores(JSON.parse(storedScores) as number[]);
  }, []);

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
          const newBoard = lockBlock(board, scoreLines);
          setBoard(newBoard)
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

  // Start game on initial load
  useEffect(() => {
    setTiming(1000);
  }, []);

  return { start, speedUp, board, gameOver, level, lines, score, highScores };
};

export default useTetris;
