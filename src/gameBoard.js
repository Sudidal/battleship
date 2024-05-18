import { createGridUI } from "./boardUI.js";

const EMPTY_HIT_STATE = "empty";
const SHIP_HIT_STATE = "ship";

class GameBoard {
  constructor(clickable, shipsHidden, dimensions = 10) {
    this.dimensions = dimensions;
    this.length = this.dimensions * this.dimensions;
    this.blocks = Array(this.length);
    this.hitCallback = null;
    this.DOMCallback = null;
    this.shipsCount = 0;
    this.destroyedShipsCount = 0;
    this.finished = false;
    this.clickable = clickable;
    this.shipsHidden = shipsHidden;
    this.active = false;
    initializeGrid(this.dimensions, this);
  }

  ready() {
    createGridUI(this);
    this.callDOMCallback();
  }

  isClickable = () => this.clickable;
  isShipsHidden = () => this.shipsHidden;
  isFinished = () => this.finished;
  isActive = () => this.active;
  getArray = () => this.blocks;
  getDimensions = () => this.dimensions;

  getLength() {
    return this.blocks.filter(() => true).length;
  }
  getBlock(x, y) {
    const block = this.blocks.find(
      (item) => item && item.getX() === x && item.getY() === y,
    );
    if (block) return block;
    else console.log(`Block Not Found! (${x}, ${y})`);
  }
  getBlockByIndex(index) {
    if (this.blocks[index]) return this.blocks[index];
    else console.log("Item not found");
  }

  setClickable(toggle) {
    if (this.clickable !== toggle) {
      this.clickable = toggle;
    }
  }
  setShipsHidden(toggle) {
    if (this.shipsHidden !== toggle) {
      this.shipsHidden = toggle;
      updateALLBlocksUI(this);
    }
  }
  setBoardState(clickable, shipsHidden, active) {
    if (this.clickable !== clickable) {
      this.clickable = clickable;
    }
    if (this.shipsHidden !== shipsHidden) {
      this.shipsHidden = shipsHidden;
      updateALLBlocksUI(this);
    }
    if (this.active !== active) {
      this.active = active;
      this.callDOMCallback();
    }
  }

  setHitCallback(callback) {
    this.hitCallback = callback;
  }
  setDOMCallback(callback) {
    this.DOMCallback = callback;
  }
  hasBeenAttacked(state, pos) {
    console.log(`attacked: (${pos[0]}, ${pos[1]})`);
    this.hitCallback(state);
  }
  callDOMCallback() {
    if (this.DOMCallback) {
      this.DOMCallback();
    } else {
      console.error("DOMCallback is not assigned");
    }
  }

  addFleet = () => this.shipsCount++;
  loseFleet() {
    this.destroyedShipsCount++;
    if (this.destroyedShipsCount === this.shipsCount) {
      this.finished = true;
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
  board.getArray().forEach((element) => {
    element.callDOMUpdateCallback();
  });
}

class Block {
  #board;
  #pos;
  #myShip;
  #DOMUpdateCallback;
  #attacked = false;
  #safe = false;
  #haveShip = false;

  constructor(x, y, gameBoard) {
    this.#board = gameBoard;
    this.#pos = Array(2);
    this.#pos[0] = x;
    this.#pos[1] = y;
  }

  getX = () => this.#pos[0];
  getY = () => this.#pos[1];

  get getGameBoard() {
    return this.#board;
  }
  get isAttacked() {
    return this.#attacked;
  }
  get isSafe() {
    return this.#safe;
  }
  get isHaveShip() {
    return this.#haveShip;
  }
  get ship() {
    return this.#myShip;
  }
  attack(bot = false) {
    if (!bot && !this.#board.isClickable()) {
      return;
    }
    if (!this.#attacked && !this.#safe) {
      this.#attacked = true;
      if (this.#haveShip) {
        this.#myShip.sink();
        this.#board.loseFleet();
        this.#board.hasBeenAttacked(SHIP_HIT_STATE, [this.getX(), this.getY()]);
        markSafeBlocks(this.#board, this.#pos);
      } else {
        this.#board.hasBeenAttacked(EMPTY_HIT_STATE, [
          this.getX(),
          this.getY(),
        ]);
      }
      if (this.#DOMUpdateCallback) this.callDOMUpdateCallback();
    } else if (bot) {
      if (this.#attacked)
        console.error("bot trying to attack already attacked block");
      else if (this.#safe) console.error("bot trying to attack a safe block");
    }
  }
  markSafe() {
    if (!this.#attacked && !this.#safe) {
      console.log(`Safe: (${this.#pos[0]}, ${this.#pos[1]})`);
      this.#safe = true;
      if (this.#DOMUpdateCallback) this.callDOMUpdateCallback();
    }
  }
  placeShip(ship) {
    if (!this.#haveShip) {
      this.#myShip = ship;
      this.#haveShip = true;
      this.#board.addFleet();
      if (this.#DOMUpdateCallback) this.callDOMUpdateCallback();
    }
  }
  fleetHasSank() {
    markSafeBlocks(this.#board, this.#pos);
    if (this.#DOMUpdateCallback) this.callDOMUpdateCallback();
  }
  setDOMUpdateCallback(input) {
    if (!this.#DOMUpdateCallback) {
      this.#DOMUpdateCallback = input;
      this.callDOMUpdateCallback();
    }
  }
  callDOMUpdateCallback() {
    if (this.#DOMUpdateCallback) this.#DOMUpdateCallback();
    else console.error("DOMUpdateCallback is not assigned");
  }
}

function markSafeBlocks(board, pos) {
  let x = pos[0];
  let y = pos[1];

  const crossSafeBlocks = getSorroundingBlocks(board, pos, true, false);

  crossSafeBlocks.forEach((block) => {
    if (!block.isHaveShip) block.markSafe();
    else
      throw new Error(
        `Cross safe block has a ship! (${block.getX()}, ${block.getY()})`,
      );
  });

  if (board.getBlock(pos[0], pos[1]).ship.isFleetSank) {
    const linearSafeBlocks = getSorroundingBlocks(board, pos, false, true);
    linearSafeBlocks.forEach((block) => {
      block.markSafe();
    });
  }
}

function getSorroundingBlocks(board, pos, cross, linear) {
  const x = pos[0];
  const y = pos[1];
  const sorroundings = Array();

  if (linear) {
    // right
    const right = board.getBlock(x + 1, y);
    if (right) {
      sorroundings.push(right);
    }
    // left
    const left = board.getBlock(x - 1, y);
    if (left) {
      sorroundings.push(left);
    }
    // up
    const up = board.getBlock(x, y - 1);
    if (up) {
      sorroundings.push(up);
    }
    // down
    const down = board.getBlock(x, y + 1);
    if (down) {
      sorroundings.push(down);
    }
  }

  if (cross) {
    // upper right
    const upperRight = board.getBlock(x + 1, y - 1);
    if (upperRight) {
      sorroundings.push(upperRight);
    }
    // upper left
    const upperLeft = board.getBlock(x - 1, y - 1);
    if (upperLeft) {
      sorroundings.push(upperLeft);
    }
    // bottom right
    const bottomRight = board.getBlock(x + 1, y + 1);
    if (bottomRight) {
      sorroundings.push(bottomRight);
    }
    // bottom left
    const bottomLeft = board.getBlock(x - 1, y + 1);
    if (bottomLeft) {
      sorroundings.push(bottomLeft);
    }
  }
  return sorroundings;
}

export { GameBoard, getSorroundingBlocks };
