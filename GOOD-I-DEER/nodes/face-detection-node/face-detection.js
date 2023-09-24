module.exports = function (RED) {
  function yolov8NodeFace(config) {
    RED.nodes.createNode(this, config);
    const ort = require("onnxruntime-node");
    const sharp = require("sharp");
    const fs = require("fs");

    const node = this;
    const returnType = Number(config.returnType);
    const saveDir = config.absolutePathDir;
    let bufferFromImage;

    let model;

    node.on("input", async function (msg) {
      try {
        if (model === undefined) {
          model = await ort.InferenceSession.create(
            `${__dirname}/../model/yolov8n-face.onnx`
          );
        }
        bufferFromImage = msg.payload;
        const img = sharp(bufferFromImage);
        const boxes = await detect_face_on_image_informations(img);
        msg.buff = msg.payload;
        if (returnType === 0) {
          msg.payload = boxes;
        } else if (returnType === 1) {
          msg.payload = await get_image_buffers(boxes);
        } else if (returnType === 2) {
          if (fs.existsSync(saveDir)) {
            msg.payload = await save_images(boxes);
          } else {
            msg.payload = [];
            node.error("folder dosen't exists");
          }
        }
        node.send(msg);
      } catch (error) {
        node.log(error);
      }
    });

    async function detect_face_on_image_informations(img) {
      const [input, img_width, img_height] = await prepare_input(img);
      const output = await run_model(input);
      const boxes = process_output(output, img_width, img_height);
      return get_image_informations(boxes);
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

    function get_image_informations(boxes) {
      const result = [];
      boxes.forEach((box) => {
        const info = {
          label: box[4],
          x: box[0],
          y: box[1],
          w: box[2] - box[0],
          h: box[3] - box[1],
          prob: box[5],
        };
        result.push(info);
      });
      return result;
    }

    async function get_image_buffers(boxes) {
      const result = [];
      await Promise.all(
        boxes.map(async (box) => {
          try {
            const buffer = await makeBuffer(box);
            result.push(buffer);
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
      let paths = [];
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
      await Promise.all(
        boxes.map(async (box) => {
          const imageName = dateformat + "_" + "face" + faceCount++ + ".png";
          const outputImage = saveDir + "/" + imageName;
          await sharp(bufferFromImage)
            .extract({
              width: parseInt(box.w),
              height: parseInt(box.h),
              left: parseInt(box.x),
              top: parseInt(box.y),
            })
            .toFile(outputImage)
            .then(() => paths.push(imageName))
            .catch(() =>
              node.error("An error occured, when image cropped and saved")
            );
        })
      );
      return paths.sort();
    }

    async function makeBuffer(box) {
      const buffer = await sharp(bufferFromImage)
        .extract({
          width: parseInt(box.w),
          height: parseInt(box.h),
          left: parseInt(box.x),
          top: parseInt(box.y),
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
