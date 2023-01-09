import addPreview from "../src/addPreview";
import { duplicateBoard, Square } from "../src/useTetris";

describe("Adding preview block", () => {
  test("Show preview after spawning J shape", () => {
    const startBoard: Square[][] = new Array(20).fill(new Array(10).fill({}));
    const board = duplicateBoard(startBoard);
    const block = { active: true, name: "J", orientation: 0 };

    board[7][3] = { ...block };
    board[8][3] = { ...block };
    board[8][4] = { ...block };
    board[8][5] = { ...block };

    addPreview(board);

    expect(board[18][3]).toEqual({ preview: "J" });
    expect(board[19][3]).toEqual({ preview: "J" });
    expect(board[19][4]).toEqual({ preview: "J" });
    expect(board[19][5]).toEqual({ preview: "J" });
  });

  test("Show preview after spawning J shape with previous preview", () => {
    const startBoard: Square[][] = new Array(20).fill(new Array(10).fill({}));
    const board = duplicateBoard(startBoard);
    const block = { active: true, name: "J", orientation: 0 };

    board[7][3] = { ...block };
    board[8][3] = { ...block };
    board[8][4] = { ...block };
    board[8][5] = { ...block };

    board[19][9] = { preview: "J" };

    addPreview(board);

    expect(board[18][3]).toEqual({ preview: "J" });
    expect(board[19][3]).toEqual({ preview: "J" });
    expect(board[19][4]).toEqual({ preview: "J" });
    expect(board[19][5]).toEqual({ preview: "J" });
    expect(board[19][9]).toEqual({});
  });
});
