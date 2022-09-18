// "util": "^0.12.4",
// "child_process": "^1.0.2",

const util = require('util');
const exec = util.promisify(require('child_process').exec);

// do it(error check);
exports.detection = async () => {
  try {
    let run = await exec(`python ./mediapipe/mediapipeTest.py`, { timeout: 5000 });
    return run.stdout;

  } catch (error) { // 시간 초과 or 런타임 오류
      return "[]";
  }
}