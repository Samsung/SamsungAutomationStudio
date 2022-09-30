

module.exports = function (RED) {

    function logNode(config) {
        RED.nodes.createNode(this, config)
        var node = this;
        const fs = require('fs')

        node.on('input', function (msg, send) {

            let today = new Date();

            let date = today.toLocaleString()
            msg.payload.Date = date
            let directory = `${config.logDirectory}`
            const isExists = fs.existsSync(directory)
            if (!isExists) {
                fs.mkdirSync(directory, { recursive: true })
            }
            
            let fullPath = `${config.logDirectory}` + "/log-" + today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate()

            fs.appendFile(fullPath, JSON.stringify(msg.payload) + "\r\n", function (err) {
                if (err) throw err
            })

            return
        })
    }

    RED.nodes.registerType("log", logNode);
}