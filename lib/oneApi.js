const fs = require('fs');
const axios = require('axios');

const apiUrl = 'https://graph.microsoft.com/v1.0/me/drive/';

async function read(params) {
  if (!params.accessToken) {
    throw new Error('Missing Access Token');
  }
  if (!params.fileName) {
    throw new Error('Missing File Name');
  }

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

module.exports = {
  read,
};
