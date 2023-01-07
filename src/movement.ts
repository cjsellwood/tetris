import { Square } from "./useTetris";

export const moveDown = (board: Square[][]) => {
  const newBoard = [
    ...board.map((row) => [...row.map((square) => ({ ...square }))]),
  ];

  // Move piece down
  for (let i = newBoard.length - 1; i >= 0; i--) {
    for (let j = 0; j < newBoard[i].length; j++) {
      if (newBoard[i][j].active) {
        newBoard[i + 1][j] = newBoard[i][j];
        newBoard[i][j] = {};
      }
    }
  }
  return newBoard;
};

const clearRows = (board: Square[][]) => {
  const clearedBoard = [];

  // Add to new board only if has a clear space in a row
  for (let i = 0; i < board.length; i++) {
    if (!board[i].every((square) => square.name !== undefined)) {
      clearedBoard.push(board[i]);
    }
  }

  // Add extra rows to top to replace cleared rows
  for (let i = 0; i < 20 - clearedBoard.length; i++) {
    clearedBoard.unshift(new Array(10).fill({}));
  }
  return clearedBoard;
};

export const lockBlock = (board: Square[][]) => {
  const newBoard = [
    ...board.map((row) => [...row.map((square) => ({ ...square }))]),
  ];

  // Set to inactive
  for (let i = 0; i < newBoard.length; i++) {
    for (let j = 0; j < newBoard[i].length; j++) {
      if (newBoard[i][j].active) {
        newBoard[i][j] = { name: newBoard[i][j].name, active: false };
      }
    }
  }

  const clearedBoard = clearRows(newBoard);

  return clearedBoard
};

export const blockedDown = (board: Square[][]) => {
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

export const moveLeft = (board: Square[][]) => {
  // Don't move if hitting wall all another piece

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
  return newBoard;
};

export const blockedLeft = (board: Square[][]) => {
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

export const moveRight = (board: Square[][]) => {
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
  return newBoard;
};

export const blockedRight = (board: Square[][]) => {
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
