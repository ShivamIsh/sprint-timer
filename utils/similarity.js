import * as tf from "@tensorflow/tfjs";

export function cosineSimilarity(a, b) {
  return tf.tidy(() => {
    const dot = tf.sum(tf.mul(a, b));
    const normA = tf.norm(a);
    const normB = tf.norm(b);
    return dot.div(normA.mul(normB)).dataSync()[0];
  });
}
