import "./style.css";
import { startPlayerVsRobot } from "./playerVSRobot.js";
import "./UI.js";
import "drag-drop-system";
import "./dragAndDropShip.js";

document.body.addEventListener("dragstart", (ev) => {
  ev.preventDefault();
});

startPlayerVsRobot();
