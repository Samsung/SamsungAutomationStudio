

module.exports = function (RED) {

    function ObjectDetectionNode(config) {
        RED.nodes.createNode(this, config)
        var node = this;
        const fs = require('fs')

        node.on('input', function (msg, send) {

            let today = new Date();

            msg.payload.Date = today
            let directory = `${config.logDirectory}`
            const isExists = fs.existsSync(directory)
            if (!isExists) {
                fs.mkdirSync(directory, { recursive: true })
            }
            
            let fullPath = `${config.logDirectory}` + "/log-" + today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate()

            fs.appendFile(fullPath, JSON.stringify(msg.payload) + "\r\n", function (err) {
                if (err) throw err
            })

            return msg.payload
        })
    }

    RED.nodes.registerType("object-detection-log", ObjectDetectionNode);
}