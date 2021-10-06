const { google } = require('googleapis');

module.exports = function (RED) {
  const googleApi = require('./lib/googleApi');
  const oneApi = require('./lib/oneApi');

  function FileCloudNode(config) {
    RED.nodes.createNode(this, config);
    var node = this;
    node.status({});

    this.on('input', async (msg, send) => {
      const doType = config.doType;
      const cloudType = config.cloudType;
      const fileName = msg.payload.fileName || config.fileName;
      const filePath = msg.payload.filePath || config.filePath;
      const dataFormat = fileName.split('.');
      msg.dataFormat = dataFormat[dataFormat.length - 1];
      var param = {
        fileName,
        filePath,
      };

      if (cloudType === 'google') {
        const refreshToken = config.refreshToken;
        const redirectURI = 'https://developers.google.com/oauthplayground';
        const auth = new google.auth.OAuth2(
          config.clientId,
          config.clientSecret,
          redirectURI
        );
        auth.setCredentials({ refresh_token: refreshToken });
        const drive = google.drive({
          version: 'v3',
          auth,
        });
        param['drive'] = drive;
      } else if (cloudType === 'one') {
        const accessToken = config.accessToken;
        param['accessToken'] = accessToken;
      }

      switch (doType) {
        case 'download':
          var api = cloudType === 'google' ? googleApi : oneApi;
          api
            .download(param)
            .then((val) => {
              msg.filePath = `${filePath}/${fileName}`;
              msg.data = val;
              send(msg);
            })
            .catch((error) => {
              node.status({ fill: 'red', shape: 'dot', text: 'error' });
              node.error('Download failed: ' + error.toString(), msg);
            });
          break;
        case 'upload':
          var api = cloudType === 'google' ? googleApi : oneApi;
          api
            .upload(param)
            .then((val) => {
              msg.filePath = `${filePath}/${fileName}`;
              msg.data = val;
              send(msg);
            })
            .catch((error) => {
              node.status({ fill: 'red', shape: 'dot', text: 'error' });
              node.error('Upload failed: ' + error.toString(), msg);
            });
          break;
        case 'read':
          var api = cloudType === 'google' ? googleApi : oneApi;
          api
            .read(param)
            .then((val) => {
              msg.data = val;
              send(msg);
            })
            .catch((error) => {
              node.status({ fill: 'red', shape: 'dot', text: 'error' });
              node.error('Read failed: ' + error.toString(), msg);
            });
      }
    });
  }

  RED.nodes.registerType('FileCloud', FileCloudNode);
};
