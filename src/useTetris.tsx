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
import shapes from "./shapes";

export interface Square {
  active?: boolean;
  name?: string;
  orientation?: number;
}

interface TetrisHook {
  start: () => void;
  leftControl: () => void;
  rightControl: () => void;
  upControl: () => void;
  downControl: () => void;
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
  const [reset, setReset] = useState(Date.now());

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
  };

  const [usedShapes, setUsedShapes] = useState<string[]>([]);

  const spawnBlock = () => {
    const newBoard = [
      ...board.map((row) => [...row.map((square) => ({ ...square }))]),
    ];

    const names = ["I", "O", "T", "J", "L", "S", "Z"];

    // Shapes are selected randomly from shapes until all have appeared once
    let selectedShape = Math.floor(Math.random() * 7);
    while (usedShapes.includes(names[selectedShape])) {
      selectedShape = Math.floor(Math.random() * 7);
    }
    if (usedShapes.length === 6) {
      setUsedShapes([]);
    } else {
      setUsedShapes([...usedShapes, names[selectedShape]]);
    }

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

  useInterval(gameLoop, timing, reset);

  const start = () => {
    setGameOver(false);
    setLevel(1);
    setTiming(1000);
    setScore(0);
    setLines(0);
    setBoard(new Array(20).fill(new Array(10).fill({})));
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
    setLevel(newLevel);
    if (newLevel <= 8) {
      setTiming(1000 - newLevel * 100);
    } else {
      setTiming(1000 / newLevel);
    }
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

  const leftControl = () => {
    if (blockedLeft(board)) {
      return;
    }
    const newBoard = moveLeft(board);
    setBoard(newBoard);
  };

  const rightControl = () => {
    if (blockedRight(board)) {
      return;
    }
    const newBoard = moveRight(board);
    setBoard(newBoard);
  };

  const upControl = () => {
    const newBoard = rotate(board);
    // Can not rotate
    if (!newBoard) {
      return;
    }
    setBoard(newBoard);
  };

  const downControl = () => {
    if (blockedDown(board)) {
      const newBoard = lockBlock(board, scoreLines);
      setReset(Date.now());
      setBoard(newBoard);
      return;
    }
    const newBoard = moveDown(board);
    setBoard(newBoard);
  };

  // Set keyboard controls
  useEffect(() => {
    const keyClick = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft" || e.key === "a") {
        leftControl();
      }

      if (e.key === "ArrowRight" || e.key === "d") {
        rightControl();
      }

      if (e.key === "ArrowUp" || e.key === "w") {
        upControl();
      }
      
      if (e.key === "ArrowDown" || e.key === "s") {
        downControl();
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

  return {
    start,
    leftControl,
    rightControl,
    upControl,
    downControl,
    board,
    gameOver,
    level,
    lines,
    score,
    highScores,
  };
};

export default useTetris;
