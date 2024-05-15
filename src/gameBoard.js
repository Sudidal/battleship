import { createGridUI } from "./UI.js";

const EMPTY_HIT_STATE = "empty";
const SHIP_HIT_STATE = "ship";

class GameBoard {
  constructor(clickable, shipsHidden, dimensions = 10) {
    this.length = dimensions * dimensions;
    this.blocks = Array(this.length);
    this.hitCallback = null;
    this.shipsCount = 0;
    this.destroyedShipsCount = 0;
    this.finished = false;
    this.clickable = clickable;
    this.shipsHidden = shipsHidden;
    initializeGrid(dimensions, this);
  }

  isClickable = () => this.clickable;
  isShipsHidden = () => this.shipsHidden;
  isFinished = () => this.finished;
  getArray = () => this.blocks;

  getLength() {
    return this.blocks.filter(() => true).length;
  }
  getBlock(x, y) {
    const block = this.blocks.find(
      (item) => item && item.getX() === x && item.getY() === y,
    );
    if (block) return block;
    else console.log("Block Not Found!");
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
      updateGridUI(this);
    }
  }
  setClickableShipsHidden(clickableToggle, shipsHiddenToggle) {
    if (this.clickable !== clickableToggle) {
      this.clickable = clickableToggle;
    }
    if (this.shipsHidden !== shipsHiddenToggle) {
      this.shipsHidden = shipsHiddenToggle;
      updateGridUI(this);
    }
  }

  setHitCallback(callback) {
    this.hitCallback = callback;
  }
  hasBeenAttacked(state) {
    this.hitCallback(state);
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
  createGridUI(board);
}
function updateGridUI(board) {
  board.getArray().forEach((element) => {
    element.callDOMUpdateCallback();
  });
}

class Block {
  #board;
  #pos;
  #attacked = false;
  #haveShip = false;
  #myShip = null;
  #DOMUpdateCallback;
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
    if (!this.#attacked) {
      console.log(`attacked: (${this.#pos[0]}, ${this.#pos[1]})`);
      this.#attacked = true;
      if (this.#haveShip) {
        this.#myShip.sink();
        this.#board.loseFleet();
        this.#board.hasBeenAttacked(SHIP_HIT_STATE);
      } else {
        this.#board.hasBeenAttacked(EMPTY_HIT_STATE);
      }
    } else if (bot) {
      console.error("bot trying to attack already attacked block");
    }
    if (this.#DOMUpdateCallback) this.callDOMUpdateCallback();
  }
  placeShip(ship) {
    if (!this.#haveShip) {
      this.#myShip = ship;
      this.#haveShip = true;
      this.#board.addFleet();
      if (this.#DOMUpdateCallback) this.callDOMUpdateCallback();
    }
  }
  setDOMUpdateCallback(input) {
    if (!this.#DOMUpdateCallback) {
      this.#DOMUpdateCallback = input;
      this.callDOMUpdateCallback();
    }
  }
  callDOMUpdateCallback() {
    if (this.#DOMUpdateCallback) this.#DOMUpdateCallback();
    else console.log("DOMUpdateCallback is not assigned");
  }
}

export { GameBoard };
