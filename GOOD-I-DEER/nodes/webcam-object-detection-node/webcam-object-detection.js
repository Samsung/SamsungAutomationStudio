"use-strict";

module.exports = function(RED) {
    require('../../static-server')(RED);

    function webcamYoloNode(config) {
        RED.nodes.createNode(this, config)
        const node = this;
        
        function HTML() {
            return require('./webcam-html.js').code(config)
        }

        const http = require("http");
        const express = require("express");
        const io = require("socket.io");

        const port = config.socketPort;
        const app = express();
        const httpServer = http.createServer(app);

        let socketServer;

        httpServer.once("error", (err) => {
            if (err.code === "EADDRINUSE") {
              console.log(`Socket.io [good webcam] : port ${port} is busy.`);
            }
        });
         
        httpServer.once("listening", () => {
          console.log(`Socket.io [good webcam] : port ${port} is now ready.`);
    
          socketServer = io(httpServer, {
            cors: {
              origin: ["http://localhost:1880", `http://${config.serverUrl}:1880`],
              methods: ["GET", "POST"],
            },
          });
      
          socketServer.on("connection", (socket) => {
            console.log(
              `Socket.io [good webcam] : new client has connected to port ${port}.`
            );
    
            socket.on("DetectedObject", (labelObj) => {
              node.send([null, {payload : labelObj}]);
            });
          });
        });
      
        httpServer.listen(port);

        node.on('input', (msg, send) => {        
            msg.payload = HTML()
            send = send || function() { this.send.apply(this, arguments )}
            send(msg)
        })
    }

    RED.nodes.registerType("webcam-object-detection", webcamYoloNode)
}
