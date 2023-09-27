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

      try {
        const vectors = [];
        if (config.inputType == 0) {
          vectors.push(await imageVectorization(inputData));
        } else if (config.inputType == 1) {
          for (let i = 0; i < inputData.length; ++i) {
            vectors.push(await imageVectorization(inputData[i]));
          }
        }

        if (config.returnType == 0) {
          msg.payload = vectors;
          node.send(msg);
        } else if (config.returnType == 1) {
          const filePath = config.path;
          const textData = JSON.stringify(vectors);

          const dir = path.dirname(filePath);

          if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
          }

          if (config.method == 0) {
            fs.writeFileSync(filePath, textData, "utf-8");
          } else if (config.method == 1) {
            let existData = fs.readFileSync(filePath, "utf-8");
            const allData = JSON.parse(existData);
            allData.push(...vectors);
            fs.writeFileSync(filePath, JSON.stringify(allData), "utf-8");
          }
        }
      } catch (error) {
        node.error("An error occurred: " + error.message.split("\n")[0]);
      }
    });

    async function imageVectorization(inputData) {
      try {
        const model = await onnx.InferenceSession.create(modelPath);

        const inputName = model.inputNames[0];

        const inputDims = [1, 3, 224, 224];

        const input = await imageTransfer(inputData);

        const inputTensor = new onnx.Tensor(Float32Array.from(input), inputDims);

        const feeds = {};
        feeds[inputName] = inputTensor;

        const outputData = await model.run(feeds);

        return Array.from(outputData.output.data);
      } catch (error) {
        throw new Error("Image vectorization error: " + error.message.split("\n")[0]);
      }
    }

    async function imageTransfer(inputData) {
      try {
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
      } catch (error) {
        throw new Error("Image transfer error: " + error.message.split("\n")[0]);
      }
    }
  }
  RED.nodes.registerType("face-vectorization", FaceVectorizationNode);
};
