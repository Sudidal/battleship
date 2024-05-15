const gridContainer = document.querySelector(".grid-container");

const BLOCK_CLASS = "block";
const SHIP_BLOCK_CLASS = "ship-block";
const SANK_SHIP_BLOCK_CLASS = "sank-ship-block";
const ATTACKED_BLOCK_CLASS = "attacked-block";

function createGridUI(board) {
  const blocks = board.getArray();

  const boardElement = document.createElement("div");
  boardElement.className = "board";
  gridContainer.append(boardElement);

  blocks.forEach((block) => {
    const newElement = document.createElement("div");
    boardElement.append(newElement);
    block.setDOMUpdateCallback(() => {
      updateBlockElement(newElement, block);
    });
    newElement.addEventListener("click", () => {
      block.attack();
    });
  });
  console.log("Created grid UI");
}

// gameBoardElement here is undefined
// the update grid method should only update
// the specific board
// boards are made dynamically in the
// createGridUI function

// function updateGrid(board) {
//   const childArr = gameBoardElement.children;

//   for (let i = 0; i < childArr.length; i++) {
//     if (!board.clickable) {
//       console.log("removing event listener");
//       childArr[i].style = "pointer-events: none";
//     } else {
//       childArr[i].style = "pointer-events: auto";
//     }
//     if (board.shipsHidden) {
//       childArr[i].classList.remove(SHIP_BLOCK_CLASS);
//     }
//   }
//   console.log("updated grid");
// }

function updateBlockElement(element, block) {
  element.classList.forEach((item) => {
    element.classList.remove(item);
  });
  element.classList.add(BLOCK_CLASS);
  if (block.isHaveShip) {
    if (block.ship.isSank) {
      element.classList.add(SANK_SHIP_BLOCK_CLASS);
    } else {
      if (!block.getGameBoard.isShipsHidden()) {
        element.classList.add(SHIP_BLOCK_CLASS);
      }
    }
  } else {
    if (block.isAttacked) {
      element.classList.add(ATTACKED_BLOCK_CLASS);
    }
  }
  console.log("Updated block");
}

export { createGridUI };
