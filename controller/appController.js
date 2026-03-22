import { loadDetectionModel, detectPersons } from "../public/model/detectionModel.js";
import { loadFeatureModel, extractFeature } from "../public/model/featureModel.js";
import { cosineSimilarity } from "../public/utils/similarity.js";
import { updateStatus, updateTimer, getFiles, getVideoElement } from "../public/js/ui.js";


let identityFeatures = [];

// load model

export async function init(){
    updateStatus("loading Model...")
    await loadDetectionModel();
    await loadFeatureModel();
    updateStatus("ready");
}


export async function uploadImages() {
  const files = getFiles();
  const formData = new FormData();

  for (let file of files) {
    formData.append("images", file);
  }

  await fetch("/upload", {
    method: "POST",
    body: formData
  });

  updateStatus("Uploaded!");
}


// build identity


