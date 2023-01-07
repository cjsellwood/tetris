import { Square } from "./App";

export const findBounds = (board: Square[][]) => {
  let [lowI, highI, lowJ, highJ] = [20, -1, 10, -1];
  let shape = {} as Square;
  for (let i = 0; i < board.length; i++) {
    for (let j = 0; j < board[i].length; j++) {
      if (board[i][j].active) {
        shape = board[i][j];
      }
    }
  }

  // Finds lowest and highest boundaries of the active piece
  for (let i = 0; i < board.length; i++) {
    for (let j = 0; j < board[i].length; j++) {
      if (board[i][j].active) {
        if (i < lowI) {
          lowI = i;
        }
        if (i > highI) {
          highI = i;
        }
        if (j < lowJ) {
          lowJ = j;
        }
        if (j > highJ) {
          highJ = j;
        }
      }
    }
  }

  // Adds extra width to boundary to make square
  switch (shape.name) {
    case "I":
      if (shape.orientation === 0) {
        return [lowI - 1, highI + 2, lowJ, highJ];
      } else if (shape.orientation === 1) {
        return [lowI, highI, lowJ - 2, highJ + 1];
      } else if (shape.orientation === 2) {
        return [lowI - 2, highI + 1, lowJ, highJ];
      } else {
        return [lowI, highI, lowJ - 1, highJ + 2];
      }
    case "O":
      return [lowI, highI, lowJ, highJ];
    default:
      if (shape.orientation === 0) {
        return [lowI, highI + 1, lowJ, highJ];
      } else if (shape.orientation === 1) {
        return [lowI, highI, lowJ - 1, highJ];
      } else if (shape.orientation === 2) {
        return [lowI - 1, highI, lowJ, highJ];
      } else {
        return [lowI, highI, lowJ, highJ + 1];
      }
  }
};

const rotateMatrix = (matrix: Square[][]) => {
  // Rotate piece by transposing matrix and reversing each row
  const rotated = [];
  for (let i = 0; i < matrix.length; i++) {
    const row = [];
    for (let j = 0; j < matrix[i].length; j++) {
      row.push(matrix[j][i]);
    }
    rotated.push(row.reverse());
  }
  return rotated;
};

export const rotate = (board: Square[][]) => {
  const [lowI, highI, lowJ, highJ] = findBounds(board);

  const newBoard: Square[][] = [
    ...board.map((row) => [...row.map((square) => ({ ...square }))]),
  ];

  const width = Math.max(highI - lowI, highJ - lowJ);

  // Create matrix containing square around active piece
  const matrix = [];
  for (let i = lowI; i <= lowI + width; i++) {
    const row = [];
    for (let j = lowJ; j <= lowJ + width; j++) {
      row.push(board[i][j]);
    }
    matrix.push(row);
  }

  const rotatedMatrix = rotateMatrix(matrix);

  // Check if piece would cover another
  for (let i = 0; i < rotatedMatrix.length; i++) {
    for (let j = 0; j < rotatedMatrix[i].length; j++) {
      if (
        rotatedMatrix[i][j].active &&
        !board[i + lowI][j + lowJ].active &&
        board[i + lowI][j + lowJ].name
      ) {
        return;
      }
    }
  }

  // Change orientation of active pieces
  for (let i = 0; i < rotatedMatrix.length; i++) {
    for (let j = 0; j < rotatedMatrix[i].length; j++) {
      if (rotatedMatrix[i][j].active) {
        rotatedMatrix[i][j] = {
          ...rotatedMatrix[i][j],
          orientation: (rotatedMatrix[i][j].orientation! + 1) % 4,
        };
      }
    }
  }

  // Swap matrix into board
  for (let i = 0; i < rotatedMatrix.length; i++) {
    for (let j = 0; j < rotatedMatrix[i].length; j++) {
      newBoard[lowI + i][lowJ + j] = {
        ...rotatedMatrix[i][j],
      };
    }
  }

  return newBoard;
};
