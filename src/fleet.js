import Ship from "./ship.js";

class Fleet {
  #horizontal;
  #ships;
  #length;
  #sankedShips = 0;
  constructor(length, board, horizontal) {
    this.#length = length;
    this.#ships = Array(this.#length);
    this.#horizontal = horizontal;
    this.board = board;
  }

  getShips = () => this.#ships;
  getDirection = () => this.#horizontal;

  initialize(pos) {
    this.occupyBlocks(pos);
  }
  calculateBlocksToTake(pos) {
    let blocksToTake = Array();
    let curX = pos[0];
    let curY = pos[1];
    if (this.#horizontal) curX -= Math.floor(this.#length / 2);
    else curY -= Math.floor(this.#length / 2);

    for (let i = 0; i < this.#length; i++) {
      //Arrays are pass by reference!!!
      blocksToTake.push([curX, curY]);

      if (this.#horizontal) curX++;
      else curY++;
    }
    return blocksToTake;
  }
  loseShip() {
    this.#sankedShips++;
    if (this.#sankedShips >= this.#length) {
      this.#ships.forEach((ship) => {
        ship.fleetHasSank();
      });
    }
  }
  occupyBlocks(pos) {
    if (this.#ships.filter(() => true).length > 0) {
      this.retreat();
    }
    const blocksToTake = this.calculateBlocksToTake(pos);
    for (let i = 0; i < this.#length; i++) {
      const newShip = new Ship(blocksToTake[i], this.board, this);
      this.#ships[i] = newShip;
    }
  }
  retreat() {
    for (let i = 0; i < this.#ships.length; i++) {
      this.#ships[i].block.removeShip();
      this.#ships[i] = null;
    }
  }
}

export default Fleet;
