import { GameBoard } from "./gameBoard.js";
import { Fleet } from "./ships.js";

function createGameBoard(clickable, shipsHidden) {
  const newGameBoard = new GameBoard(clickable, shipsHidden);

  new Fleet(3, [5, 4], newGameBoard, true);
  new Fleet(3, [2, 2], newGameBoard, false);
  new Fleet(2, [7, 8], newGameBoard, true);
  new Fleet(1, [0, 0], newGameBoard, true);
  new Fleet(2, [2, 7], newGameBoard, false);
  new Fleet(1, [9, 9], newGameBoard, true);

  return newGameBoard;
}

export { createGameBoard };
