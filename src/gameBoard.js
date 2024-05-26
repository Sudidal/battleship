import Block from "./block.js";
import { createGridUI } from "./boardUI.js";
import getSorroundingBlocks from "./getSorroundingBlocks.js";

class GameBoard {
  constructor(clickable, shipsHidden, editable, dimensions = 10) {
    this.dimensions = dimensions;
    this.length = this.dimensions * this.dimensions;
    this.blocks = Array(this.length);
    this.hitCallback = null;
    this.DOMCallback = null;
    this.shipsCount = 0;
    this.destroyedShipsCount = 0;
    this.cleared = false;
    this.clickable = clickable;
    this.shipsHidden = shipsHidden;
    this.active = false;
    this.editable = editable;
    initializeGrid(this.dimensions, this);
  }

  isClickable = () => this.clickable;
  isShipsHidden = () => this.shipsHidden;
  isFinished = () => this.cleared;
  isActive = () => this.active;
  isEditable = () => this.editable;
  getArray = () => this.blocks;
  getDimensions = () => this.dimensions;
  getLength = () => this.blocks.filter(() => true).length;
  getBlock(x, y) {
    const block = this.blocks.find(
      (item) => item && item.getPos()[0] === x && item.getPos()[1] === y,
    );
    return block;
  }

  ready() {
    createGridUI(this);
    updateALLBlocksUI(this);
    this.callDOMCallback();
  }
  setBoardState(clickable, shipsHidden, active, editable) {
    let needUpdate = false;
    if (this.clickable !== clickable) {
      this.clickable = clickable;
    }
    if (this.shipsHidden !== shipsHidden) {
      this.shipsHidden = shipsHidden;
      needUpdate = true;
    }
    if (this.editable !== editable) {
      this.editable = editable;
      needUpdate = true;
    }
    if (this.active !== active) {
      this.active = active;
      needUpdate = true;
    }
    if (needUpdate) {
      this.callDOMCallback();
      updateALLBlocksUI(this);
    }
  }
  hasBeenAttacked(block) {
    if (block.isHaveShip) {
      this.loseFleet();
      markSafeBlocks(this, block.getPos());
    }
    const args = block.isHaveShip ? "ship" : "";
    this.callHitCallback(args);
  }
  addFleet = () => this.shipsCount++;
  loseFleet() {
    this.destroyedShipsCount++;
    if (this.destroyedShipsCount >= this.shipsCount) {
      this.cleared = true;
    }
  }

  setHitCallback(callback) {
    if (!this.hitCallback) {
      this.hitCallback = callback;
    }
  }
  setDOMCallback(callback) {
    this.DOMCallback = callback;
  }
  callDOMCallback() {
    if (this.DOMCallback) {
      this.DOMCallback();
    } else {
      console.error("DOMCallback is not assigned");
    }
  }
  callHitCallback(args) {
    if (this.hitCallback) {
      this.hitCallback(args);
    }
  }
}

function initializeGrid(dimensions, board) {
  let count = 0;
  for (let y = 0; y < dimensions; y++) {
    for (let x = 0; x < dimensions; x++) {
      const block = new Block(x, y, board);
      board.getArray()[count] = block;
      count++;
    }
  }
  console.log("initialized Grid");
}
function updateALLBlocksUI(board) {
  console.log("updating all blocks");
  board.getArray().forEach((block) => {
    block.callDOMUpdateCallback();
  });
}

function markSafeBlocks(board, pos) {
  let x = pos[0];
  let y = pos[1];

  const crossSafeBlocks = getSorroundingBlocks(board, pos, true, false);

  crossSafeBlocks.forEach((block) => {
    if (!block.isHaveShip) block.markSafe();
    else
      throw new Error(
        `Cross safe block has a ship! (${block.getPos()[0]}, ${block.getPos()[1]})`,
      );
  });

  if (board.getBlock(pos[0], pos[1]).getShip.isFleetSank) {
    const linearSafeBlocks = getSorroundingBlocks(board, pos, false, true);
    linearSafeBlocks.forEach((block) => {
      block.markSafe();
    });
  }
}

export { GameBoard, getSorroundingBlocks };
