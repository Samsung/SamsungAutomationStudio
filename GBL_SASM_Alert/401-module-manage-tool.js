const path = require("path"),
  fs = require("fs-extra");

async function checkIfDirectoryExists(dirPath) {
  try {
    const exists = await fs.pathExists(dirPath);

    if (exists) {
      return true;
    } else {
      await fs.ensureDir(dirPath);
      return false;
    }
  } catch (err) {
    console.log(err.message);
    return false;
  }
}

async function main() {
  const basePath = RED.settings.userDir;

  RED.httpAdmin.post("/save-selected-module", async function (req, res) {
    const moduleNodeList = req.body.moduleNodeList;
    const moduleFile = JSON.parse(moduleNodeList);
    const moduleName = moduleFile[0].name;

    if (checkIfDirectoryExists(`${basePath}/utils`)) {
      let moduleFiles = await fs.readdirSync(path.join(basePath, "utils"));
      for (let file of moduleFiles) {
        if (file === moduleName) {
          return res.send({
            msg: `The module name ${moduleName} already exists. Please rename it.`,
            type: "warning",
            timeout: 3000
          });
        }
      }
    }

    const filePath = path.join(basePath, "utils", moduleName);
    fs.outputJSON(filePath, moduleFile)
      .then(() => {
        res.send({
          msg: "The module has been successfully saved.",
          type: "success",
          timeout: 3000
        });
      })
      .catch(() => {
        res.send({
          msg: "An error occurred while saving the module.",
          type: "error",
          timeout: 3000
        });
      });
  });
}

module.exports = function (_RED) {
  RED = _RED;
  main();
};
