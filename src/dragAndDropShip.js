import {
  setDefaultBehaviour,
  dragElement,
  setElementPostion,
  setDragCallBack,
  setMoveCallback,
  setDropCallBack,
} from "drag-drop-system";
import { requestBlock } from "./boardUI.js";
import checkBlockValidity from "./checkBlockValidity.js";

let event = null;
let draggedBlock = null;

setDefaultBehaviour(false);
setDragCallBack(dragFleet);
setMoveCallback(moveFleet);
setDropCallBack(dropFleet);

function dragFleet(dragEv) {
  event = dragEv;
  requestBlock(dragEv.target, (block) => {
    onReceiveBlockDrag(block, dragEv.target);
  });
}
function moveFleet(moveEv, movedElement, posX, posY) {
  if (moveEv.target.classList.contains("block"))
    requestBlock(moveEv.target, (moveBlock) => {
      onReceiveBlockMove(moveBlock, movedElement, posX, posY);
    });
  else onReceiveBlockMove(null, movedElement, posX, posY);
}
function dropFleet(dropEv, draggedElement) {
  event = null;
  const dropElement = dropEv.target;
  if (dropElement.classList.contains("block"))
    requestBlock(dropElement, (dropBlock) => {
      onReceiveBlockDrop(dropElement, draggedElement, dropBlock, draggedBlock);
    });
  else onReceiveBlockDrop(dropElement, draggedElement, null, draggedBlock);
}

function onReceiveBlockDrag(block, element) {
  draggedBlock = block;
  const fleet = block.getShip.getFleet;
  const dir = fleet.getDirection();
  const allShipsArr = fleet.getShips();
  const allShipsElement = document.createElement("div");
  event.target.parentElement.append(allShipsElement);

  allShipsArr.forEach((ship) => {
    const shipElement = ship.block.getDOMElement;
    const shipElementCopy = shipElement.cloneNode(true);
    shipElementCopy.className = "floaty-block";
    allShipsElement.append(shipElementCopy);
  });
  console.log("clone");

  let sizeX = getComputedStyle(allShipsElement).width;
  let sizeY = getComputedStyle(allShipsElement).height;
  let dirString = "";
  if (dir) {
    const temp = sizeX;
    sizeX = sizeY;
    sizeY = temp;
    dirString = "row";
  } else {
    dirString = "column";
  }
  allShipsElement.style.display = "flex";
  allShipsElement.style.position = "absolute";
  allShipsElement.style.pointerEvents = "none";
  allShipsElement.style.flexDirection = `${dirString}`;
  allShipsElement.style.width = sizeX;
  allShipsElement.style.height = sizeY;
  const obj = {
    target: allShipsElement,
    pageX: event.pageX,
    pageY: event.pageY,
    offsetX: parseFloat(sizeX) / 2,
    offsetY: parseFloat(sizeY) / 2,
  };

  dragElement(obj);
  onReceiveBlockMove(
    draggedBlock,
    allShipsElement,
    obj.pageX - obj.offsetX,
    obj.pageY - obj.offsetY,
  );
}

function onReceiveBlockMove(moveBlock, moveElement, posX, posY) {
  console.log("moving");
  let valid = false;
  if (moveBlock && moveBlock.getGameBoard === draggedBlock.getGameBoard) {
    const pos = moveBlock.getPos();
    valid = checkBlockValidity(
      draggedBlock.getGameBoard,
      draggedBlock.getShip.getFleet,
      pos,
      draggedBlock,
    );
  }
  if (valid) {
    moveElement.className = "valid-floaty-ship";
  } else {
    moveElement.className = "invalid-floaty-ship";
  }
  console.log("did the job");
  setElementPostion(moveElement, posX, posY);
}

function onReceiveBlockDrop(
  dropElement,
  draggedElement,
  dropBlock,
  draggedBlock,
) {
  const fleet = draggedBlock.getShip.getFleet;
  if (dropBlock) {
    const pos = dropBlock.getPos();
    const valid = checkBlockValidity(draggedBlock.getGameBoard, fleet, pos);
    if (valid) {
      fleet.initialize(pos);
    }
  }
  draggedElement.remove();
  draggedBlock = null;
}
