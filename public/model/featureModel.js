let model;
//import * as tf from "@tensorflow/tfjs";


export async function loadFeatureModel(){
    //mobilenet = await tf.loadGraphModel(
        //"https://tfhub.dev/google/tfjs-model/imagenet/mobilenet_v2_100_224/feature_vector/4/default/1",
        //"https://storage.googleapis.com/tfjs-models/tfjs/mobilenet_v2_100_224/model.json",
        //{fromTFHub: true}

    //)

    model = await mobilenet.load();
    console.log(model);
    console.log("model loaded")

}

/*
export function extractFeature(img){
    return tf.tidy(()=>{
        let tensor = tf.browser.fromPixels(img)
        .resizeNearestNeighbor([224, 224])
        .toFloat()
        .expandDims();


    return mobilenet.predict(tensor);
    })
}

*/



export async function extractFeature(img) {
    if (!model) {
    throw new Error("Model not loaded yet");
  }
  const embedding = model.infer(img, true); // true = feature vector
  console.log(embedding);
  return embedding;
}

