class Block {
  #board;
  #pos;
  #myShip;
  #DOMUpdateCallback;
  #DOMEelement;
  #attacked = false;
  #safe = false;
  #haveShip = false;

  constructor(x, y, gameBoard) {
    this.#board = gameBoard;
    this.#pos = [x, y];
  }

  getPos() {
    return this.#pos;
  }
  get getGameBoard() {
    return this.#board;
  }
  get isAttacked() {
    return this.#attacked;
  }
  get isSafe() {
    return this.#safe;
  }
  get isHaveShip() {
    return this.#haveShip;
  }
  get getShip() {
    return this.#myShip;
  }
  get getDOMElement() {
    return this.#DOMEelement;
  }

  attack(bot = false) {
    if (!bot && !this.#board.isClickable()) {
      return;
    }

    if (!this.#attacked && !this.#safe) {
      this.#attacked = true;
      if (this.#haveShip) {
        this.#myShip.sink();
      }
      this.#board.hasBeenAttacked(this);
      this.callDOMUpdateCallback();
    } else if (bot) {
      if (this.#attacked)
        console.error("bot trying to attack already attacked block");
      else if (this.#safe) console.error("bot trying to attack a safe block");
    }
  }
  markSafe() {
    if (!this.#attacked && !this.#safe) {
      console.log(`Safe: (${this.#pos[0]}, ${this.#pos[1]})`);
      this.#safe = true;
      this.callDOMUpdateCallback();
    }
  }
  placeShip(ship) {
    if (!this.#haveShip) {
      this.#myShip = ship;
      this.#haveShip = true;
      this.#board.addFleet();
      this.callDOMUpdateCallback();
    }
  }
  fleetHasSank() {
    this.callDOMUpdateCallback();
  }
  removeShip() {
    this.#myShip = null;
    this.#haveShip = false;
    this.#board.loseFleet();
    this.callDOMUpdateCallback();
  }
  setDOMInfo(element, callback) {
    this.#DOMUpdateCallback = callback;
    this.#DOMEelement = element;
  }
  callDOMUpdateCallback() {
    if (this.#DOMUpdateCallback) this.#DOMUpdateCallback();
    else console.error("DOMUpdateCallback is not assigned");
  }
}

export default Block;
