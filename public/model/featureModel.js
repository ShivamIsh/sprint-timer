let mobilenet;
//import * as tf from "@tensorflow/tfjs";


export async function loadFeatureModel(){
    mobilenet = await tf.loadGraphModel(
        "https://tfhub.dev/google/tfjs-model/imagenet/mobilenet_v2_100_224/feature_vector/4/default/1",
        {fromTFHub: true}

    )
}


export function extractFeature(img){
    return tf.tidy(()=>{
        let tensor = tf.browser.fromPixels(img)
        .resizeNearestNeighbor([224, 224])
        .toFloat()
        .expandDims();


    return mobilenet.predict(tensor);
    })
}