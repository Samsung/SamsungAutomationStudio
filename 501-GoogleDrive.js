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
      const filePath = msg.payload.filePath || config.filePath;
      const dataType = msg.payload.dataType || config.dataType;
      const auth = new google.auth.OAuth2(clientId, clientSecret, redirectUri);
      auth.setCredentials({ refresh_token: refreshToken });
      const drive = google.drive({
        version: "v3",
        auth,
      });
      async function googleAPI(doType) {
        if (doType === "download" || doType === "read") {
          const params = {
            q: `name='${fileName}'`,
            fields: "files(id, name)",
            spaces: "drive",
          };
          let fileId = null;
          const response = await drive.files.list(params).then((res) => {
            fileId = res.data.files[0]["id"] || null;
          });
          return await drive.files.get(
            {
              fileId,
              alt: "media",
            },
            {
              responseType: "stream",
            }
          );
        } else if (doType === "upload") {
          return await drive.files.create({
            requestBody: {
              name: fileName,
              mimeType: mimeType[dataType],
            },
            media: {
              mimeType: mimeType[dataType],
              body: fs.createReadStream(`${filePath}\\${fileName}`),
            },
          });
        }
      }

      googleAPI(doType)
        .then((res) => {
          if (doType === "download") {
            res.data.pipe(fs.createWriteStream(`${filePath}\\${fileName}`));
          }
          if (doType === "read" || doType === "download") {
            msg.buffer =
              res.data["_outBuffer"] ||
              res.data["_readableState"]["buffer"]["head"]["data"];
          } else {
            msg.buffer = fs.readFileSync(`${filePath}\\${fileName}`);
          }
          msg.filePath = `${filePath}\\${fileName}` || null;
          send(msg);
        })
        .catch((err) => {
          console.log("error: ", err);
        });
    });
  }
  RED.nodes.registerType("GoogleDrive", GoogleDriveNode);
};
