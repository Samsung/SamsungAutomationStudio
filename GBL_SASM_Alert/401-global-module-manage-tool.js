const path = require("path"),
  fs = require("fs-extra");
const { exec } = require("child_process");

function openFileExplorer(path) {
  let command;
  if (process.platform === "win32") {
    command = `explorer.exe /select,"${path}"`;
  } else if (process.platform === "darwin") {
    command = `open -R "${path}"`;
  } else {
    command = `xdg-open "${path}"`;
  }

  exec(command, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error executing command: ${error}`);
    }
  });
}

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
    return false;
  }
}

async function main() {
  const basePath = RED.settings.userDir;
  const manualFilePath = `${basePath}/utils/★PUT YOUR JSON FILES OF MODULE HERE★.txt`;

  RED.httpAdmin.get("/localModules", async function (req, res) {
    try {
      fs.pathExists(manualFilePath, (err, exists) => {
        if (!exists) {
          const content = "Put your JSON files of module in 'utils' folder.";
          fs.writeFile(manualFilePath, content);
        }
      });

      let modulesObject = [];
      if (checkIfDirectoryExists(`${basePath}/utils`)) {
        let moduleFiles = await fs.readdirSync(path.join(basePath, "utils"));

        moduleFiles.forEach(async file => {
          const filePath = path.join(basePath, "utils", file);
          try {
            const fileContent = fs.readFileSync(filePath, "utf-8");
            const moduleFile = {
              filePath: filePath,
              fileContent: JSON.parse(fileContent)
            };
            modulesObject.push(moduleFile);
          } catch (e) {}
        });
      }
      res.send(modulesObject);
    } catch (e) {
      res.status(404).send();
    }
  });

  RED.httpAdmin.post("/delete-selected-module", async function (req, res) {
    try {
      const moduleName = req.body.selectedModuleName;

      const filePath = path.join(basePath, "utils", moduleName);
      fs.remove(filePath)
        .then(() => {
          res.send({
            msg: "The module has been successfully deleted.",
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

  RED.httpAdmin.get("/open-local-directory", async function (req, res) {
    try {
      openFileExplorer(
        `${basePath}\\utils\\★PUT YOUR JSON FILES OF MODULE HERE★.txt`
      );
      res.status(200).send();
    } catch (e) {
      res.status(404).send();
    }
  });
}

module.exports = function (_RED) {
  RED = _RED;
  main();
};
