function removeUnavailableBlocks(availableArr, blocksArr) {
  for (let i = 0; i < availableArr.length; i++) {
    const index = availableArr[i];
    if (blocksArr[index].isSafe || blocksArr[index].isAttacked) {
      availableArr.splice(i, 1);
    }
  }
}

export default removeUnavailableBlocks;
