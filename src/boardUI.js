const gridContainer = document.querySelector(".grid-container");

const Board_CLASS = "board";
const ACTIVE_Board_CLASS = "active-board";
const INACTIVE_Board_CLASS = "inactive-board";
const BLOCK_CLASS = "block";
const SHIP_BLOCK_CLASS = "ship-block";
const SANK_SHIP_BLOCK_CLASS = "sank-ship-block";
const FLEET_SANK_SHIP_BLOCK_CLASS = "fleet-sank-block";
const ATTACKED_BLOCK_CLASS = "attacked-block";
const SAFE_BLOCK_CLASS = "safe-block";

function createGridUI(board) {
  const blocks = board.getArray();

  const boardElement = document.createElement("div");
  boardElement.className = "board";
  gridContainer.append(boardElement);
  board.setDOMCallback(() => {
    updateBoardElement(board, boardElement)
  })

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

function updateBlockElement(element, block) {
  element.removeAttribute("class");

  element.classList.add(BLOCK_CLASS);
  if (block.isHaveShip) {
    if (block.ship.isSank) {
      if (block.ship.isFleetSank) {
        element.classList.add(FLEET_SANK_SHIP_BLOCK_CLASS);
      } else {
        element.classList.add(SANK_SHIP_BLOCK_CLASS);
      }
    } else {
      if (!block.getGameBoard.isShipsHidden()) {
        element.classList.add(SHIP_BLOCK_CLASS);
      }
    }
  } else {
    if (block.isAttacked) {
      element.classList.add(ATTACKED_BLOCK_CLASS);
    } else if (block.isSafe) {
      element.classList.add(SAFE_BLOCK_CLASS);
    }
  }

  console.log("Updated block");
}

function updateBoardElement(board, boardElement) {
  boardElement.removeAttribute("class")
  boardElement.classList.add(Board_CLASS)
  if(board.isActive()) {
    boardElement.classList.add(ACTIVE_Board_CLASS)
  }
  else {
    boardElement.classList.add(INACTIVE_Board_CLASS)
  }
}

export { createGridUI };
