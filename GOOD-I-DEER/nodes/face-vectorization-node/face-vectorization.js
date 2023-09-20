module.exports = function (RED) {
  const onnx = require("onnxruntime-node");
  const sharp = require("sharp");

  function FaceVectorizationNode(config) {
    RED.nodes.createNode(this, config);
    const node = this;

    // FaceNet ONNX 모델 파일 경로 설정
    const modelPath = `${__dirname}/model/facenet-model.onnx`; // FaceNet ONNX 모델 파일 경로

    node.on("input", async function (msg) {
      // 입력 이미지 추출 (예: 이미지를 픽셀 배열로 변환)
      const inputData = msg.payload; // 이미지 데이터 혹은 이미지 피처 추출

      // ONNX 모델 로드
      const model = await onnx.InferenceSession.create(modelPath);

      // 입력 데이터를 Tensor로 변환
      const inputName = model.inputNames[0]; // 모델의 첫 번째 입력 이름을 가져옵니다.

      // 입력 데이터의 차원을 설정 (예시: 이미지 차원)
      const inputDims = [1, 3, 224, 224]; // [배치 크기, 채널 수, 높이, 너비]
      const input = await prepare_input(inputData);
      const inputTensor = new onnx.Tensor(Float32Array.from(input), inputDims);

      // 입력 데이터를 feeds 객체에 설정
      const feeds = {};
      feeds[inputName] = inputTensor;

      // ONNX 모델 실행
      const outputData = await model.run(feeds);

      // 결과를 출력 메시지에 설정
      msg.payload = outputData;

      // 결과 메시지 전송
      node.send(msg);
    });

    async function prepare_input(buf) {
      const img = sharp(buf);
      const pixels = await img
        .removeAlpha()
        .resize({ width: 224, height: 224, fit: "fill" })
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
      console.log(input);
      return input;
    }
  }
  RED.nodes.registerType("face-vectorization", FaceVectorizationNode);
};
