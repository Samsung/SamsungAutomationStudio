const path = require("path"),
  fs = require("fs-extra");

async function main() {
  const basePath = RED.settings.userDir;

  RED.httpAdmin.get("/localModules", async function (req, res) {
    try {
      let moduleFiles = await fs.readdirSync(path.join(basePath, "utils"));
      let modulesObject = [];

      moduleFiles.forEach(async file => {
        const filePath = path.join(basePath, "utils", file);
        const fileContent = fs.readFileSync(filePath, "utf-8");
        const moduleFile = {
          filePath: filePath,
          fileContent: JSON.parse(fileContent)
        };
        modulesObject.push(moduleFile);
      });
      res.send(modulesObject);
    } catch (e) {
      res.status(404).send();
    }
  });
}

module.exports = function (_RED) {
  RED = _RED;
  main();
};
