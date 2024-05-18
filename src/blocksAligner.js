import { getSorroundingBlocks } from "./gameBoard.js";

function randomPosition(board, fleet, triedCoords = null) {
  console.log(triedCoords);
  if (triedCoords) {
    if (triedCoords.length < 1) {
      return null;
    }
  } else {
    triedCoords = Array(board.getLength());
    for (let i = 0; i < triedCoords.length; i++) {
      triedCoords[i] = i;
    }
  }
  const randomIndex = Math.floor(Math.random() * (triedCoords.length - 1));
  const block = board.getArray()[randomIndex];
  let x;
  let y;
  if (block) {
    x = block.getX();
    y = block.getY();
  }
  const valid = checkPositionValidity(board, fleet, [x, y]);
  if (valid) {
    console.log(`(${x}, ${y})`);
    return [x, y];
  } else {
    console.log(`invalid, choosing another coord: (${x}, ${y})`);
    triedCoords.splice(randomIndex, 1);
    return randomPosition(board, fleet, triedCoords);
  }
}

function randomAlign() {
  const random = Math.floor(Math.random() * 2);
  if (random === 1) return true;
  else return false;
}

function checkPositionValidity(board, fleet, pos) {
  const x = pos[0];
  const y = pos[1];

  const blocksToTake = fleet.calculateBlocksToTake([x, y]);
  let valid = true;

  if (blocksToTake.length > 0) {
    blocksToTake.forEach((blockToTake) => {
      if (board.getBlock(blockToTake[0], blockToTake[1])) {
        const sorroundingBlocks = getSorroundingBlocks(
          board,
          blockToTake,
          true,
          true,
        );
        sorroundingBlocks.forEach((sorroundingBlock) => {
          if (sorroundingBlock.isHaveShip) {
            if (sorroundingBlock.ship.getFleet !== fleet) {
              valid = false;
              console.log("sorrounding block has a ship");
            }
          }
        });
      } else {
        console.log("out of bounds");
        valid = false;
      }
    });
  } else {
    console.log("no blocks to take");
    valid = false;
  }
  return valid;
}

export { randomPosition, randomAlign };
