module.exports = function (RED) {
  function yolov8NodeFace(config) {
    RED.nodes.createNode(this, config);
    const ort = require("onnxruntime-node");
    const sharp = require("sharp");
    const fs = require("fs");

    const node = this;
    const returnValue = Number(config.returnValue);
    const saveDir = config.absolutePathDir;
    let bufferFromImage;

    let model;

    node.on("input", async function (msg) {
      this.status({ fill: "blue", shape: "dot", text: "processing..." });

      try {
        if (model === undefined) {
          model = await ort.InferenceSession.create(
            `${__dirname}/../model/yolov8n-face.onnx`
          );
        }

        if (returnValue === 2 && fs.existsSync(saveDir) === false) {
          this.status({ fill: "red", shape: "ring", text: "fail" });
          node.error("folder dosen't exists");
          return;
        }

        bufferFromImage = msg.payload;
        const img = sharp(bufferFromImage);
        const boxes = await detect_faces_on_image(img);
        msg.payload = {};
        msg.payload.originImg = bufferFromImage;
        if (returnValue === 0) {
          msg.payload.data = get_detected_faces(boxes);
        } else if (returnValue === 1) {
          msg.payload.data = await get_image_buffers(boxes);
        } else if (returnValue === 2) {
          msg.payload.data = await save_images(boxes);
        }
        node.send(msg);
        this.status({});
      } catch (error) {
        node.log(error);
      }
    });

    async function detect_faces_on_image(img) {
      const [input, img_width, img_height] = await prepare_input(img);
      const output = await run_model(input);
      return process_output(output, img_width, img_height);
    }

    async function prepare_input(img) {
      const md = await img.metadata();

      const [img_width, img_height] = [md.width, md.height];
      const pixels = await img
        .removeAlpha()
        .resize({ width: 640, height: 640, fit: "fill" })
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
      return [input, img_width, img_height];
    }

    async function run_model(input) {
      input = new ort.Tensor(Float32Array.from(input), [1, 3, 640, 640]);
      const outputs = await model.run({ images: input });
      return outputs["output0"].data;
    }

    function process_output(output, img_width, img_height) {
      let boxes = [];
      for (let index = 0; index < 8400; index++) {
        const prob = output[8400 * 4 + index];
        if (prob < config.threshold) {
          continue;
        }
        const label = "face";
        const xc = output[index];
        const yc = output[8400 + index];
        const w = output[2 * 8400 + index];
        const h = output[3 * 8400 + index];
        const x1 = ((xc - w / 2) / 640) * img_width;
        const y1 = ((yc - h / 2) / 640) * img_height;
        const x2 = ((xc + w / 2) / 640) * img_width;
        const y2 = ((yc + h / 2) / 640) * img_height;
        boxes.push([x1, y1, x2, y2, label, prob]);
      }

      boxes = boxes.sort((box1, box2) => box2[5] - box1[5]);
      let result = [];
      while (boxes.length > 0) {
        result.push(boxes[0]);
        boxes = boxes.filter((box) => iou(boxes[0], box) < 0.7);
      }
      return result;
    }

    function get_detected_faces(boxes) {
      const result = { face: [] };
      boxes.forEach((box) => {
        const info = {
          x: box[0],
          y: box[1],
          w: box[2] - box[0],
          h: box[3] - box[1],
          prob: box[5],
        };

        result["face"].push(info);
      });
      return result;
    }

    async function get_image_buffers(boxes) {
      const result = { face: [] };
      await Promise.all(
        boxes.map(async (box) => {
          try {
            const buffer = await makeBuffer(box);
            result["face"].push(buffer);
          } catch (error) {
            node.error("An error occured, when image cropped");
          }
        })
      );
      return result;
    }

    async function save_images(boxes) {
      let faceCount = 1;
      const today = new Date();
      const dateformat =
        today.getFullYear() +
        (today.getMonth() + 1 < 10
          ? "0" + (today.getMonth() + 1)
          : today.getMonth() + 1) +
        (today.getDate() < 10 ? "0" + today.getDate() : today.getDate()) +
        (today.getHours() < 10 ? "0" + today.getHours() : today.getHours()) +
        (today.getMinutes() < 10
          ? "0" + today.getMinutes()
          : today.getMinutes()) +
        (today.getSeconds() < 10
          ? "0" + today.getSeconds()
          : today.getSeconds());

      const result = { face: [] };
      await Promise.all(
        boxes.map(async (box) => {
          const imageName = dateformat + "_" + "face" + faceCount++ + ".png";
          const outputImage = saveDir + "/" + imageName;
          await sharp(bufferFromImage)
            .extract({
              width: parseInt(box[2] - box[0]),
              height: parseInt(box[3] - box[1]),
              left: parseInt(box[0]),
              top: parseInt(box[1]),
            })
            .toFile(outputImage)
            .then(() => result["face"].push(imageName))
            .catch(() =>
              node.error("An error occured, when image cropped and saved")
            );
        })
      );

      for (let key in result) {
        result[key].sort((name1, name2) => {
          return name1.length - name2.length || name1.localeCompare(name2);
        });
      }
      return result;
    }

    async function makeBuffer(box) {
      const buffer = await sharp(bufferFromImage)
        .extract({
          width: parseInt(box[2] - box[0]),
          height: parseInt(box[3] - box[1]),
          left: parseInt(box[0]),
          top: parseInt(box[1]),
        })
        .toFormat("png")
        .toBuffer();

      return buffer;
    }

    function iou(box1, box2) {
      return intersection(box1, box2) / union(box1, box2);
    }

    function union(box1, box2) {
      const [box1_x1, box1_y1, box1_x2, box1_y2] = box1;
      const [box2_x1, box2_y1, box2_x2, box2_y2] = box2;
      const box1_area = (box1_x2 - box1_x1) * (box1_y2 - box1_y1);
      const box2_area = (box2_x2 - box2_x1) * (box2_y2 - box2_y1);
      return box1_area + box2_area - intersection(box1, box2);
    }

    function intersection(box1, box2) {
      const [box1_x1, box1_y1, box1_x2, box1_y2] = box1;
      const [box2_x1, box2_y1, box2_x2, box2_y2] = box2;
      const x1 = Math.max(box1_x1, box2_x1);
      const y1 = Math.max(box1_y1, box2_y1);
      const x2 = Math.min(box1_x2, box2_x2);
      const y2 = Math.min(box1_y2, box2_y2);
      return (x2 - x1) * (y2 - y1);
    }
  }

  RED.nodes.registerType("good-face-detection", yolov8NodeFace);
};
