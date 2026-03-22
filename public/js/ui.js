export function updateStatus(text) {
  document.getElementById("status").innerText = text;
}

export function updateTimer(val) {
  document.getElementById("timer").innerText = val;
}

export function getFiles() {
  return document.getElementById("images").files;
}

export function getVideo() {
  return document.getElementById("video");
}