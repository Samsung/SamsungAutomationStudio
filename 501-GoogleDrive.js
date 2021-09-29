const fs = require("fs");
const { google } = require("googleapis");
const mime = require("mime-types");

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
      const auth = new google.auth.OAuth2(clientId, clientSecret, redirectUri);
      auth.setCredentials({ refresh_token: refreshToken });
      const drive = google.drive({
        version: "v3",
        auth,
      });
      async function googleAPI(doType) {
        if (!clientId || !clientSecret || !refreshToken) {
          throw new Error("Missing token to access Google Drive");
        }

        if (!fileName) {
          msg = "Missing file name";
          send(msg);
          throw new Error("Missing file name");
        }
        if (!filePath) {
          throw new Error("Missing file path");
        }
        if (doType === "download" || doType === "read") {
          const params = {
            q: `name='${fileName}'`,
            fields: "files(id, name)",
            spaces: "drive",
          };
          let fileId = null;
          const response = await drive.files.list(params).then((res) => {
            fileId = res.data.files.length > 0 ? res.data.files[0]["id"] : null;
          });
          if (fileId) {
            return await drive.files.get(
              {
                fileId,
                alt: "media",
              },
              {
                responseType: "stream",
              }
            );
          }
        } else if (doType === "upload") {
          return await drive.files.create({
            requestBody: {
              name: fileName,
              mimeType: mime.lookup(fileName),
            },
            media: {
              mimeType: mime.lookup(fileName),
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
