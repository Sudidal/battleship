class Fleet {
  #horizontal;
  #ships;
  #length;
  constructor(length, pos, gameBoard, horizontal) {
    this.#length = length;
    this.#ships = Array(this.#length);
    const curPos = pos;
    this.#horizontal = horizontal;

    if (this.#horizontal) {
      curPos[0] -= Math.floor(this.#length / 2);
    } else {
      curPos[1] -= Math.floor(this.#length / 2);
    }

    for (let i = 0; i < this.#length; i++) {
      const newShip = new Ship(curPos, gameBoard);
      this.#ships[i] = newShip;

      if (this.#horizontal) {
        curPos[0]++;
      } else {
        curPos[1]++;
      }
    }
  }
}

class Ship {
  #sank = false;
  constructor(pos, gameBoard) {
    gameBoard.getBlock(pos[0], pos[1]).placeShip(this);
  }
  sink = () => (this.#sank = true);
  get isSank() {
    return this.#sank;
  }
}

export { Fleet };
