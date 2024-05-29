import { createGameBoard } from "./initializer.js";
import { UIGameEnd } from "./UI.js";
import { autoPlayer } from "./autoPlayer.js";

let playerBoard;
let botBoard;
let bot;

function startPlayerVsRobot() {
  playerBoard = createGameBoard(false, false, true);
  botBoard = createGameBoard(false, true, false);
  bot = new autoPlayer(botBoard, playerBoard);

  playerBoard.setHitCallback((state) => {
    if (playerBoard.isFinished()) {
      End("bot");
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
      End("player");
    } else {
      if (state === "ship") {
        playerTurn();
      } else {
        botTurn();
      }
    }
  });

  playerBoard.ready();
  botBoard.ready();
}

function startGame() {
  playerTurn();
}

function playerTurn() {
  console.log("it's player's turn");
  playerBoard.setBoardState(false, false, false, false);
  botBoard.setBoardState(true, true, true, false);
}
function botTurn() {
  console.log("it's bot's turn");
  playerBoard.setBoardState(false, false, true, false);
  botBoard.setBoardState(false, true, false, false);
  bot.play();
}
function End(winner) {
  playerBoard.setBoardState(false, false, false, false);
  botBoard.setBoardState(false, false, false, false);
  UIGameEnd(winner);
}

export { startPlayerVsRobot, startGame };
