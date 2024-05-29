import "./style.css";
import "./UI.js";
import "drag-drop-system";
import "./dragAndDropShip.js";
import { startPlayerVsRobot } from "./playerVSRobot.js";

document.body.addEventListener("dragstart", (ev) => {
  ev.preventDefault();
});

startPlayerVsRobot();
