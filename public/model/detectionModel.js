//import * as cocoSsd from "@tensorflow-models/coco-ssd";

let model;

export async function loadDetectionModel(){
    model = await cocoSsd.load();
}

export async function detectPersons(video){
    const predictions = await model.detect(video);

    return predictions.filter(p => p.class ==="person");
}

