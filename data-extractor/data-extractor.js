module.exports = function (RED) {
  const { XMLParser } = require("fast-xml-parser");
  const parser = new XMLParser();
  let result = [];

  function formatJSON(json, paths) {
    if (typeof json === "string") {
      json = JSON.parse(json);
    }
    if (!(paths instanceof Array)) {
      paths = [paths];
    }
    paths.forEach((path) => {
      path = path.split(".");
      resultOnlyOne = formatJSONOnlyOne(json, path);
      result.push(resultOnlyOne);
    });
    if (result.length === 2) {
      result = result[1];
    }
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

  function DataExtractor(config) {
    RED.nodes.createNode(this, config);
    let node = this;
    try {
    } catch (error) {
      node.status({ fill: "red", shape: "dot", text: "error" });
      msg.payload = "Unknown error";
      node.error(error.toString(), msg);
    }

    node.on("input", function (msg) {
      try {
        let data;
        if (config.response_type === "json") {
          data = JSON.parse(msg.payload);
        } else {
          data = parser.parse(msg.payload);
        }

        let paths = config.paths;
        result = [paths];
        formatJSON(data, paths);
        msg.payload = result;
        node.send(msg);
      } catch (error) {
        node.status({ fill: "red", shape: "dot", text: "error" });
        msg.payload = "Unknown error";
        node.error(error.toString(), msg);
      }
    });
  }
  RED.nodes.registerType("data-extractor", DataExtractor);
};
