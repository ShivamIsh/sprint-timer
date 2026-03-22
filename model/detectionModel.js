import * as cocoSsd from "@tensirflow-models/coco-ssd";

let model;

export async function loadDetectionModel(){
    model = await cocoSsd.load();
}

export async function detectPersons(video){
    const predections = await model.detect(video);

    return prediction.filter(p => p.class ==="person");
}

