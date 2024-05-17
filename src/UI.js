import { startGame } from "./roundsManager.js";

const startBtn = document.querySelector(".start-btn");

startBtn.addEventListener("click", () => {
  startGame();
  startBtn.style = "visibility: hidden;";
});
