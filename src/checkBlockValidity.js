import { getSorroundingBlocks } from "./gameBoard.js";

function checkBlockValidity(board, fleet, pos) {
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
            if (sorroundingBlock.getShip.getFleet !== fleet) {
              valid = false;
              // console.log("sorrounding block has a ship");
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

export default checkBlockValidity;
