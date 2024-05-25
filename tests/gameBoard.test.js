import { GameBoard } from "../src/gameBoard.js";

describe("GameBoard", () => {
  const newGameBoard = new GameBoard();
  test("GameBoard created 10*10 blocks", () => {
    expect(newGameBoard.getLength()).toBe(100);
  });
  test("GameBoard created proprate array", () => {
    expect(newGameBoard.getArray()[2]).not.toBe(undefined);
    console.log(newGameBoard.getArray()[2]);
  });
  test("GameBoard assinged blocks", () => {
    const block = newGameBoard.getBlock(9, 9);
    expect(block.getPos()[0]).toBe(9);
    expect(block.getPos()[1]).toBe(9);
  });
  test("blocks get attacked", () => {
    const block = newGameBoard.getBlock(2, 5);
    block.attack();
    expect(block.isAttacked).toBe(true);
  });
});
