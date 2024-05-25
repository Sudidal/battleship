import checkBlockValidity from "./checkBlockValidity.js";

function randomPosition(board, fleet, triedCoords = null) {
  // console.log(triedCoords);
  if (triedCoords) {
    if (triedCoords.length < 1) {
      return null;
    }
  } else {
    triedCoords = Array(board.getLength());
    for (let i = 0; i < triedCoords.length; i++) {
      triedCoords[i] = i;
    }
  }
  const randomIndex = Math.floor(Math.random() * (triedCoords.length - 1));
  const block = board.getArray()[randomIndex];
  let x;
  let y;
  if (block) {
    x = block.getX();
    y = block.getY();
  }
  const valid = checkBlockValidity(board, fleet, [x, y]);
  if (valid) {
    // console.log(`(${x}, ${y})`);
    return [x, y];
  } else {
    // console.log(`invalid, choosing another coord: (${x}, ${y})`);
    triedCoords.splice(randomIndex, 1);
    return randomPosition(board, fleet, triedCoords);
  }
}

function randomAlign() {
  const random = Math.floor(Math.random() * 2);
  if (random === 1) return true;
  else return false;
}

export { randomPosition, randomAlign };
