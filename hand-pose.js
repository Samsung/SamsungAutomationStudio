function calcCosSimilarity(originalLeft, testLeft) {
  let similarity = [];

  for (var i = 0; i < 21; i++) {
    const originX = originalLeft[i].x;
    const testX = testLeft[i].x;
    const originY = originalLeft[i].y;
    const testY = testLeft[i].y;

    //분자
    const dot = originX * testX + originY * testY;
    //분모
    const size = Math.sqrt(originX ** 2 + originY ** 2) * Math.sqrt(testX ** 2 + testY ** 2);

    const result = dot / size;

    similarity[i] = result;
  }

  return similarity;
}

function checkCosSimilarity(originalLeft, testLeft) {
  for (var i = 0; i < 21; i++) {
    const originX = originalLeft[i].x;
    const testX = testLeft[i].x;
    const originY = originalLeft[i].y;
    const testY = testLeft[i].y;

    //분자
    const dot = originX * testX + originY * testY;
    //분모
    const size = Math.sqrt(originX ** 2 + originY ** 2) * Math.sqrt(testX ** 2 + testY ** 2);

    const similarity = dot / size;

    const num = Math.round(Math.abs(1 - similarity) * 1000000000000000) / 1000000000000000;

    const result = Math.sqrt(2 * num);

    if (result > 0.1) {
      return false;
    }
  }

  return true;
}

function checkCosSimilarity1(originalLeft, testLeft) {
  for (var i = 0; i < 21; i++) {
    const originX = originalLeft[i].x - originalLeft[4].x;
    const testX = testLeft[i].x - originalLeft[4].x;
    const originY = originalLeft[i].y - originalLeft[4].y;
    const testY = testLeft[i].y - originalLeft[4].y;

    //분자
    const dot = originX * testX + originY * testY;
    //분모
    const size = Math.sqrt(originX ** 2 + originY ** 2) * Math.sqrt(testX ** 2 + testY ** 2);

    const similarity = dot / size;

    const num = Math.round(Math.abs(1 - similarity) * 1000000000000000) / 1000000000000000;

    const result = Math.sqrt(2 * num);

    if (result > 0.1) {
      return false;
    }
  }

  return true;
}

function checkCosSimilarity2(originalLeft, testLeft) {
  for (var i = 0; i < 21; i++) {
    const originX = originalLeft[i].x - originalLeft[20].x;
    const testX = testLeft[i].x - originalLeft[20].x;
    const originY = originalLeft[i].y - originalLeft[20].y;
    const testY = testLeft[i].y - originalLeft[20].y;

    //분자
    const dot = originX * testX + originY * testY;
    //분모
    const size = Math.sqrt(originX ** 2 + originY ** 2) * Math.sqrt(testX ** 2 + testY ** 2);

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
  function HandPoseNode(config) {
    RED.nodes.createNode(this, config);

    var node = this;

    //data.right, data.left
    node.on("input", function (msg) {
      let leftHand = [];
      let rightHand = [];

      //두 손이 모두 나온지 여부
      let isCorrect = true;

      //왼손, 오른손 찾아 저장
      msg.multiHandedness.forEach((el) => {
        if (el.label === "Right") {
          if (msg.multiHandLandmarks[el.index].length != 21) {
            isCorrect = false;
          } else {
            rightHand = msg.multiHandLandmarks[el.index];
          }
        } else if (el.label === "Left") {
          if (msg.multiHandLandmarks[el.index].length != 21) {
            isCorrect = false;
          } else {
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

      moveHand(leftHand);
      moveHand(rightHand);

      //db에서 가져온 데이터랑 비교
      const length = msg.leftHand.length;
      let isExisted = false;
      let isExisted1 = false;
      let isExisted2 = false;

      for (let idx = 0; idx < length; idx++) {
        moveHand(msg.leftHand[idx]);
        moveHand(msg.rightHand[idx]);

        let isLeftSame = checkCosSimilarity(leftHand, msg.leftHand[idx]);
        let isRightSame = checkCosSimilarity(rightHand, msg.rightHand[idx]);
        let isLeftSame1 = checkCosSimilarity1(leftHand, msg.leftHand[idx]);
        let isRightSame1 = checkCosSimilarity1(rightHand, msg.rightHand[idx]);
        let isLeftSame2 = checkCosSimilarity2(leftHand, msg.leftHand[idx]);
        let isRightSame2 = checkCosSimilarity2(rightHand, msg.rightHand[idx]);

        //둘 모두 true인 경우 -> 이미 존재하는 경우
        if (isLeftSame && isRightSame) {
          isExisted = true;
        }

        if (isLeftSame1 && isRightSame1) {
          isExisted1 = true;
        }

        if (isLeftSame2 && isRightSame2) {
          isExisted2 = true;
        }

        if (isExisted && isExisted1 && isExisted2) {
          break;
        }
      }

      if (isExisted && isExisted1 && isExisted2) {
        msg.status = false;
        //테스트용 나중에 지워야함
        msg.left = leftHand;
        msg.right = rightHand;
      } else {
        msg.status = true;
        msg.left = leftHand;
        msg.right = rightHand;
      }

      node.send(msg);
    });
  }

  RED.nodes.registerType("hand-pose", HandPoseNode);
};
