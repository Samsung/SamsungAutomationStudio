function handDataPreprocessing(inputHandData) {
  let inputX = [];
  let inputY = [];

  let minX = 1.0;
  let minY = 1.0;
  let maxX = 0.0;
  let maxY = 0.0;

  for (let idx = 0; idx < inputHandData.length; idx++) {
    let x = inputHandData[idx].x;
    let y = inputHandData[idx].y;

    if (minX > x) {
      minX = x;
    }

    if (minY > y) {
      minY = y;
    }

    if (maxX < x) {
      maxX = x;
    }

    if (maxY < y) {
      maxY = y;
    }

    inputX[idx] = x;
    inputY[idx] = y;
  }

  let numX = 1.0 / (maxX - minX);
  let numY = 1.0 / (maxY - minY);

  for (let idx = 0; idx < inputHandData.length; idx++) {
    inputX[idx] = (inputX[idx] - minX) * numX;
    inputY[idx] = (inputY[idx] - minY) * numY;
  }

  return [...inputX, ...inputY];
}

function checkCosSimilarity(inputHandData, savedHandData, isExisted, similarity) {
  if (isExisted) {
    if (savedHandData == null) {
      return false;
    }
  } else {
    //둘다 없는 경우
    if (savedHandData == null) {
      return true;
    } else {
      return false;
    }
  }

  let inputHand = handDataPreprocessing(inputHandData);
  let savedHand = handDataPreprocessing(savedHandData);

  let cosSimilarity = similarity(inputHand, savedHand);

  if (cosSimilarity > 0.98) {
    return true;
  }

  return false;
}

module.exports = function (RED) {
  function HandRegisterNode(config) {
    RED.nodes.createNode(this, config);

    var node = this;
    
    const similarity = require("compute-cosine-similarity");
    
    node.on("input", function (msg) {

      /*--------------- DB 데이터 처리 -------------------------*/
      const handDataCount = msg.savedLeftHand.length;
      let savedLeftHand = msg.savedLeftHand;
      let savedRightHand = msg.savedRightHand;
      let savedNameList = msg.savedNameList;
      let inputName = msg.poseName;

      /*--------------- 핸드 이름 중복 체크 -------------------------*/
      if (savedNameList.includes(inputName)) {
        msg.status = false;
        node.send(msg);

        return;
      }
      /*--------------- 유사도 체크 시작 -------------------------*/
      let inputLeftHand = null;
      let inputRightHand = null;

      //손의 모든 포인트가 나온지 여부
      let isCorrect = true;
      let isLeftExisted = false;
      let isRightExisted = false;

      //왼손, 오른손 찾아 저장
      msg.multiHandedness.forEach((el, index) => {
        if (el.label === "Right") {
          if (msg.multiHandLandmarks[index].length != 21) {
            isCorrect = false;
          } else {
            isRightExisted = true;
            inputRightHand = msg.multiHandLandmarks[index];
          }
        } else if (el.label === "Left") {
          if (msg.multiHandLandmarks[index].length != 21) {
            isCorrect = false;
          } else {
            isLeftExisted = true;
            inputLeftHand = msg.multiHandLandmarks[index];
          }
        }
      });

      //손이 제대로 나오지 않은 경우
      if (!isCorrect) {
        msg.status = false;
        node.send(msg);

        return;
      }

      //범위 밖의 좌표가 있는 경우
      let isIn = true;

      for (let idx = 0; idx < 21; idx++) {
        if (
          isLeftExisted &&
          (inputLeftHand[idx].x < 0 ||
            inputLeftHand[idx].y < 0 ||
            inputLeftHand[idx].x > 1 ||
            inputLeftHand[idx].y > 1)
        ) {
          isIn = false;
          break;
        }

        if (
          isRightExisted &&
          (inputRightHand[idx].x < 0 ||
            inputRightHand[idx].y < 0 ||
            inputRightHand[idx].x > 1 ||
            inputRightHand[idx].y > 1)
        ) {
          isIn = false;
          break;
        }
      }

      if (!isIn) {
        msg.status = false;
        node.send(msg);

        return;
      }

      //db에서 가져온 데이터랑 비교
      let isExistedFromOrigin = false;

      for (let idx = 0; idx < handDataCount; idx++) {
        let isLeftSameFromOrigin = checkCosSimilarity(
          inputLeftHand,
          savedLeftHand[idx],
          isLeftExisted,
          similarity
        );

        let isRightSameFromOrigin = checkCosSimilarity(
          inputRightHand,
          savedRightHand[idx],
          isRightExisted,
          similarity
        );

        //둘 모두 true인 경우 -> 이미 존재하는 경우
        if (isLeftSameFromOrigin && isRightSameFromOrigin) {
          isExistedFromOrigin = true;
        } else {
          isExistedFromOrigin = false;
        }

        if (isExistedFromOrigin) {
          break;
        }
      }

      //이미 있는 핸드인 경우
      if (isExistedFromOrigin) {
        msg.status = false;
        //테스트용 나중에 지워야함
        // msg.left = leftHand;
        // msg.right = rightHand;
      } else {
        msg.status = true;
        //포즈 이름 추가
        msg.inputLeftHand = inputLeftHand;
        msg.inputRightHand = inputRightHand;
      }

      node.send(msg);
    });
  }

  RED.nodes.registerType("hand-register", HandRegisterNode);
};
