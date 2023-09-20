module.exports = function (RED) {
  const onnx = require("onnxruntime-node");
  const sharp = require("sharp");

  function FaceVectorizationNode(config) {
    RED.nodes.createNode(this, config);
    const node = this;

    // FaceNet ONNX 모델 파일 경로 설정
    const modelPath = `${__dirname}/model/facenet-model.onnx`;

    node.on("input", async function (msg) {
      // 입력 이미지 추출
      const inputData = msg.payload;

      // ONNX 모델 로드
      const model = await onnx.InferenceSession.create(modelPath);

      // 모델의 첫 번째 입력 이름 추출
      const inputName = model.inputNames[0]; 

      // 입력 데이터의 차원을 설정 [배치 크기, 채널 수, 높이, 너비]
      const inputDims = [1, 3, 224, 224]; 

      // 입력 이미지를 차원화
      const input = await image_transfer(inputData);

      // 입력 데이터를 Tensor로 변환
      const inputTensor = new onnx.Tensor(Float32Array.from(input), inputDims);

      // 입력 데이터를 feeds 객체에 설정
      const feeds = {};
      feeds[inputName] = inputTensor;

      // FaceNet ONNX 모델 실행
      const outputData = await model.run(feeds);

      // 결과를 벡터만 추출하여 출력 메시지에 설정 Float32Array => Array
      msg.payload = Array.from(outputData.output.data);

      node.send(msg);
    });

    //모델 삽입용으로 이미지 변환
    async function image_transfer(inputData) {
      // 스트림 이미지 변환
      const img = sharp(inputData);

      // 이미지 사이즈 재조정
      const pixels = await img
        .removeAlpha()
        .resize({ width: 224, height: 224, fit: "fill" })
        .raw()
        .toBuffer();
        
      const red = [],
        green = [],
        blue = [];

      // 이미지 디멘션화
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
