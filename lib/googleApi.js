const fs = require('fs');
const mime = require('mime-types');

async function download(params) {
  if (!params.drive) {
    throw new Error('Missing drive');
  }
  if (!params.fileName) {
    throw new Error('Missing fileName');
  }
  if (!params.filePath) {
    throw new Error('Missing filePath');
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
      responseType: 'stream',
    }
  );
  const item = response.data;
  const writeStream = fs.createWriteStream(
    `${params.filePath}/${params.fileName}`
  );

  var end = new Promise((resolve, reject) => {
    var buffer = [];
    item.on('data', (data) => {
      writeStream.write(data);
      buffer.push(data);
    });
    item.on('end', () => {
      writeStream.end();
      resolve(Buffer.concat(buffer));
    });
  });
  return await end;
}

async function upload(params) {
  if (!params.drive) {
    throw new Error('Missing drive');
  }
  if (!params.fileName) {
    throw new Error('Missing fileName');
  }
  if (!params.filePath) {
    throw new Error('Missing filePath');
  }

  const path = `${params.filePath}/${params.fileName}`;
  const data = await fs.promises.readFile(path);
  await params.drive.files.create({
    requestBody: {
      name: params.fileName,
      mimeType: mime.lookup(params.fileName),
    },
    media: {
      mimeType: mime.lookup(params.fileName),
      body: fs.createReadStream(path),
    },
  });
  return Buffer.from(data);
}

async function read(params) {
  if (!params.drive) {
    throw new Error('Missing drive');
  }
  if (!params.fileName) {
    throw new Error('Missing fileName');
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
  download,
  upload,
  read,
};
