class Fleet {
  #horizontal;
  #ships;
  #length;
  constructor(length, pos, gameBoard, horizontal) {
    this.#length = length;
    this.#ships = Array(this.#length);
    const curPos = pos;
    this.#horizontal = horizontal;
    this.sankedShips = 0;

    if (this.#horizontal) {
      curPos[0] -= Math.floor(this.#length / 2);
    } else {
      curPos[1] -= Math.floor(this.#length / 2);
    }

    for (let i = 0; i < this.#length; i++) {
      const newShip = new Ship(curPos, gameBoard, this);
      this.#ships[i] = newShip;

      if (this.#horizontal) {
        curPos[0]++;
      } else {
        curPos[1]++;
      }
    }
  }

  loseShip() {
    this.sankedShips++;
    if (this.sankedShips >= this.#length) {
      this.#ships.forEach((ship) => {
        ship.fleetHasSank();
      });
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
