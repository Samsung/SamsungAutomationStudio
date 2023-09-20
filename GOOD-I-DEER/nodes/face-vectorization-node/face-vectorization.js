module.exports = function (RED) {
  function FaceVectorizationNode(config) {
    RED.nodes.createNode(this, config);

    this.on("input", async function (msg) {
      const tf = require("@tensorflow/tfjs-node");
      const { createCanvas, loadImage } = require("canvas");

      async function loadFaceNetModel(modelPath) {
        const model = await tf.loadLayersModel(`file://${modelPath}`);
        return model;
      }

      async function getFaceEmbedding(model, imagePath) {
        const img = await loadImage(imagePath);
        const canvas = createCanvas(160, 160);
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, 160, 160);

        const tensor = tf.node.encodePng(canvas);
        const normalizedTensor = tf.div(tensor, 255.0);
        const batchedTensor = normalizedTensor.expandDims(0);

        const predictions = await model.predict(batchedTensor);
        const embedding = predictions.dataSync();

        return embedding;
      }

      const modelPath = "./model/20180402-114759.pb";
      const imagePath = msg.payload;

      const model = await loadFaceNetModel(modelPath);
      const embedding = await getFaceEmbedding(model, imagePath);

      msg.payload = embedding;
      this.send(msg);
    });
  }
  RED.nodes.registerType("face-vectorization", FaceVectorizationNode);
};
