module.exports = function (RED) {
  // 'use strict'

  function yolov8Node(config) {
    RED.nodes.createNode(this, config);
    const ort = require("onnxruntime-node");
    const sharp = require("sharp");

    const node = this;
    const modelName = config.model;

    // console.log("====================================");
    // console.log(RED);
    // console.log(RED.server);
    // console.log(RED.httpNode);
    // console.log(RED.httpAdmin);
    // console.log("====================================");

    node.on("input", async function (msg) {
      const buf = msg.payload;
      // let start = new Date();
      const boxes = await detect_objects_on_image(msg, buf);
      // let end = new Date();
      // console.log(end - start, "ms");
      // node.send(boxes);
      msg.payload = boxes;
      //   console.log(boxes);
      node.send(msg);
    });

    async function detect_objects_on_image(msg, buf) {
      // =================================================================
      // print("buf", buf);c

      const [input, img_width, img_height] = await prepare_input(buf);
      const output = await run_model(input);
      return process_output(output, img_width, img_height);
      // msg.payload = process_output(output, img_width, img_height);

      //   return "hi";
    }

    async function prepare_input(buf) {
      const img = sharp(buf);
      // print("img", img);
      const md = await img.metadata();

      // print("md", md);

      const [img_width, img_height] = [md.width, md.height];
      const pixels = await img
        .removeAlpha()
        .resize({ width: 640, height: 640, fit: "fill" })
        .raw()
        .toBuffer();
      // print("pixels",pixels)
      // console.log("pixels.length: " + pixels.length);
      const red = [],
        green = [],
        blue = [];
      for (let index = 0; index < pixels.length; index += 3) {
        red.push(pixels[index] / 255.0);
        green.push(pixels[index + 1] / 255.0);
        blue.push(pixels[index + 2] / 255.0);
      }
      const input = [...red, ...green, ...blue];
      // print("input", input);
      // console.log("input.length: " + input.length);
      return [input, img_width, img_height];
    }

    async function run_model(input) {
      // console.log(__filename);
      // console.log(__dirname);
      // console.log(process.cwd());
      const model = await ort.InferenceSession.create(`${__dirname}/model/${modelName}.onnx`);
      // print("model", model);
      // print("input", input);
      // print("Float32Array", Float32Array.from(input));
      // new ort.Tensor(Float64Array.from(input), )
      input = new ort.Tensor(Float32Array.from(input), [1, 3, 640, 640]);
      // input = new ort.Tensor(input, [1, 3, 640, 640]);
      // 64보다 32가 부정확하지만 연산이 빠름
      // print("input", input);
      const outputs = await model.run({ images: input });
      // option줄 수 있는듯
      // print("outputs", outputs)
      return outputs["output0"].data;
    }

    function process_output(output, img_width, img_height) {
      let boxes = [];
      // for (let index=0;index<1000;index++) {
      // 왜 8400일까..
      // output이 사실은 8400 X 80의 배열을 1차원배열로 나타낸거여서!
      // print("Array(80)", ...Array(80));
      // print("Array(80).keys()", ...Array(80).keys());
      // console.log(output);
      for (let index = 0; index < 8400; index++) {
        // if(index == 0) {
        //     const temp = [...Array(80).keys()]
        //     .map(col => [col, output[8400*(col+4)+index]])
        //     print("temp", temp);
        //     const temp2 = [...Array(80).keys()]
        //     .map(col => [col, output[8400*(col+4)+index]])
        //     .reduce((accum, item) => item[1]>accum[1] ? item : accum,[0,0]);
        //     print("temp2", temp2);
        // }
        const [class_id, prob] = [...Array(80).keys()] // 80개는 라벨링의 갯수 인듯
          .map((col) => [col, output[8400 * (col + 4) + index]])
          .reduce((accum, item) => (item[1] > accum[1] ? item : accum), [0, 0]);
        if (prob < config.threshold) {
          // 확률이 0.5이하면 무시
          continue;
        }
        const label = yolo_classes[class_id];
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

      // 지금 boxes에는 여러개가 겹쳐서 나와서 겹치는거를 제거하는 과정
      // const test_ret = [...boxes];
      boxes = boxes.sort((box1, box2) => box2[5] - box1[5]); // 정확도 높은 순으로 정렬인듯
      //   print("boxes", boxes);
      const result = [];
      while (boxes.length > 0) {
        // 정확도 높은거 먼저 푸시하기
        result.push(boxes[0]);
        // 지금 정확도 가장 높은 박스랑 비교해서 70퍼센트 이상 겹치면 제거
        boxes = boxes.filter((box) => iou(boxes[0], box) < 0.7);
      }
      // print("result", result);
      return result;
      // return test_ret;
    }

    function iou(box1, box2) {
      // intersection은 겹치는 부분 넓이
      // union은 합친 넓이인듯?
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

    const yolo_classes = [
      "person",
      "bicycle",
      "car",
      "motorcycle",
      "airplane",
      "bus",
      "train",
      "truck",
      "boat",
      "traffic light",
      "fire hydrant",
      "stop sign",
      "parking meter",
      "bench",
      "bird",
      "cat",
      "dog",
      "horse",
      "sheep",
      "cow",
      "elephant",
      "bear",
      "zebra",
      "giraffe",
      "backpack",
      "umbrella",
      "handbag",
      "tie",
      "suitcase",
      "frisbee",
      "skis",
      "snowboard",
      "sports ball",
      "kite",
      "baseball bat",
      "baseball glove",
      "skateboard",
      "surfboard",
      "tennis racket",
      "bottle",
      "wine glass",
      "cup",
      "fork",
      "knife",
      "spoon",
      "bowl",
      "banana",
      "apple",
      "sandwich",
      "orange",
      "broccoli",
      "carrot",
      "hot dog",
      "pizza",
      "donut",
      "cake",
      "chair",
      "couch",
      "potted plant",
      "bed",
      "dining table",
      "toilet",
      "tv",
      "laptop",
      "mouse",
      "remote",
      "keyboard",
      "cell phone",
      "microwave",
      "oven",
      "toaster",
      "sink",
      "refrigerator",
      "book",
      "clock",
      "vase",
      "scissors",
      "teddy bear",
      "hair drier",
      "toothbrush",
    ];
  }

  RED.nodes.registerType("object-detection", yolov8Node);
};
