const request = require('request-promise-native')
const fs = require('fs')

module.exports = RED => {
    const apiUrl = 'https://graph.microsoft.com/v1.0/me/drive/'
    const mimeType = {
        pdf: "application/pdf",
        text: "text/plain",
        xml: "text/xml",
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
    }

    function OneDriveNode(config) {
        RED.nodes.createNode(this, config)

        this.on('input', msg => {
            const accessToken = config.accessToken
            const doType = config.doType
            const fileName = msg.payload.fileName || config.fileName
            const filePath = msg.payload.filePath || config.filePath
            const targetPath = msg.payload.targetPath || config.targetPath
            const dataType = msg.payload.dataType || config.dataType

            try {
                const params = {
                    accessToken,
                    targetPath,
                    fileName,
                    filePath,
                    dataType,
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
            uri: apiUrl + 'root:/' + encodeURIComponent(params.targetPath + params.fileName),
            headers: {
                'Authorization': 'Bearer ' + params.accessToken
            },
        }
        var response = await request(options)
        const fileId = JSON.parse(response).id
        
        const path = `${params.filePath}/${params.fileName}`;
        var options = {
            method: 'GET',
            uri: apiUrl + 'items/' + fileId + '/content',
            headers: {
                'Authorization': 'Bearer ' + params.accessToken
            },
        }
        const item = request(options);
        const writeStream = fs.createWriteStream(path);
        item.pipe(writeStream);

        const data = await item;
        return Buffer.from(data);
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
        if (!params.dataType) {
            throw new Error('Missing params.dataType')
        }

        const path = `${params.filePath}/${params.fileName}`;
        const data = await fs.promises.readFile(path);
        var options = {
            method: 'PUT',
            uri: apiUrl + 'items/root:/' + encodeURIComponent(params.targetPath + params.fileName) + ':/content',
            headers: {
                'Content-Type': mimeType[params.dataType],
                'Authorization': 'Bearer ' + params.accessToken,
            },
            body: data,
            encoding: null,
        }
        request(options);
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
            uri: apiUrl + 'root:/' + encodeURIComponent(params.targetPath + params.fileName),
            headers: {
                'Authorization': 'Bearer ' + params.accessToken
            },
        }
        var response = await request(options)
        const fileId = JSON.parse(response).id
        
        var options = {
            method: 'GET',
            uri: apiUrl + 'items/' + fileId + '/content',
            headers: {
                'Authorization': 'Bearer ' + params.accessToken
            },
        }
        const data = await request(options);
        return Buffer.from(data);
    }

    RED.nodes.registerType('OneDrive', OneDriveNode)
}
