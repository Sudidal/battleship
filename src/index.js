import "./style.css";
import "./roundsManager.js";
import "./UI.js";
import "drag-drop-system";
import "./dragAndDropShip.js";

document.body.addEventListener("dragstart", (ev) => {
  ev.preventDefault();
});
