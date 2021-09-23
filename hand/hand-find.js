function checkCosSimilarityFromOrigin(inputHandData, savedHandData, isExisted) {
  if (isExisted) {
    if (savedHandData == "") {
      return false;
    }
  } else {
    //둘다 없는 경우
    if (savedHandData == "") {
      return true;
    } else {
      return false;
    }
  }

  for (var i = 0; i < 21; i++) {
    const inputX = inputHandData[i].x;
    const savedX = savedHandData[i].x;
    const inputY = inputHandData[i].y;
    const savedY = savedHandData[i].y;

    //분자
    const dot = inputX * savedX + inputY * savedY;
    //분모
    const size = Math.sqrt(inputX ** 2 + inputY ** 2) * Math.sqrt(savedX ** 2 + savedY ** 2);

    const similarity = dot / size;

    const num = Math.round(Math.abs(1 - similarity) * 1000000000000000) / 1000000000000000;

    const result = Math.sqrt(2 * num);

    if (result > 0.1) {
      return false;
    }
  }

  return true;
}

function checkCosSimilarityFromPointFour(inputHandData, savedHandData, isExisted) {
  if (isExisted) {
    if (savedHandData == "") {
      return false;
    }
  } else {
    //둘다 없는 경우
    if (savedHandData == "") {
      return true;
    } else {
      return false;
    }
  }

  for (var i = 0; i < 21; i++) {
    const inputX = inputHandData[i].x - inputHandData[4].x;
    const savedX = savedHandData[i].x - inputHandData[4].x;
    const inputY = inputHandData[i].y - inputHandData[4].y;
    const savedY = savedHandData[i].y - inputHandData[4].y;

    //분자
    const dot = inputX * savedX + inputY * savedY;
    //분모
    const size = Math.sqrt(inputX ** 2 + inputY ** 2) * Math.sqrt(savedX ** 2 + savedY ** 2);

    const similarity = dot / size;

    const num = Math.round(Math.abs(1 - similarity) * 1000000000000000) / 1000000000000000;

    const result = Math.sqrt(2 * num);

    if (result > 0.1) {
      return false;
    }
  }

  return true;
}

function checkCosSimilarityFromPointTwenty(inputHandData, savedHandData, isExisted) {
  if (isExisted) {
    if (savedHandData == "") {
      return false;
    }
  } else {
    //둘다 없는 경우
    if (savedHandData == "") {
      return true;
    } else {
      return false;
    }
  }

  for (var i = 0; i < 21; i++) {
    const inputX = inputHandData[i].x - inputHandData[20].x;
    const savedX = savedHandData[i].x - inputHandData[20].x;
    const inputY = inputHandData[i].y - inputHandData[20].y;
    const savedY = savedHandData[i].y - inputHandData[20].y;

    //분자
    const dot = inputX * savedX + inputY * savedY;
    //분모
    const size = Math.sqrt(inputX ** 2 + inputY ** 2) * Math.sqrt(savedX ** 2 + savedY ** 2);

    const similarity = dot / size;

    const num = Math.round(Math.abs(1 - similarity) * 1000000000000000) / 1000000000000000;

    const result = Math.sqrt(2 * num);

    if (result > 0.1) {
      return false;
    }
  }

  return true;
}

function moveHand(hand) {
  let minX = 1;
  let minY = 1;

  hand.forEach((el) => {
    minX = Math.min(minX, el.x);
    minY = Math.min(minY, el.y);
  });

  hand.forEach((el, index) => {
    hand[index].x -= minX;
    hand[index].y -= minY;
  });
}

module.exports = function (RED) {
  function HandFindNode(config) {
    RED.nodes.createNode(this, config);

    var node = this;

    //data.right, data.left
    node.on("input", function (msg) {
      /*--------------- DB 데이터 처리 -------------------------*/
      const handDataCount = msg.payload.length;
      let savedLeftHand = [];
      let savedRightHand = [];
      let savedNameList = [];

      msg.payload.forEach((el, index) => {
        let leftData = el.left_hand_land_marks.split("},");
        let rightData = el.right_hand_land_marks.split("},");

        const length = leftData.length;

        savedLeftHand[index] = [];
        savedRightHand[index] = [];

        let left = [];
        let right = [];

        for (let i = 0; i < length; i++) {
          if (i != 21) {
            left[i] = JSON.parse(leftData[i] + "}");
            right[i] = JSON.parse(rightData[i] + "}");
          }
        }

        savedNameList[index] = el.name;
        savedLeftHand[index] = left;
        savedRightHand[index] = right;
      });

      /*--------------- 유사도 체크 시작 -------------------------*/
      let inputLeftHand = [];
      let inputRightHand = [];

      //손의 모든 포인트가 나온지 여부
      let isCorrect = true;
      let isLeftExisted = false;
      let isRightExisted = false;

      //왼손, 오른손 찾아 저장
      msg.multiHandedness.forEach((el) => {
        if (el.label === "Right") {
          if (msg.multiHandLandmarks[el.index].length != 21) {
            isCorrect = false;
          } else {
            isRightExisted = true;
            inputRightHand = msg.multiHandLandmarks[el.index];
          }
        } else if (el.label === "Left") {
          if (msg.multiHandLandmarks[el.index].length != 21) {
            isCorrect = false;
          } else {
            isLeftExisted = true;
            inputLeftHand = msg.multiHandLandmarks[el.index];
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

      if (isLeftExisted) moveHand(inputLeftHand);
      if (isRightExisted) moveHand(inputRightHand);

      //db에서 가져온 데이터랑 비교
      let isExistedFromOrigin = false;
      let isExistedFromPointFour = false;
      let isExistedFromPointTwenty = false;
      let findHandName = "";

      for (let idx = 0; idx < handDataCount; idx++) {
        moveHand(savedLeftHand[idx]);
        moveHand(savedRightHand[idx]);

        let isLeftSameFromOrigin = checkCosSimilarityFromOrigin(
          inputLeftHand,
          savedLeftHand[idx],
          isLeftExisted
        );
        let isLeftSameFromPointFour = checkCosSimilarityFromPointFour(
          inputLeftHand,
          savedLeftHand[idx],
          isLeftExisted
        );
        let isLeftSameFromPointTwenty = checkCosSimilarityFromPointTwenty(
          inputLeftHand,
          savedLeftHand[idx],
          isLeftExisted
        );

        let isRightSameFromOrigin = checkCosSimilarityFromOrigin(
          inputRightHand,
          savedRightHand[idx],
          isRightExisted
        );
        let isRightSameFromPointFour = checkCosSimilarityFromPointFour(
          inputRightHand,
          savedRightHand[idx],
          isRightExisted
        );
        let isRightSameFromPointTwenty = checkCosSimilarityFromPointTwenty(
          inputRightHand,
          savedRightHand[idx],
          isRightExisted
        );

        //둘 모두 true인 경우 -> 이미 존재하는 경우
        if (isLeftSameFromOrigin && isRightSameFromOrigin) {
          isExistedFromOrigin = true;
        } else {
          isExistedFromOrigin = false;
        }

        if (isLeftSameFromPointFour && isRightSameFromPointFour) {
          isExistedFromPointFour = true;
        } else {
          isExistedFromOrigin = false;
        }

        if (isLeftSameFromPointTwenty && isRightSameFromPointTwenty) {
          isExistedFromPointTwenty = true;
        } else {
          isExistedFromOrigin = false;
        }

        if (isExistedFromOrigin && isExistedFromPointFour && isExistedFromPointTwenty) {
          findHandName = savedNameList[idx];
          break;
        }
      }

      //이미 있는 핸드인 경우
      if (isExistedFromOrigin && isExistedFromPointFour && isExistedFromPointTwenty) {
        msg.status = true;
        msg.handName = findHandName;
      } else {
        msg.status = false;
      }

      node.send(msg);
    });
  }

  RED.nodes.registerType("hand-find", HandFindNode);
};
