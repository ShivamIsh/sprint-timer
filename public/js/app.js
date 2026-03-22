import {init, uploadImages, buildIdentity, startRace} from "./controller.js";


import { init, uploadImages, buildIdentity, startRace } from "./controller.js";

window.onload = () => {
  init();

  document.getElementById('uploadBtn').addEventListener('click', uploadImages);
  document.getElementById('buildBtn').addEventListener('click', buildIdentity);
  document.getElementById('startBtn').addEventListener('click', startRace);
};