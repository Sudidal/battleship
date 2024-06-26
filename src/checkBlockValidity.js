import { getSorroundingBlocks } from "./gameBoard.js";

function checkBlockValidity(board, fleet, pos, block = null) {
  const x = pos[0];
  const y = pos[1];

  let valid = true;

  if (board.getBlock(x, y).isHaveShip) {
    if (block && board.getBlock(x, y).getShip.fleet !== block.getShip.fleet) {
      valid = false;
      return valid;
    }
  }

  const blocksToTake = fleet.calculateBlocksToTake([x, y]);

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
