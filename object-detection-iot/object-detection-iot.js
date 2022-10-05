const ws = require("ws");
const http = require("http");
const cors = require("cors");
const express = require("express");
const Stream = require("node-rtsp-stream");

module.exports = function (RED) {
  function ObjectDetectionNode(config) {
    RED.nodes.createNode(this, config);
    var node = this;

    function HTML() {
      return require("./object-detection-iot-html.js").code(config);
    }

    node.on("input", function (msg, send) {
      const rtspUrl =
        msg.payload.components.main.videoStream.stream.value.OutHomeURL.split("//")[1];
      const rtspPort = config.rtspPort || 1886;
      const app = express();

      let savedObjName = config.objField;
      let savedPoseName = config.poseField;

      if (config.objFieldType === "flow") {
        config.registered = this.context().flow.get(String(savedObjName));
      } else if (config.objFieldType === "global") {
        config.registered = this.context().global.get(String(savedObjName));
      } else {
        config.registered = this.context().node.get(String(savedObjName));
      }

      if (config.poseFieldType === "flow") {
        config.registeredPose = this.context().flow.get(String(savedPoseName));
      } else if (config.poseFieldType === "global") {
        config.registeredPose = this.context().global.get(String(savedPoseName));
      } else {
        config.registeredPose = this.context().node.get(String(savedPoseName));
      }

      app.use(
        cors({
          origin: true,
          credentials: true,
        })
      );

      const httpServer = http.createServer(app);

      httpServer.once("error", (err) => {
        if (err.code === "EADDRINUSE") {
          console.log("WEbSocker [RTSP] : port ${rtspPort} is already in use.");
        }
      });

      httpServer.once("listening", () => {
        const stream = Stream;
        stream.prototype = Stream.prototype;
        stream.prototype.constructor = stream;

        stream.prototype.pipeStreamToSocketServer = function () {
          this.wsServer = new ws.Server({
            server: httpServer,
          });
          this.wsServer.on("connection", (socket, requset) => {
            return this.onSocketConnect(socket, requset);
          });
          this.wsServer.broadcast = function (data, opts) {
            var results = [];
            for (let client of this.clients) {
              if (client.readyState === 1) {
                results.push(client.send(data, opts));
              }
            }
            return results;
          };
          return this.on("camdata", (data) => {
            return this.wsServer.broadcast(data);
          });
        };
        const smartthingsMnid = this.credentials.smartthingsMnid;
        const smartthingsPat = this.credentials.smartthingsPat;

        rtspStream = new Stream({
          name: "name",
          streamUrl: `rtsps://${smartthingsMnid}:${smartthingsPat}@${rtspUrl}`,
          wsPort: rtspPort,
          ffmpegOptions: {
            "-stats": "",
            "-r": 30,
          },
        });
      });
      httpServer.listen(rtspPort);

      msg.payload = HTML();
      send =
        send ||
        function () {
          this.send.apply(this, arguments);
        };
      send(msg);
    });
    this.on("close", function () {
      rtspStream.stop();
    });
  }

  RED.nodes.registerType("object-detection-iot", ObjectDetectionNode, {
    credentials: {
      smartthingsMnid: { type: "text" },
      smartthingsPat: { type: "text" },
    },
  });
};
