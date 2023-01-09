import { blockedDown, moveDown } from "./movement";
import { duplicateBoard, Square } from "./useTetris";

const addPreview = (board: Square[][]) => {
  // Remove previous preview
  for (let i = 0; i < board.length; i++) {
    for (let j = 0; j < board[i].length; j++) {
      if (board[i][j].preview) {
        board[i][j] = {};
      }
    }
  }

  let newBoard = duplicateBoard(board);

  let i = 0;
  while (!blockedDown(newBoard)) {
    newBoard = moveDown(newBoard);

    i++;
    // Stop infinite loop
    if (i > 19) {
      break;
    }
  }

  for (let i = 0; i < board.length; i++) {
    for (let j = 0; j < board[i].length; j++) {
      if (newBoard[i][j].active && !board[i][j].active) {
        board[i][j] = { preview: newBoard[i][j].name };
      }
    }
  }
};

export default addPreview;
