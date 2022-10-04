module.exports = function (RED) {
  const { XMLParser } = require("fast-xml-parser");
  const parser = new XMLParser();

  let targetArr = [];

  function DataFilter(config) {
    RED.nodes.createNode(this, config);
    let node = this;

    node.on("input", function (msg) {
      try {
        let data;
        if (config.response_type === "json") {
          data = JSON.parse(msg.payload);
        } else {
          data = parser.parse(msg.payload);
        }

        targetArr = [];

        let input = {
          data: data,
          stdPath: config.stdPath,
          stdValue: config.value,
          stdType: config.value_type,
          outputPaths: config.outputPaths,
        };

        findTarget(input);

        const cleanedOutputPaths = input.outputPaths.map((path) => cleanPath(path, input.stdPath));

        let result = [];
        targetArr.forEach((target) => {
          let ret = {};
          cleanedOutputPaths.forEach((path) => {
            makeResult(ret, target, [...path]);
          });
          result.push(ret);
        });

        if (result.length === 1) {
          result = result[0];
        }

        msg.payload = result;
        node.send(msg);
      } catch (error) {
        node.status({ fill: "red", shape: "dot", text: "error" });
        node.error(error.toString(), msg);
      }
    });
  }

  function compareData(data, stdValue, stdType) {
    if (data === undefined || data === null || stdValue === undefined || stdValue === null) {
      return false;
    }
    if (stdType === "str") {
      return data.toString() === stdValue;
    }
    if (stdType === "num") {
      if (isNaN(data) || isNaN(stdValue)) {
        return false;
      }
      return data.toString() === stdValue;
    }
    if (stdType === "bool") {
      return data.toString().toLowerCase() === stdValue;
    }
    return false;
  }

  function findTarget(input) {
    stdPath = input.stdPath.split(".");
    findTargetOnlyOne(input.data, stdPath, input.stdValue, input.stdType);
  }

  function findTargetOnlyOne(data, path, stdValue, stdType) {
    if (path.length === 1) {
      if (compareData(data[path], stdValue, stdType)) {
        targetArr.push(data);
        return;
      }
    }

    let key = path.shift();
    try {
      if (data[key] === undefined) {
        return;
      }
      if (data[key] instanceof Array) {
        for (let item of data[key]) {
          findTargetOnlyOne(item, [...path], stdValue, stdType);
        }
      }
      findTargetOnlyOne(data[key], path, stdValue, stdType);
    } catch (error) {
      console.log(`Unknown Error`);
    }
  }

  function cleanPath(path, stdPath) {
    let paths = path.split(".");
    let stdPaths = stdPath.split(".");

    while (stdPaths.length > 1) {
      paths.shift();
      stdPaths.shift();
    }
    return paths;
  }

  function makeResult(ret, target, path) {
    if (path.legnth < 1) {
      return;
    }

    if (path.length == 1) {
      ret[path[0]] = target[path[0]];
      return;
    }

    let key = path.shift();
    if (target[key] instanceof Array) {
      if (ret[key] === undefined) {
        ret[key] = [];
      }
      for (let i = 0; i < target[key].length; i++) {
        if (ret[key][i] === undefined) {
          ret[key].push({});
        }
        makeResult(ret[key][i], target[key][i], [...path]);
      }
      return;
    }

    if (ret[key] === undefined) {
      ret[key] = {};
    }
    makeResult(ret[key], target[key], [...path]);
  }

  RED.nodes.registerType("data-filter", DataFilter);
};
