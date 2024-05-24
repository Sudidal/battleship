import {
  setDefaultBehaviour,
  dragElement,
  setDragCallBack,
  setDropCallBack,
} from "drag-drop-system";
import { requestBlock } from "./boardUI.js";

let event = null;
let draggedBlock = null;

setDefaultBehaviour(false);
setDragCallBack(dragFleet);
setDropCallBack(dropFleet);

function dragFleet(dragEv) {
  event = dragEv;
  requestBlock(dragEv.target, onReceiveBlockDrag);
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

function onReceiveBlockDrop(
  dropElement,
  draggedElement,
  dropBlock,
  draggedBlock,
) {
  const fleet = draggedBlock.getShip.getFleet;
  const pos = [dropBlock.getX(), dropBlock.getY()];
  fleet.initialize(pos);
  draggedElement.remove();
  draggedBlock = null;
}
