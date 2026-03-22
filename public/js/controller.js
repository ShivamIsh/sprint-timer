import { updateStatus, updateTimer, getFiles, getVideo } from "./ui.js";
import { loadDetectionModel, detectPersons } from "../models/detectionModel.js";
import { loadFeatureModel, extractFeature } from "../models/featureModel.js";
import { cosineSimilarity } from "../utils/similarity.js";
import { image } from "@tensorflow/tfjs";


let identityFeatures = [];
let uploadedPaths = [];


export async function init() {
  updateStatus("Loading models...");
  await loadDetectionModel();
  await loadFeatureModel();
  updateStatus("Ready");
}

export async function uploadImages() {
  const files = getFiles();
  const formData = new FormData();

  for (let file of files) {
    formData.append("images", file);
  }

  const res = await fetch("/upload",{
    method: "POST",
    body: formData
  })
  const data = await res.json();
  uploadedPaths = data.files;
  updateStatus("Uploaded!");


}


export async function buildIdentity(){
    identityFeatures = [];

    for(let path of uploadedPaths){
        let img = new Image();
        img.src = path;

        await new Promise(r => img.onload = r);
        identityFeatures.push(extractFeature(image))
    }

    updateStatus("Identity Ready!");
}

async function startCamera(){
    const video = getVideo();
    const stream = await navigator.mediaDevices.getUserMedia({video: true});
    video.srcObject = stream;
    return video;
}


export async function startRace(){
    const video = await startCamera();
    updateStatus("On your marks"); await sleep(2000);
    updateStatus("Set"); await sleep(1000);
    updateStatus("Go!");

    let start = Date.now();
    const interval = setInterval(async ()=>{
        updateTimer(((Date.now() - start)/1000).toFixed(2));
        const persons = await detectPersons(video);

        for(let p of persons){
            const [x, y, w, h] = p.bbox;
            let canvas = document.createElement("canvas");
            canvas.width = w;
            canvas.geight = h;
            canvas.getContext("2D").drawImage(video, x,y,w,h,0,0,w,h);

            let feat = extractFeature(canvas);
            for(let idFeat of identityFeatures){
                let sim = cosineSimilarity(feat, idFeat);
                if(sim >0.7){
                    let center = (x+w)/2;
                    let width = video.videoWidth;

                    if (center > width * 0.4 && center < width * 0.6) {
                        clearInterval(interval);
                        updateStatus("Finished!");
                        return;
                    }


                }
            }

        }
    }, 100);


}



function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

