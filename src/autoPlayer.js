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
    removeInactiveBlocks(this.getIndexes(), this.#opponentBoard.getArray());
    if (this.getIndexes().length < 1) {
      throw new Error("Bot array is out of indexes before the game ends");
    }
    console.log(this.getIndexes());

    const index = getRandomIndex(this.getIndexes().length);
    let value;
    if (this.getIndexes()[index] !== undefined) {
      value = this.getIndexes()[index];
    } else {
      throw new Error("Index out of array bounds " + index);
    }

    const block = this.#opponentBoard.getArray()[value];
    block.attack(true);
  }

  getIndexes = () => this.indexes;
}

function getRandomIndex(length) {
  const random = Math.floor(Math.random() * (length - 1));
  return random;
}

function removeInactiveBlocks(indexesArr, blocksArr) {
  for (let i = 0; i < indexesArr.length; i++) {
    const index = indexesArr[i];
    if (blocksArr[index].isSafe) {
      console.log("removed " + index + " because it's safe");
      indexesArr.splice(i, 1);
    }
    if (blocksArr[index].isAttacked) {
      console.log("removed " + index + " because it's attacked");
      indexesArr.splice(i, 1);
    }
  }
}

export { autoPlayer };
