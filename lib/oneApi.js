const fs = require("fs");
const axios = require("axios");
const mime = require("mime-types");

const apiUrl = "https://graph.microsoft.com/v1.0/me/drive/";

async function download(params) {
  if (!params.accessToken) {
    throw new Error("Missing accessToken");
  }
  if (!params.fileName) {
    throw new Error("Missing fileName");
  }
  if (!params.filePath) {
    throw new Error("Missing filePath");
  }

  var options = {
    method: "GET",
    url: apiUrl + "root:/" + encodeURIComponent(params.fileName),
    headers: {
      Authorization: "Bearer " + params.accessToken,
    },
  };
  var response = await axios(options);
  const fileId = response.data.id;

  const path = `${params.filePath}/${params.fileName}`;
  var options = {
    method: "GET",
    url: apiUrl + "items/" + fileId + "/content",
    headers: {
      Authorization: "Bearer " + params.accessToken,
    },
    responseType: "stream",
  };
  var response = await axios(options);
  const item = response.data;
  const writeStream = fs.createWriteStream(path);

  var end = new Promise((resolve, reject) => {
    var buffer = [];
    item.on("data", (data) => {
      writeStream.write(data);
      buffer.push(data);
    });
    item.on("end", () => {
      writeStream.end();
      resolve(Buffer.concat(buffer));
    });
  });
  return await end;
}

async function upload(params) {
  if (!params.accessToken) {
    throw new Error("Missing accessToken");
  }
  if (!params.fileName) {
    throw new Error("Missing fileName");
  }
  if (!params.filePath) {
    throw new Error("Missing filePath");
  }

  const path = `${params.filePath}/${params.fileName}`;
  const data = await fs.promises.readFile(path);

  var options = {
    method: "PUT",
    url: apiUrl + "items/root:/" + encodeURIComponent(params.fileName) + ":/content",
    headers: {
      "Content-Type": mime.lookup(path),
      Authorization: "Bearer " + params.accessToken,
    },
    data: data,
    encoding: null,
  };
  axios(options);
  return Buffer.from(data);
}

async function read(params) {
  if (!params.accessToken) {
    throw new Error("Missing accessToken");
  }
  if (!params.fileName) {
    throw new Error("Missing fileName");
  }

  var options = {
    method: "GET",
    url: apiUrl + "root:/" + encodeURIComponent(params.fileName),
    headers: {
      Authorization: "Bearer " + params.accessToken,
    },
  };
  var response = await axios(options);
  const fileId = response.data.id;

  var options = {
    method: "GET",
    url: apiUrl + "items/" + fileId + "/content",
    headers: {
      Authorization: "Bearer " + params.accessToken,
    },
  };
  var response = await axios(options);
  return Buffer.from(response.data);
}

module.exports = {
  download,
  upload,
  read
};