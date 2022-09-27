module.exports = function (RED) {
  const { XMLParser } = require("fast-xml-parser");
  const parser = new XMLParser();

  let targetArr = [];
  let targetPath = [];

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
        targetPath = [];

        let input = {
          data: data,
          stdPath: config.stdPath,
          stdValue: config.value,
          stdType: config.value_type,
          outputPaths: config.outputPaths,
        };

        findTarget(input);

        const cleanedOutputPaths = input.outputPaths.map((path) =>
          cleanPath(path, [...targetPath])
        );

        let result = [];
        targetArr.forEach((target) => {
          let ret = {};
          cleanedOutputPaths.forEach((path) => {
            if (path.length) {
              const newTarget = JSON.parse(JSON.stringify(target));
              ret[path] = formatJSONOnlyOne(newTarget, [...path]);
            } else {
              ret.push(
                "Invalid Path Error: The outputPath must be a sibling or child path of targetPath"
              );
            }
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
    } else if (stdType === "num") {
      if (isNaN(data) || isNaN(stdValue)) {
        return false;
      }
      return data.toString() === stdValue;
    } else if (stdType === "bool") {
      return data.toString().toLowerCase() === stdValue;
    }
    return false;
  }

  function findTarget(input) {
    stdPath = input.stdPath.split(".");
    findTargetOnlyOne(input.data, stdPath, input.stdValue, input.stdType);
  }

  function findTargetOnlyOne(data, path, stdValue, stdType) {
    key = path.shift();
    targetPath.push(key);
    if (key === undefined) {
      targetPath.pop();
      return compareData(data, stdValue, stdType);
    }

    try {
      if (data[key] === undefined) {
        targetArr.push(path.length ? `Invalid Key : ${key}` : undefined);
        return;
      }
      if (data[key] instanceof Array) {
        for (let item of data[key]) {
          const targetsArr = [];
          if (findTargetOnlyOne(item, [...path], stdValue, stdType)) {
            targetsArr.push(item);
          }
          targetPath.pop();
          if (targetsArr.length > 0) {
            if (targetsArr.length === 1) {
              targetArr.push(targetsArr[0]);
            } else {
              targetArr.push(targetsArr);
            }
          }
        }
      }
      return findTargetOnlyOne(data[key], path, stdValue, stdType);
    } catch (error) {
      targetPath.pop();
      return `Unknown Error`;
    }
  }

  function cleanPath(path, comparePath) {
    path = path.split(".");
    while (path[0] && comparePath[0] && path[0] === comparePath[0]) {
      path.shift();
      comparePath.shift();
    }
    return path;
  }

  function formatJSONOnlyOne(data, path) {
    key = path.shift();
    if (key === undefined) return data;
    try {
      if (data[key] === undefined) {
        return path.length ? `Invalid Key : ${key}` : undefined;
      }
      if (data[key] instanceof Array) {
        const valArray = [];
        for (item of data[key]) {
          valArray.push(formatJSONOnlyOne(item, [...path]));
        }
        return valArray;
      }
      return formatJSONOnlyOne(data[key], path);
    } catch (error) {
      return `Unknown Error`;
    }
  }

  RED.nodes.registerType("data-filter", DataFilter);
};
