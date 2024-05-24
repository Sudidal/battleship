class Fleet {
  #horizontal;
  #ships;
  #length;
  constructor(length, board, horizontal) {
    this.#length = length;
    this.#ships = Array(this.#length);
    this.#horizontal = horizontal;
    this.board = board;
    this.sankedShips = 0;
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
    this.sankedShips++;
    if (this.sankedShips >= this.#length) {
      this.#ships.forEach((ship) => {
        ship.fleetHasSank();
      });
    }
  }
  occupyBlocks(pos) {
    if (this.#ships.filter(() => true).length > 0) {
      this.cleanUp();
    }
    const blocksToTake = this.calculateBlocksToTake(pos);
    for (let i = 0; i < this.#length; i++) {
      const newShip = new Ship(blocksToTake[i], this.board, this);
      this.#ships[i] = newShip;
    }
  }
  cleanUp() {
    for (let i = 0; i < this.#ships.length; i++) {
      this.#ships[i].block.removeShip();
      this.#ships[i] = null;
    }
  }
}

class Ship {
  #sank = false;
  #fleetSank = false;
  constructor(pos, gameBoard, fleet) {
    this.myBlock = gameBoard.getBlock(pos[0], pos[1]);
    this.myBlock.placeShip(this);
    this.fleet = fleet;
  }
  get isSank() {
    return this.#sank;
  }
  get isFleetSank() {
    return this.#fleetSank;
  }
  get getFleet() {
    return this.fleet;
  }
  get block() {
    return this.myBlock;
  }
  sink() {
    this.#sank = true;
    this.fleet.loseShip();
  }
  fleetHasSank() {
    this.#fleetSank = true;
    this.myBlock.fleetHasSank();
  }
}

export { Fleet };
