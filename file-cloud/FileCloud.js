const { google } = require('googleapis');
const axios = require('axios');

module.exports = function (RED) {
  function FileCloudNode(config) {
    RED.nodes.createNode(this, config);
    var node = this;
    node.status({});

    this.on('input', async (msg, send) => {
      const cloudType = config.cloudType;
      const fileName = msg.payload.fileName || config.fileName;
      const credentials = RED.nodes.getCredentials(config.id);
      const dataFormat = fileName ? fileName.split('.') : '';
      msg.dataFormat = dataFormat[dataFormat.length - 1];

      var param = {
        fileName,
      };

      if (cloudType === 'google') {
        const refreshToken = credentials.refreshToken;
        const redirectURI = 'https://developers.google.com/oauthplayground';
        const auth = new google.auth.OAuth2(
          credentials.clientId,
          credentials.clientSecret,
          redirectURI
        );
        auth.setCredentials({ refresh_token: refreshToken });
        const drive = google.drive({
          version: 'v3',
          auth,
        });
        param['drive'] = drive;
      } else if (cloudType === 'one') {
        const accessToken = credentials.accessToken;
        param['accessToken'] = accessToken;
      }

      var api = cloudType === 'google' ? googleRead : oneRead;

      api(param)
        .then((val) => {
          msg.data = val;
          send(msg);
        })
        .catch((error) => {
          node.status({ fill: 'red', shape: 'dot', text: 'error' });
          node.error('Read failed: ' + error.toString(), msg);
        });
    });
  }

  async function googleRead(params) {
    if (!params.drive) {
      throw new Error('Missing Drive');
    }
    if (!params.fileName) {
      throw new Error('Missing File Name');
    }
  
    var option = {
      q: `name='${params.fileName}'`,
      fields: 'files(id, name)',
      spaces: 'drive',
    };
    var response = await params.drive.files.list(option);
    const fileId = response.data.files[0].id;
  
    var response = await params.drive.files.get(
      {
        fileId: fileId,
        alt: 'media',
      },
      {
        responseType: 'arraybuffer',
      }
    );
    return Buffer.from(new Uint8Array(response.data));
  }

  async function oneRead(params) {
    if (!params.accessToken) {
      throw new Error('Missing Access Token');
    }
    if (!params.fileName) {
      throw new Error('Missing File Name');
    }

    const apiUrl = 'https://graph.microsoft.com/v1.0/me/drive/';
  
    var options = {
      method: 'GET',
      url: apiUrl + 'root:/' + encodeURIComponent(params.fileName),
      headers: {
        Authorization: 'Bearer ' + params.accessToken,
      },
    };
    var response = await axios(options);
    const fileId = response.data.id;
  
    var options = {
      method: 'GET',
      url: apiUrl + 'items/' + fileId + '/content',
      headers: {
        Authorization: 'Bearer ' + params.accessToken,
      },
      responseType: 'arraybuffer',
    };
    var response = await axios(options);
    return Buffer.from(new Uint8Array(response.data));
  }

  RED.nodes.registerType('FileCloud', FileCloudNode, {
    credentials: {
      accessToken: {type: 'password', required: true},
      clientId: {type: 'password', required: true},
      clientSecret: {type: 'password', required: true},
      refreshToken: {type: 'password', required: true}
    },
  });
};
