import { createGameBoard } from "./initializer.js";
import { autoPlayer } from "./autoPlayer.js";

const playerBoard = createGameBoard(false, false);
const botBoard = createGameBoard(true, true);

const bot = new autoPlayer(botBoard, playerBoard);

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

playerTurn();

function playerTurn() {
  console.log("it's player's turn");
  playerBoard.setClickableShipsHidden(false, false);
  botBoard.setClickableShipsHidden(true, true);
}
function botTurn() {
  console.log("it's bot's turn");
  playerBoard.setClickableShipsHidden(false, false);
  botBoard.setClickableShipsHidden(false, true);
  bot.chooseBlock();
}
function End() {
  playerBoard.setClickableShipsHidden(false, false);
  botBoard.setClickableShipsHidden(false, false);
}
