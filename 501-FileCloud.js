const { google } = require("googleapis");

module.exports = function (RED) {
  const googleApi = require("./lib/googleApi");
  const oneApi = require("./lib/oneApi");

  function FileCloudNode(config) {
    RED.nodes.createNode(this, config);
    var node = this;
    node.status({});

    this.on("input", async (msg, send) => {
      const cloudType = config.cloudType;
      const fileName = msg.payload.fileName || config.fileName;

      var param = {
        fileName,
      };

      if (cloudType === "google") {
        const refreshToken = config.refreshToken;
        const redirectURI = "https://developers.google.com/oauthplayground";
        const auth = new google.auth.OAuth2(
          config.clientId,
          config.clientSecret,
          redirectURI
        );
        auth.setCredentials({ refresh_token: refreshToken });
        const drive = google.drive({
          version: "v3",
          auth,
        });
        param["drive"] = drive;
      } else if (cloudType === "one") {
        const accessToken = config.accessToken;
        param["accessToken"] = accessToken;
      }

      var api = cloudType === "google" ? googleApi : oneApi;
      api
        .read(param)
        .then((val) => {
          msg.data = val;
          send(msg);
        })
        .catch((error) => {
          node.status({ fill: "red", shape: "dot", text: "error" });
          node.error("Read failed: " + error.toString(), msg);
        });
    });
  }

  RED.nodes.registerType("FileCloud", FileCloudNode);
};
