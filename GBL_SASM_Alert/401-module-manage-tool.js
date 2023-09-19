const path = require("path"),
  fs = require("fs-extra");

async function main() {
  const basePath = RED.settings.userDir;

  RED.httpAdmin.post("/save-selected-module", async function (req, res) {
    try {
      const moduleNodeList = req.body.moduleNodeList;
      const moduleFile = JSON.parse(moduleNodeList);
      const moduleName = moduleFile[0].name;

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
    } catch (e) {
      res.status(404).send();
    }
  });
}

module.exports = function (_RED) {
  RED = _RED;
  main();
};
