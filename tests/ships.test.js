import { Fleet } from "../src/ships";
import { GameBoard } from "../src/gameBoard";

describe("Ships", () => {
  const newGameBoard = new GameBoard();
  const newFleet = new Fleet(3, [5, 5], newGameBoard);
  test("ship is created and working", () => {
    expect(newGameBoard.getBlock(5, 5).isHaveShip).toBe(true);
    expect(newGameBoard.getBlock(4, 5).isHaveShip).toBe(true);
    expect(newGameBoard.getBlock(6, 5).isHaveShip).toBe(true);
    expect(newGameBoard.getBlock(5, 4).isHaveShip).toBe(false);
    newGameBoard.getBlock(5, 5).attack();
    expect(newGameBoard.getBlock(5, 5).ship.isSank).toBe(true);
  });
});
