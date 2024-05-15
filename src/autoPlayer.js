class autoPlayer {
  #opponentBoard;
  #myBoard;
  constructor(myBoard, opponentBoard) {
    this.#opponentBoard = opponentBoard;
    this.#myBoard = myBoard;
    this.length = myBoard.getLength();
    this.indexes = Array(this.length);
    for (let i = 0; i < this.length; i++) {
      this.indexes[i] = i;
    }
  }

  chooseBlock() {
    const index = getRandomIndex(this.getIndexes().length);
    let value;
    if (this.getIndexes()[index] !== undefined) {
      value = this.getIndexes()[index];
    } else {
      throw new Error("Index out of array bounds " + index);
    }

    const block = this.#opponentBoard.getArray()[value];
    removeIndexFromArray(index, this.getIndexes());
    block.attack(true);
  }

  getIndexes = () => this.indexes;
}

function getRandomIndex(length) {
  const random = Math.floor(Math.random() * (length - 1));
  return random;
}

function removeIndexFromArray(index, array) {
  array.splice(index, 1);
}

export { autoPlayer };
