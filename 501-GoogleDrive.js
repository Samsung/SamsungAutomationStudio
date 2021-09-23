const { google } = require("googleapis");
const fs = require("fs");

const mimeType = {
  pdf: "application/pdf",
  text: "text/plain",
  msWord:
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  msExcel: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  msPpt:
    "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  csv: "text/csv",
  json: "application/vnd.google-apps.script+json",
  jpeg: "image/jpeg",
  png: "image/png",
  svg: "image/svg+xml",
};

module.exports = function exportFunc(RED) {
  function GoogleDriveNode(config) {
    RED.nodes.createNode(this, config);
    const redirectUri = "https://developers.google.com/oauthplayground";
    this.on("input", async (msg, send, done) => {
      const doType = msg.payload.doType || config.doType;
      const clientId = msg.payload.clientId || config.clientId;
      const clientSecret = msg.payload.clientSecret || config.clientSecret;
      const refreshToken = msg.payload.refreshToken || config.refreshToken;
      const fileName = msg.payload.fileName || config.fileName;
      const fileId = msg.payload.fileId || config.fileId;
      const filePath = msg.payload.filePath || config.filePath;
      const dataType = msg.payload.dataType || config.dataType;
      const auth = new google.auth.OAuth2(clientId, clientSecret, redirectUri);
      auth.setCredentials({ refresh_token: refreshToken });
      const drive = google.drive({
        version: "v3",
        auth,
      });
      try {
        const response = await ((doType) => {
          switch (doType) {
            case "download":
              return drive.files.get(
                {
                  fileId,
                  alt: "media",
                },
                {
                  responseType: "stream",
                },
                function (err, { data }) {
                  data
                    .on("end", () => {})
                    .on("error", (err) => {
                      msg.payload = `Error during download: ${err}`;
                    })
                    .pipe(fs.createWriteStream(`${filePath}/${fileName}`));
                }
              );
            case "upload":
              return drive.files
                .create({
                  requestBody: {
                    name: fileName,
                    mimeType: mimeType[dataType],
                  },
                  media: {
                    mimeType: mimeType[dataType],
                    body: fs.createReadStream(filePath),
                  },
                })
                .then((res) => {
                  msg.filePath = filePath;
                })
                .catch((err) => {
                  msg.payload = err;
                });
          }
        })(doType);
      } catch (error) {
        msg.payload = error;
      }
      msg.filePath = filePath;
      this.send(msg);
    });
  }
  RED.nodes.registerType("GoogleDrive", GoogleDriveNode);
};
