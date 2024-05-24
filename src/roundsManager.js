import { createGameBoard } from "./initializer.js";
import { autoPlayer } from "./autoPlayer.js";

const playerBoard = createGameBoard(false, false, true);
const botBoard = createGameBoard(false, true, false);
playerBoard.ready();
botBoard.ready();

const bot = new autoPlayer(botBoard, playerBoard);

function startGame() {
  playerTurn();
}

playerBoard.setHitCallback((state) => {
  if (playerBoard.isFinished()) {
    console.log("Bot WON");
    End();
  } else {
    if (state === "ship") {
      botTurn();
    } else {
      playerTurn();
    }
  }
});
botBoard.setHitCallback((state) => {
  if (botBoard.isFinished()) {
    console.log("player WON");
    End();
  } else {
    if (state === "ship") {
      playerTurn();
    } else {
      botTurn();
    }
  }
});

function playerTurn() {
  console.log("it's player's turn");
  playerBoard.setBoardState(false, false, false, false);
  botBoard.setBoardState(true, true, true, false);
}
function botTurn() {
  console.log("it's bot's turn");
  playerBoard.setBoardState(false, false, true, false);
  botBoard.setBoardState(false, true, false, false);
  bot.chooseBlock();
}
function End() {
  playerBoard.setBoardState(false, false, false, false);
  botBoard.setBoardState(false, false, false, false);
}

export { startGame };
