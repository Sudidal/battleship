function getRandomArbitraryFloat(min, max) {
  return Math.random() * (max - min) + min;
}
function getRandomArbitraryInt(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}

export { getRandomArbitraryInt, getRandomArbitraryFloat };
