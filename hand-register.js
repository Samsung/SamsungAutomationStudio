// function calcCosSimilarity(inputHandData, targetHandData) {
//   let similarity = [];

//   for (var i = 0; i < 21; i++) {
//     const inputX = inputHandData[i].x;
//     const targetX = targetHandData[i].x;
//     const inputY = inputHandData[i].y;
//     const targetY = targetHandData[i].y;

//     //분자
//     const dot = inputX * targetX + inputY * targetY;
//     //분모
//     const size = Math.sqrt(inputX ** 2 + inputY ** 2) * Math.sqrt(targetX ** 2 + targetY ** 2);

//     const result = dot / size;

//     similarity[i] = result;
//   }

//   return similarity;
// }

function checkCosSimilarityFromOrigin(inputHandData, targetHandData, isExisted) {
  if (isExisted) {
    if (targetHandData == "") {
      return false;
    }
  } else {
    //둘다 없는 경우
    if (targetHandData == "") {
      return true;
    } else {
      return false;
    }
  }

  for (var i = 0; i < 21; i++) {
    const inputX = inputHandData[i].x;
    const targetX = targetHandData[i].x;
    const inputY = inputHandData[i].y;
    const targetY = targetHandData[i].y;

    //분자
    const dot = inputX * targetX + inputY * targetY;
    //분모
    const size = Math.sqrt(inputX ** 2 + inputY ** 2) * Math.sqrt(targetX ** 2 + targetY ** 2);

    const similarity = dot / size;

    const num = Math.round(Math.abs(1 - similarity) * 1000000000000000) / 1000000000000000;

    const result = Math.sqrt(2 * num);

    if (result > 0.1) {
      return false;
    }
  }

  return true;
}

function checkCosSimilarityFromPointFour(inputHandData, targetHandData, isExisted) {
  if (isExisted) {
    if (targetHandData == "") {
      return false;
    }
  } else {
    //둘다 없는 경우
    if (targetHandData == "") {
      return true;
    } else {
      return false;
    }
  }

  for (var i = 0; i < 21; i++) {
    const inputX = inputHandData[i].x - inputHandData[4].x;
    const targetX = targetHandData[i].x - inputHandData[4].x;
    const inputY = inputHandData[i].y - inputHandData[4].y;
    const targetY = targetHandData[i].y - inputHandData[4].y;

    //분자
    const dot = inputX * targetX + inputY * targetY;
    //분모
    const size = Math.sqrt(inputX ** 2 + inputY ** 2) * Math.sqrt(targetX ** 2 + targetY ** 2);

    const similarity = dot / size;

    const num = Math.round(Math.abs(1 - similarity) * 1000000000000000) / 1000000000000000;

    const result = Math.sqrt(2 * num);

    if (result > 0.1) {
      return false;
    }
  }

  return true;
}

function checkCosSimilarityFromPointTwenty(inputHandData, targetHandData, isExisted) {
  if (isExisted) {
    if (targetHandData == "") {
      return false;
    }
  } else {
    //둘다 없는 경우
    if (targetHandData == "") {
      return true;
    } else {
      return false;
    }
  }

  for (var i = 0; i < 21; i++) {
    const inputX = inputHandData[i].x - inputHandData[20].x;
    const targetX = targetHandData[i].x - inputHandData[20].x;
    const inputY = inputHandData[i].y - inputHandData[20].y;
    const targetY = targetHandData[i].y - inputHandData[20].y;

    //분자
    const dot = inputX * targetX + inputY * targetY;
    //분모
    const size = Math.sqrt(inputX ** 2 + inputY ** 2) * Math.sqrt(targetX ** 2 + targetY ** 2);

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
  function HandRegisterNode(config) {
    RED.nodes.createNode(this, config);

    var node = this;

    //data.right, data.left
    node.on("input", function (msg) {
      let leftHand = [];
      let rightHand = [];

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
            rightHand = msg.multiHandLandmarks[el.index];
          }
        } else if (el.label === "Left") {
          if (msg.multiHandLandmarks[el.index].length != 21) {
            isCorrect = false;
          } else {
            isLeftExisted = true;
            leftHand = msg.multiHandLandmarks[el.index];
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
          (leftHand[idx].x < 0 || leftHand[idx].y < 0 || leftHand[idx].x > 1 || leftHand[idx].y > 1)
        ) {
          isIn = false;
          break;
        }

        if (
          isRightExisted &&
          (rightHand[idx].x < 0 ||
            rightHand[idx].y < 0 ||
            rightHand[idx].x > 1 ||
            rightHand[idx].y > 1)
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

      if (isLeftExisted) moveHand(leftHand);
      if (isRightExisted) moveHand(rightHand);

      //db에서 가져온 데이터랑 비교
      //db에 등록된 핸드의 수
      const length = msg.leftHand.length;

      let isExistedFromOrigin = false;
      let isExistedFromPointFour = false;
      let isExistedFromPointTwenty = false;

      for (let idx = 0; idx < length; idx++) {
        moveHand(msg.leftHand[idx]);
        moveHand(msg.rightHand[idx]);

        let isLeftSameFromOrigin = checkCosSimilarityFromOrigin(
          leftHand,
          msg.leftHand[idx],
          isLeftExisted
        );
        let isLeftSameFromPointFour = checkCosSimilarityFromPointFour(
          leftHand,
          msg.leftHand[idx],
          isLeftExisted
        );
        let isLeftSameFromPointTwenty = checkCosSimilarityFromPointTwenty(
          leftHand,
          msg.leftHand[idx],
          isLeftExisted
        );

        let isRightSameFromOrigin = checkCosSimilarityFromOrigin(
          rightHand,
          msg.rightHand[idx],
          isRightExisted
        );
        let isRightSameFromPointFour = checkCosSimilarityFromPointFour(
          rightHand,
          msg.rightHand[idx],
          isRightExisted
        );
        let isRightSameFromPointTwenty = checkCosSimilarityFromPointTwenty(
          rightHand,
          msg.rightHand[idx],
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
          break;
        }
      }

      //이미 있는 핸드인 경우
      if (isExistedFromOrigin && isExistedFromPointFour && isExistedFromPointTwenty) {
        msg.status = false;
        //테스트용 나중에 지워야함
        // msg.left = leftHand;
        // msg.right = rightHand;
      } else {
        msg.status = true;
        //포즈 이름 추가
        msg.left = leftHand;
        msg.right = rightHand;
      }

      node.send(msg);
    });
  }

  RED.nodes.registerType("hand-register", HandRegisterNode);
};
