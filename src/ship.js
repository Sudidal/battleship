class Ship {
  #sank = false;
  #fleetSank = false;
  constructor(pos, gameBoard, fleet) {
    this.myBlock = gameBoard.getBlock(pos[0], pos[1]);
    this.myBlock.placeShip(this);
    this.fleet = fleet;
  }
  get isSank() {
    return this.#sank;
  }
  get isFleetSank() {
    return this.#fleetSank;
  }
  get getFleet() {
    return this.fleet;
  }
  get block() {
    return this.myBlock;
  }
  sink() {
    this.#sank = true;
    this.fleet.loseShip();
  }
  fleetHasSank() {
    this.#fleetSank = true;
    this.myBlock.fleetHasSank();
  }
}

export default Ship;
