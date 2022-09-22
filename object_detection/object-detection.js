module.exports = function(RED){

    function ObjectDetectionNode(config){

        RED.nodes.createNode(this, config);

        this.on('input', function(msg, send){
            console.log("module console " + msg.payload.dbSavedData);
            config.dbSavedData = msg.payload.dbSavedData;
            msg.payload = HTML()
            send = send || function(){this.send.apply(this, arguments)}
            send(msg)
        })

       

        function HTML() {
            return require('./object-detection-html.js').code(config)
        }
    }
    RED.nodes.registerType("object-detection", ObjectDetectionNode);


}
