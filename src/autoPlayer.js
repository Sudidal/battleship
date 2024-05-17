class autoPlayer {
  #botWaitMilliSeconds = 2000;
  #opponentBoard;
  #myBoard;
  #lastAttackedBlock = null;
  #targetedBlock = null;
  attackedAShip = false;
  constructor(myBoard, opponentBoard) {
    this.#opponentBoard = opponentBoard;
    this.#myBoard = myBoard;
    this.length = myBoard.getLength();
    this.indexes = Array(this.length);
    for (let i = 0; i < this.length; i++) {
      this.indexes[i] = i;
    }
  }

  getIndexes = () => this.indexes;

  chooseBlock() {
    removeInactiveBlocks(this.getIndexes(), this.#opponentBoard.getArray());
    if (this.getIndexes().length < 1) {
      throw new Error("Bot array is out of indexes before the game ends");
    }
    console.log(this.getIndexes());

    pause(this.#botWaitMilliSeconds).then(() => {
      let block;
      if (this.#targetedBlock) {
        if (!this.#targetedBlock.ship.isFleetSank) {
          console.log("the fleet i targeted didn't sink yet");
          block = guessNextIndex(this.#opponentBoard, [
            this.#targetedBlock.getX(),
            this.#targetedBlock.getY(),
          ]);
        } else {
          console.log("the fleet i targeted already sank, i'll forget it");
          this.#targetedBlock = null;
          const index = getRandomIndex(this.getIndexes().length);
          if (this.getIndexes()[index] !== undefined) {
            const value = this.getIndexes()[index];
            block = this.#opponentBoard.getArray()[value];
          } else {
            throw new Error("Index out of array bounds " + index);
          }
        }
      } else {
        if (
          this.#lastAttackedBlock &&
          this.#lastAttackedBlock.isHaveShip &&
          !this.#lastAttackedBlock.ship.isFleetSank
        ) {
          console.log("I started targeting a new fleet");
          this.#targetedBlock = this.#lastAttackedBlock;
          block = guessNextIndex(this.#opponentBoard, [
            this.#targetedBlock.getX(),
            this.#targetedBlock.getY(),
          ]);
        } else {
          const index = getRandomIndex(this.getIndexes().length);
          if (this.getIndexes()[index] !== undefined) {
            const value = this.getIndexes()[index];
            block = this.#opponentBoard.getArray()[value];
          } else {
            throw new Error("Index out of array bounds " + index);
          }
        }
      }
      if (block) {
        this.#lastAttackedBlock = block;
        block.attack(true);
      } else {
        throw new Error("Bot failed to find a block");
      }
    });
  }
}

function getRandomIndex(length) {
  const random = Math.floor(Math.random() * (length - 1));
  return random;
}
function guessNextIndex(board, pos) {
  const x = pos[0];
  const y = pos[1];

  let possibleBlocks = Array();
  let blocksWithShips = Array();

  if (board.getBlock(x + 1, y)) {
    const right = [x + 1, y];
    if (board.getBlock(right[0], right[1])) {
      if (board.getBlock(right[0], right[1]).isAttacked) {
        blocksWithShips.push(right);
      } else if (
        !board.getBlock(right[0], right[1]).isAttacked &&
        !board.getBlock(right[0], right[1]).isSafe
      ) {
        console.log("I can go right");
        possibleBlocks.push(right);
      }
    }
  }
  const left = [x - 1, y];
  if (board.getBlock(left[0], left[1])) {
    if (board.getBlock(left[0], left[1]).isAttacked) {
      blocksWithShips.push(left);
    } else if (
      !board.getBlock(left[0], left[1]).isAttacked &&
      !board.getBlock(left[0], left[1]).isSafe
    ) {
      console.log("I can go left");
      possibleBlocks.push(left);
    }
  }
  const up = [x, y - 1];
  if (board.getBlock(up[0], up[1])) {
    if (board.getBlock(up[0], up[1]).isAttacked) {
      blocksWithShips.push(up);
    } else if (
      !board.getBlock(up[0], up[1]).isAttacked &&
      !board.getBlock(up[0], up[1]).isSafe
    ) {
      console.log("I can go up");
      possibleBlocks.push(up);
    }
  }
  const down = [x, y + 1];
  if (board.getBlock(down[0], down[1])) {
    if (board.getBlock(down[0], down[1]).isAttacked) {
      blocksWithShips.push(down);
    } else if (
      !board.getBlock(down[0], down[1]).isAttacked &&
      !board.getBlock(down[0], down[1]).isSafe
    ) {
      console.log("I can go down");
      possibleBlocks.push(down);
    }
  }
  console.log(possibleBlocks);
  if (possibleBlocks.length > 0) {
    const randomIndex = Math.floor(Math.random() * (possibleBlocks.length - 1));
    console.log(possibleBlocks[randomIndex]);
    return board.getBlock(
      possibleBlocks[randomIndex][0],
      possibleBlocks[randomIndex][1],
    );
  } else if (blocksWithShips.length > 0) {
    const randomIndex = Math.floor(
      Math.random() * (blocksWithShips.length - 1),
    );
    const x = blocksWithShips[randomIndex][0];
    const y = blocksWithShips[randomIndex][1];
    return guessNextIndex(board, [
      board.getBlock(x, y).getX(),
      board.getBlock(x, y).getY(),
    ]);
  } else throw new Error("Bot failed to find the rest of the fleet");
}

function removeInactiveBlocks(indexesArr, blocksArr) {
  for (let i = 0; i < indexesArr.length; i++) {
    const index = indexesArr[i];
    if (blocksArr[index].isSafe || blocksArr[index].isAttacked) {
      indexesArr.splice(i, 1);
    }
  }
}

function pause(time) {
  return new Promise((resolve) => setTimeout(resolve, time));
}

export { autoPlayer };
