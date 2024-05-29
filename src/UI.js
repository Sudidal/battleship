import { reloadPage } from "./reloadPage.js";
import { startGame } from "./playerVSRobot.js";

const startBtn = document.querySelector(".start-btn");
const message = document.querySelector(".message");

startBtn.addEventListener("click", () => {
  startGame();
  startBtn.style.visibility = "hidden";
});

message.textContent =
  "drag and drop red blocks to create your alignment, then press start";

function displayInstructions() {
  message.textContent = "Find enemy's fleets and destroy them";
}

function UIGameEnd(winner) {
  startBtn.addEventListener("click", () => {
    reloadPage();
  });
  startBtn.style.visibility = "visible";
  message.style.fontWeight = "bold";
  if (winner === "player") {
    message.textContent = "You Won!";
    message.style.color = "green";
  } else if (winner === "bot") {
    message.textContent = "You Lose";
    message.style.color = "red";
  }
}

export { displayInstructions, UIGameEnd };
