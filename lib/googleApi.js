const fs = require('fs');

async function read(params) {
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

module.exports = {
  read,
};
