import removeUnavailableBlocks from "./removeUnavailableBlocks.js";
import getSorroundingBlocks from "./getSorroundingBlocks.js";
import InvokeWitDelay from "./InvokeWithDelay.js";

class autoPlayer {
  #botWaitMilliSeconds = 1500;
  #opponentBoard;
  #myBoard;
  #lastAttacked = null;
  #targetBlock = null;
  attackedAShip = false;
  constructor(myBoard, opponentBoard) {
    this.#opponentBoard = opponentBoard;
    this.#myBoard = myBoard;
    this.length = myBoard.getLength();
    this.availableBlocks = Array(this.length);
    for (let i = 0; i < this.length; i++) {
      this.availableBlocks[i] = i;
    }
  }

  play() {
    InvokeWitDelay(this.#botWaitMilliSeconds).then(() => {
      const chosenBlock = choseBlock(this.#opponentBoard, this);

      if (chosenBlock) {
        this.setLastAttacked(chosenBlock);
        if (chosenBlock.isHaveShip) {
          this.setTargetBlock(chosenBlock);
        }
        chosenBlock.attack(true);
      } else {
        throw new Error("Bot failed to find a block");
      }
    });
  }

  getAvailableBlocks = () => this.availableBlocks;
  getLastAttacked = () => this.#lastAttacked;
  getTargetBlock = () => this.#targetBlock;

  setLastAttacked = (input) => (this.#lastAttacked = input);
  setTargetBlock = (input) => (this.#targetBlock = input);
}

function choseBlock(board, autoPlayer) {
  removeUnavailableBlocks(autoPlayer.getAvailableBlocks(), board.getArray());
  if (autoPlayer.getAvailableBlocks().length < 1) {
    throw new Error("Bot array is out of indexes before the game ends");
  }

  let lastAttackedValue = autoPlayer.getLastAttacked();
  let targetBlockValue = autoPlayer.getTargetBlock();

  let chosenBlock;

  if (targetBlockValue) {
    if (!targetBlockValue.getShip.isFleetSank) {
      console.log("the fleet i targeted didn't sink yet");
    } else {
      console.log("the fleet i targeted already sank, i'll forget it");
      targetBlockValue = null;
    }
  } else {
    if (
      lastAttackedValue &&
      lastAttackedValue.isHaveShip &&
      !lastAttackedValue.getShip.isFleetSank
    ) {
      console.log("I started targeting a new fleet");
      targetBlockValue = lastAttackedValue;
    }
  }

  if (targetBlockValue) {
    chosenBlock = chooseRelativeBlock(board, targetBlockValue.getPos()); // defalt Random
  } else {
    chosenBlock = chooseRandomBlock(autoPlayer.getAvailableBlocks(), board);
  }
  return chosenBlock;
}

function chooseRandomBlock(arr, board) {
  let chosenBlock;
  const randomIndex = Math.floor(Math.random() * (arr.length - 1));
  if (randomIndex > arr.length - 1 || randomIndex < 0) {
    throw new Error(
      "Index out of array bounds, Index: " + randomIndex + ", Array: " + arr,
    );
  } else {
    const value = arr[randomIndex];
    chosenBlock = board.getArray()[value];
  }
  return chosenBlock;
}

function chooseRelativeBlock(board, pos, triedBlocks = []) {
  let possibleBlocks = Array();
  let attackedBlocks = Array();

  const sorroundings = getSorroundingBlocks(board, pos, false, true);

  sorroundings.forEach((block) => {
    if (block.isHaveShip && block.isAttacked) {
      let tried = false;
      if (triedBlocks.length > 0) {
        for (let i = 0; i < triedBlocks.length; i++) {
          if (triedBlocks[i] === block) tried = true;
        }
      }
      if (!tried) {
        attackedBlocks.push(block);
      }
    } else {
      if (!block.isAttacked && !block.isSafe) {
        possibleBlocks.push(block);
      }
    }
  });

  if (possibleBlocks.length > 0) {
    // there are empty blocks around
    const randomIndex = Math.floor(Math.random() * (possibleBlocks.length - 1));
    return possibleBlocks[randomIndex];
  } else if (attackedBlocks.length > 0) {
    // no empty blocks around
    // try another route
    const randomIndex = Math.floor(Math.random() * (attackedBlocks.length - 1));
    const randomBlock = attackedBlocks[randomIndex];
    console.log("jumped to " + randomBlock.getPos());
    triedBlocks.push(randomBlock);
    return chooseRelativeBlock(board, randomBlock.getPos(), triedBlocks);
  } else {
    // That means the recursion reached a corner and can't go back
    // remove this route and go back
    triedBlocks = [];
    triedBlocks.push(board.getBlock(pos[0], pos[1]));
    return chooseRelativeBlock(board, pos, triedBlocks);
  }
}

export { autoPlayer };
