const request = require('request-promise-native')
const fs = require('fs')


module.exports = RED => {
    const apiUrl = 'https://graph.microsoft.com/v1.0/me/drive/'
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
                switch (doType) {
                    case 'download':
                        var params = {
                            accessToken,
                            targetPath,
                            fileName,
                            filePath,
                        }
                        download(params)
                        break;
                    case 'upload':
                        var params = {
                            accessToken,
                            fileName,
                            filePath,
                            targetPath,
                            dataType,
                        }
                        upload(params)
                }
            } catch (error) {
                msg.payload = error
            } finally {
                msg.payload = `${filePath}/${fileName}`
                this.send(msg)
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
            uri: apiUrl + 'root:/' + params.targetPath + params.fileName,
            headers: {
                'Authorization': params.accessToken
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
        const item = request(options);
        const writeStream = fs.createWriteStream(`${params.filePath}/${params.fileName}`)

        item.pipe(writeStream)
        item.on('error', err => {
            throw err
        })
    }

    function upload(params) {
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

        var options = {
            method: 'PUT',
            uri: apiUrl + 'items/root:/' + params.targetPath + params.fileName + ':/content',
            headers: {
                'Authorization': params.accessToken,
                'Content-Type': mimeType[params.dataType],
            },
            body: fs.createReadStream(`${params.filePath}/${params.fileName}`, 'binary'),
        }
        request(options)
    }

    RED.nodes.registerType('OneDrive', OneDriveNode)
}
