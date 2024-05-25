import { GameBoard } from "./gameBoard.js";
import Fleet from "./fleet.js";
import { randomPosition, randomAlign } from "./blocksAligner.js";

const fleets = [1, 1, 1, 1, 2, 2, 2, 3, 3, 4];

function createGameBoard(clickable, shipsHidden, editable) {
  let newGameBoard = null;
  let counter = 0;
  while (!newGameBoard) {
    counter++;
    newGameBoard = Initialize(clickable, shipsHidden, editable);
  }
  console.log("Tried " + counter + " times to make a good alignment");
  return newGameBoard;
}

function Initialize(clickable, shipsHidden, editable) {
  const newGameBoard = new GameBoard(clickable, shipsHidden, editable);
  for (let i = 0; i < fleets.length; i++) {
    const randomOrientation = randomAlign();
    const newFleet = new Fleet(fleets[i], newGameBoard, randomOrientation);
    const randomPos = randomPosition(newGameBoard, newFleet);
    if (!randomPos) {
      return null;
    }
    newFleet.initialize(randomPos);
  }
  return newGameBoard;
}

export { createGameBoard };
