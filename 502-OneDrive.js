const axios = require('axios');
const mimeType = require('mime-types');
const fs = require('fs');

module.exports = RED => {
    const apiUrl = 'https://graph.microsoft.com/v1.0/me/drive/'

    function OneDriveNode(config) {
        RED.nodes.createNode(this, config)

        this.on('input', msg => {
            const accessToken = config.accessToken
            const doType = config.doType
            const fileName = msg.payload.fileName || config.fileName
            const filePath = msg.payload.filePath || config.filePath

            try {
                const params = {
                    accessToken,
                    fileName,
                    filePath,
                }
                switch (doType) {
                    case 'download':
                        download(params).then((val) => {
                            msg.filePath = `${params.filePath}/${params.fileName}`;
                            msg.data = val;
                            this.send(msg);
                        });
                        break;
                    case 'upload':
                        upload(params).then((val) => {
                            msg.filePath = `${params.filePath}/${params.fileName}`;
                            msg.data = val;
                            this.send(msg);
                        });
                        break;
                    case 'read':
                        read(params).then((val) => {
                            msg.data = val;
                            this.send(msg);
                        });
                }
            } catch (error) {
                msg.payload = error;
                this.send(msg);
            } 
        })
    }

    async function download(params) {
        if (!params.accessToken) {
            throw new Error('Missing params.accessToken')
        }
        if (!params.fileName) {
            throw new Error('Missing params.fileName')
        }
        if (!params.filePath) {
            throw new Error('Missing params.filePath')
        }

        var options = {
            method: 'GET',
            url: apiUrl + 'root:/' + encodeURIComponent(params.fileName),
            headers: {
                'Authorization': 'Bearer ' + params.accessToken
            },
        }
        var response = await axios(options)
        const fileId = response.data.id

        const path = `${params.filePath}/${params.fileName}`;
        var options = {
            method: 'GET',
            url: apiUrl + 'items/' + fileId + '/content',
            headers: {
                'Authorization': 'Bearer ' + params.accessToken
            },
            responseType: 'stream'
        }
        var response = await axios(options);
        const item = response.data;
        const writeStream = fs.createWriteStream(path);

        var end = new Promise((resolve, reject) => {
            var buffer = [];
            item.on('data', (data) => {
                writeStream.write(data);
                buffer.push(data);
            })
            item.on('end', () => {
                writeStream.end();
                resolve(Buffer.concat(buffer));
            })
        })
        return await end;
    }

    async function upload(params) {
        if (!params.accessToken) {
            throw new Error('Missing params.accessToken')
        }
        if (!params.fileName) {
            throw new Error('Missing params.fileName')
        }
        if (!params.filePath) {
            throw new Error('Missing params.filePath')
        }

        const path = `${params.filePath}/${params.fileName}`;
        const data = await fs.promises.readFile(path);

        var options = {
            method: 'PUT',
            url: apiUrl + 'items/root:/' + encodeURIComponent(params.fileName) + ':/content',
            headers: {
                'Content-Type': mimeType.lookup(path),
                'Authorization': 'Bearer ' + params.accessToken,
            },
            data: data,
            encoding: null,
        }
        axios(options);
        return Buffer.from(data);
    }

    async function read(params) {
        if (!params.accessToken) {
            throw new Error('Missing params.accessToken')
        }
        if (!params.fileName) {
            throw new Error('Missing params.fileName')
        }

        var options = {
            method: 'GET',
            url: apiUrl + 'root:/' + encodeURIComponent(params.fileName),
            headers: {
                'Authorization': 'Bearer ' + params.accessToken
            },
        }
        var response = await axios(options);
        const fileId = response.data.id;
        
        var options = {
            method: 'GET',
            url: apiUrl + 'items/' + fileId + '/content',
            headers: {
                'Authorization': 'Bearer ' + params.accessToken
            },
        }
        var response = await axios(options);
        return Buffer.from(response.data);
    }

    RED.nodes.registerType('OneDrive', OneDriveNode)
}
