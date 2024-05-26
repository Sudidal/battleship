function getSorroundingBlocks(board, pos, cross, linear) {
  const x = pos[0];
  const y = pos[1];
  const sorroundings = Array();

  if (linear) {
    // right
    const right = board.getBlock(x + 1, y);
    if (right) {
      sorroundings.push(right);
    }
    // left
    const left = board.getBlock(x - 1, y);
    if (left) {
      sorroundings.push(left);
    }
    // up
    const up = board.getBlock(x, y - 1);
    if (up) {
      sorroundings.push(up);
    }
    // down
    const down = board.getBlock(x, y + 1);
    if (down) {
      sorroundings.push(down);
    }
  }

  if (cross) {
    // upper right
    const upperRight = board.getBlock(x + 1, y - 1);
    if (upperRight) {
      sorroundings.push(upperRight);
    }
    // upper left
    const upperLeft = board.getBlock(x - 1, y - 1);
    if (upperLeft) {
      sorroundings.push(upperLeft);
    }
    // bottom right
    const bottomRight = board.getBlock(x + 1, y + 1);
    if (bottomRight) {
      sorroundings.push(bottomRight);
    }
    // bottom left
    const bottomLeft = board.getBlock(x - 1, y + 1);
    if (bottomLeft) {
      sorroundings.push(bottomLeft);
    }
  }
  return sorroundings;
}

export default getSorroundingBlocks;
