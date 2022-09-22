

module.exports = function (RED) {

    function logNode(config) {
        RED.nodes.createNode(this, config)
        var node = this;
        const fs = require('fs')

        node.on('input', function (msg, send) {
            let fullPath = `${config.logDirectory}` + "/" + "log2022-09-22.log"
            
            fs.appendFile(fullPath, JSON.stringify(msg.payload)+"\r\n", function (err) {
                if (err) throw err
            })

            send(msg)
        })
    }

    RED.nodes.registerType("log", logNode);
}