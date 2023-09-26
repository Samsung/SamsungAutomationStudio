module.exports = function (RED) {
  const onnx = require("onnxruntime-node");
  const sharp = require("sharp");
  const path = require("path");
  const fs = require("fs");

  function FaceVectorizationNode(config) {
    RED.nodes.createNode(this, config);
    const node = this;

    const currentDir = __dirname;
    const parentDir = path.join(currentDir, "..");
    const modelPath = path.join(parentDir, "model", "facenet-model.onnx");

    node.on("input", async function (msg) {
      const inputData = msg.payload;

      const vectors = [];
      if (config.inputType == 0) {
        vectors.push(await image_vectorization(inputData));
      } else if (config.inputType == 1) {
        for (let i = 0; i < inputData.length; ++i) {
          vectors.push(await image_vectorization(inputData[i]));
        }
      }

      const filePath = config.path;
      const textData = JSON.stringify(vectors);

      const dir = path.dirname(filePath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }

      fs.writeFileSync(filePath, textData, "utf-8");
    });

    async function image_vectorization(inputData) {
      const model = await onnx.InferenceSession.create(modelPath);

      const inputName = model.inputNames[0];

      const inputDims = [1, 3, 224, 224];

      const input = await image_transfer(inputData);

      const inputTensor = new onnx.Tensor(Float32Array.from(input), inputDims);

      const feeds = {};
      feeds[inputName] = inputTensor;

      const outputData = await model.run(feeds);

      return Array.from(outputData.output.data);
    }

    async function image_transfer(inputData) {
      const img = sharp(inputData);

      const pixels = await img
        .removeAlpha()
        .resize({ width: 224, height: 224, fit: "fill" })
        .raw()
        .toBuffer();

      const red = [],
        green = [],
        blue = [];

      for (let index = 0; index < pixels.length; index += 3) {
        red.push(pixels[index] / 255.0);
        green.push(pixels[index + 1] / 255.0);
        blue.push(pixels[index + 2] / 255.0);
      }

      const input = [...red, ...green, ...blue];

      return input;
    }
  }
  RED.nodes.registerType("face-vectorization", FaceVectorizationNode);
};
