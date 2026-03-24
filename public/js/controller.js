import { updateStatus, updateTimer, getFiles, getVideo } from "./ui.js";
import { loadDetectionModel, detectPersons } from "../model/detectionModel.js";
import { loadFeatureModel, extractFeature } from "../model/featureModel.js";
import { cosineSimilarity } from "../utils/similarity.js";
//import { image } from "@tensorflow/tfjs";

console.log("Controller loaded");
let raceInterval = null;
let startTime = null;
let endTime = null;


let identityFeatures = [];
let uploadedPaths = [];


 async function init() {
  updateStatus("Loading models...");
  await loadDetectionModel();
  await loadFeatureModel();
  updateStatus("Ready");


}

 async function uploadImages() {
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
  document.getElementById("buildBtn").disabled = false;


}


 async function buildIdentity(){
    identityFeatures = [];

    for(let path of uploadedPaths){
        let img = new Image();
        img.src = path;
        

        await new Promise(r => img.onload = r);

         // 🔥 Detect persons in image
        const persons = await detectPersons(img);

        if (persons.length === 0) {
            console.warn("No person detected in:", path);
            continue;
        }

        // 👉 Take first detected person
        const [x, y, w, h] = persons[0].bbox;

        // 🔥 Crop person
        let canvas = document.createElement("canvas");
        canvas.width = w;
        canvas.height = h;

        canvas.getContext("2d").drawImage(img, x, y, w, h, 0, 0, w, h);
        identityFeatures.push(await extractFeature(canvas))
    }

    console.log("identity built");
    document.getElementById("startBtn").disabled = false;
    updateStatus("Identity Ready!");

}


async function startCamera(){
    const video = getVideo();
    const stream = await navigator.mediaDevices.getUserMedia({video: true});
    video.srcObject = stream;
    return video;
}


 async function startRace(){
    const video = await startCamera();
    updateStatus("On your marks"); await sleep(2000);
    updateStatus("Set"); await sleep(1000);
    updateStatus("Go!");

    startTime = Date.now();
    raceInterval = setInterval(async ()=>{
        updateTimer(((Date.now() - startTime)/1000).toFixed(2));
        const persons = await detectPersons(video);

        for(let p of persons){
            const [x, y, w, h] = p.bbox;
            let canvas = document.createElement("canvas");
            canvas.width = w;
            canvas.height = h;
            canvas.getContext("2d").drawImage(video, x,y,w,h,0,0,w,h);

            let feat = await extractFeature(canvas);
            for(let idFeat of identityFeatures){
                let sim = cosineSimilarity(feat, idFeat);
                if(sim >0.7){
                    let center = (x+w)/2;
                    let width = video.videoWidth;

                    if (center > width * 0.4 && center < width * 0.6) {
                        clearInterval(raceInterval);
                        raceInterval = null;
                        updateStatus("Finished!");
                        return;
                    }

                }
            }

        }
    }, 150);

}



export function resetRace(){
    // stop interval
    if (raceInterval) {
        clearInterval(raceInterval);
        raceInterval = null;
    }

    // reset timer
    updateTimer("0.00");

    // reset status
    updateStatus("Reset. Ready to start again.");

    // clear bounding boxes (if using test mode)
    const canvas = document.getElementById("overlay");
    if (canvas) {
        const ctx = canvas.getContext("2d");
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
}


document.addEventListener("DOMContentLoaded", function(){
    console.log("started")
    init();
    console.log("initialised")

    document.getElementById('uploadBtn').addEventListener('click', uploadImages);
    document.getElementById('buildBtn').addEventListener('click', buildIdentity);
    document.getElementById('startBtn').addEventListener('click', startRaceWithBoxes);
    document.getElementById('resetBtn').addEventListener('click', resetRace);
})



function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }



// testing 


function drawBoxes(persons, matches, video) {
    const canvas = document.getElementById("overlay");
    const ctx = canvas.getContext("2d");

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < persons.length; i++) {
        const [x, y, w, h] = persons[i].bbox;

        // Green if matched, red otherwise
        if (matches[i]) {
            ctx.strokeStyle = "green";
        } else {
            ctx.strokeStyle = "red";
        }

        ctx.lineWidth = 3;
        ctx.strokeRect(x, y, w, h);
    }
}


export async function startRaceWithBoxes(){
    const video = await startCamera();
    updateStatus("On your marks"); await sleep(2000);
    updateStatus("Set"); await sleep(1000);
    updateStatus("Go!");

    startTime = Date.now();

    raceInterval = setInterval(async ()=>{
        updateTimer(((Date.now() - startTime)/1000).toFixed(2));

        const persons = await detectPersons(video);

        let matches = [];

        for(let p of persons){
            const [x, y, w, h] = p.bbox;

            let canvas = document.createElement("canvas");
            canvas.width = w;
            canvas.height = h;

            canvas.getContext("2d").drawImage(video, x, y, w, h, 0, 0, w, h);

            let feat = await extractFeature(canvas);

            let isMatch = false;

            for(let idFeat of identityFeatures){
                let sim = cosineSimilarity(feat, idFeat);
                if(sim > 0.7){
                    isMatch = true;
                    break;
                }
            }
            if (isMatch) {
            let center = (x + w) / 2;
            let width = video.videoWidth;

            if (center > width * 0.4 && center < width * 0.6) {
                clearInterval(raceInterval);
                raceInterval = null;
                updateStatus("Finished!");
                return;
                }
            }

            matches.push(isMatch);
        }

        drawBoxes(persons, matches);

    }, 150);
}

