import {
  setDefaultBehaviour,
  dragElement,
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
  requestBlock(dragEv.target, onReceiveBlockDrag);
}
function moveFleet(moveEv, draggedElement, posX, posY, moveFunction) {
  requestBlock(moveEv.target, (moveBlock) => {
    onReceiveBlockMove(draggedElement, moveBlock, posX, posY, moveFunction);
  });
}
function dropFleet(dropEv, draggedElement) {
  event = null;
  const dropElement = dropEv.target;
  requestBlock(dropElement, (dropBlock) => {
    onReceiveBlockDrop(dropElement, draggedElement, dropBlock, draggedBlock);
  });
}

function onReceiveBlockDrag(block) {
  draggedBlock = block;
  const fleet = block.getShip.getFleet;
  const dir = fleet.getDirection();
  const allShipsArr = fleet.getShips();
  const allShipsElement = document.createElement("div");
  event.target.parentElement.append(allShipsElement);

  allShipsArr.forEach((ship) => {
    const shipElement = ship.block.getDOMElement;
    const shipElementCopy = shipElement.cloneNode(true);
    allShipsElement.append(shipElementCopy);
  });

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
}

function onReceiveBlockMove(element, moveBlock, posX, posY, moveFunction) {
  const pos = moveBlock.getPos();
  const valid = checkBlockValidity(
    draggedBlock.getGameBoard,
    draggedBlock.getShip.getFleet,
    pos,
  );
  if (valid) {
    element.style.border = "1px solid green";
  } else {
    element.style.border = "1px solid red";
  }
  moveFunction(element, posX, posY);
}

function onReceiveBlockDrop(
  dropElement,
  draggedElement,
  dropBlock,
  draggedBlock,
) {
  const fleet = draggedBlock.getShip.getFleet;
  const pos = dropBlock.getPos();
  const valid = checkBlockValidity(draggedBlock.getGameBoard, fleet, pos);
  if (valid) {
    fleet.initialize(pos);
  }
  draggedElement.remove();
  draggedBlock = null;
}
