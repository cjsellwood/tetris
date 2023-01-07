import { Square } from "../src/App";
import { findBounds, rotate } from "../src/rotate";

describe("Finding shape bounds", () => {
  test("Finds I shape bounds in up orientation", () => {
    const startBoard: Square[][] = new Array(20).fill(new Array(10).fill({}));
    const board = [
      ...startBoard.map((row) => [...row.map((square) => ({ ...square }))]),
    ];
    const block = { active: true, name: "I", orientation: 0 };
    board[7][3] = { ...block };
    board[7][4] = { ...block };
    board[7][5] = { ...block };
    board[7][6] = { ...block };
    expect(findBounds(board)).toEqual([6, 9, 3, 6]);
  });

  test("Finds I shape bounds in right orientation", () => {
    const startBoard: Square[][] = new Array(20).fill(new Array(10).fill({}));
    const board = [
      ...startBoard.map((row) => [...row.map((square) => ({ ...square }))]),
    ];
    const block = { active: true, name: "I", orientation: 1 };
    board[6][5] = { ...block };
    board[7][5] = { ...block };
    board[8][5] = { ...block };
    board[9][5] = { ...block };
    expect(findBounds(board)).toEqual([6, 9, 3, 6]);
  });

  test("Finds I shape bounds in down orientation", () => {
    const startBoard: Square[][] = new Array(20).fill(new Array(10).fill({}));
    const board = [
      ...startBoard.map((row) => [...row.map((square) => ({ ...square }))]),
    ];
    const block = { active: true, name: "I", orientation: 2 };
    board[8][3] = { ...block };
    board[8][4] = { ...block };
    board[8][5] = { ...block };
    board[8][6] = { ...block };
    expect(findBounds(board)).toEqual([6, 9, 3, 6]);
  });

  test("Finds I shape bounds in left orientation", () => {
    const startBoard: Square[][] = new Array(20).fill(new Array(10).fill({}));
    const board = [
      ...startBoard.map((row) => [...row.map((square) => ({ ...square }))]),
    ];
    const block = { active: true, name: "I", orientation: 3 };
    board[6][4] = { ...block };
    board[7][4] = { ...block };
    board[8][4] = { ...block };
    board[9][4] = { ...block };
    expect(findBounds(board)).toEqual([6, 9, 3, 6]);
  });

  test("Finds O shape bounds", () => {
    const startBoard: Square[][] = new Array(20).fill(new Array(10).fill({}));
    const board = [
      ...startBoard.map((row) => [...row.map((square) => ({ ...square }))]),
    ];
    const block = { active: true, name: "O" };
    board[7][3] = { ...block };
    board[7][4] = { ...block };
    board[8][3] = { ...block };
    board[8][4] = { ...block };
    expect(findBounds(board)).toEqual([7, 8, 3, 4]);
  });

  test("Finds T shape bounds in right orientation", () => {
    const startBoard: Square[][] = new Array(20).fill(new Array(10).fill({}));
    const board = [
      ...startBoard.map((row) => [...row.map((square) => ({ ...square }))]),
    ];
    const block = { active: true, name: "T", orientation: 1 };
    board[7][4] = { ...block };
    board[8][4] = { ...block };
    board[8][5] = { ...block };
    board[9][4] = { ...block };
    expect(findBounds(board)).toEqual([7, 9, 3, 5]);
  });

  test("Finds J shape bounds in left orientation", () => {
    const startBoard: Square[][] = new Array(20).fill(new Array(10).fill({}));
    const board = [
      ...startBoard.map((row) => [...row.map((square) => ({ ...square }))]),
    ];
    const block = { active: true, name: "J", orientation: 3 };
    board[7][3] = { ...block };
    board[7][4] = { ...block };
    board[8][4] = { ...block };
    board[9][4] = { ...block };
    expect(findBounds(board)).toEqual([7, 9, 3, 5]);
  });

  test("Finds L shape bounds in down orientation", () => {
    const startBoard: Square[][] = new Array(20).fill(new Array(10).fill({}));
    const board = [
      ...startBoard.map((row) => [...row.map((square) => ({ ...square }))]),
    ];
    const block = { active: true, name: "L", orientation: 2 };
    board[8][3] = { ...block };
    board[8][4] = { ...block };
    board[8][5] = { ...block };
    board[9][3] = { ...block };
    expect(findBounds(board)).toEqual([7, 9, 3, 5]);
  });

  test("Finds S shape bounds in up orientation", () => {
    const startBoard: Square[][] = new Array(20).fill(new Array(10).fill({}));
    const board = [
      ...startBoard.map((row) => [...row.map((square) => ({ ...square }))]),
    ];
    const block = { active: true, name: "S", orientation: 0 };
    board[7][4] = { ...block };
    board[7][5] = { ...block };
    board[8][3] = { ...block };
    board[8][4] = { ...block };
    expect(findBounds(board)).toEqual([7, 9, 3, 5]);
  });

  test("Finds S shape bounds in right orientation", () => {
    const startBoard: Square[][] = new Array(20).fill(new Array(10).fill({}));
    const board = [
      ...startBoard.map((row) => [...row.map((square) => ({ ...square }))]),
    ];
    const block = { active: true, name: "Z", orientation: 1 };
    board[7][5] = { ...block };
    board[8][4] = { ...block };
    board[8][5] = { ...block };
    board[9][4] = { ...block };
    expect(findBounds(board)).toEqual([7, 9, 3, 5]);
  });
});

describe("Rotating piece", () => {
  test("Rotates a J shape", () => {
    const startBoard: Square[][] = new Array(20).fill(new Array(10).fill({}));
    const board = [
      ...startBoard.map((row) => [...row.map((square) => ({ ...square }))]),
    ];
    const block = { active: true, name: "J", orientation: 0 };
    board[7][3] = { ...block };
    board[8][3] = { ...block };
    board[8][4] = { ...block };
    board[8][5] = { ...block };

    const newBoard = rotate(board);
    expect(newBoard).not.toBeUndefined();

    if (!newBoard) {
      return;
    }
    const updatedBlock = { active: true, name: "J", orientation: 1 };
    expect(newBoard[7][3]).toEqual({});
    expect(newBoard[7][4]).toEqual(updatedBlock);
    expect(newBoard[7][5]).toEqual(updatedBlock);
    expect(newBoard[8][3]).toEqual({});
    expect(newBoard[8][4]).toEqual(updatedBlock);
    expect(newBoard[8][5]).toEqual({});
    expect(newBoard[9][3]).toEqual({});
    expect(newBoard[9][4]).toEqual(updatedBlock);
    expect(newBoard[9][5]).toEqual({});
  });

  test("rotates a J shape that has already been rotated", () => {
    const startBoard: Square[][] = new Array(20).fill(new Array(10).fill({}));
    const board = [
      ...startBoard.map((row) => [...row.map((square) => ({ ...square }))]),
    ];
    const block = { active: true, name: "J", orientation: 1 };
    board[7][4] = { ...block };
    board[7][5] = { ...block };
    board[8][4] = { ...block };
    board[9][4] = { ...block };

    const newBoard = rotate(board);

    expect(newBoard).not.toBeUndefined();
    if (!newBoard) {
      return;
    }
    const updatedBlock = { active: true, name: "J", orientation: 2 };

    expect(newBoard[7][3]).toEqual({});
    expect(newBoard[7][4]).toEqual({});
    expect(newBoard[7][5]).toEqual({});
    expect(newBoard[8][3]).toEqual(updatedBlock);
    expect(newBoard[8][4]).toEqual(updatedBlock);
    expect(newBoard[8][5]).toEqual(updatedBlock);
    expect(newBoard[9][3]).toEqual({});
    expect(newBoard[9][4]).toEqual({});
    expect(newBoard[9][5]).toEqual(updatedBlock);
  });

  test.only("Does not rotate a J shape that would go over edge", () => {
    const startBoard: Square[][] = new Array(20).fill(new Array(10).fill({}));
    const board = [
      ...startBoard.map((row) => [...row.map((square) => ({ ...square }))]),
    ];
    const block = { active: true, name: "J", orientation: 1 };
    board[7][0] = { ...block };
    board[7][1] = { ...block };
    board[8][0] = { ...block };
    board[9][0] = { ...block };

    const newBoard = rotate(board);

    expect(newBoard).toBeUndefined();
  });
});
