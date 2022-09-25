module.exports = function(RED){

    function ObjectDetectionNode(config){
        RED.nodes.createNode(this, config)
            var node = this;

    
            
        function HTML() {
            return require('./object-detection-html.js').code(config)
        }

            node.on('input', function(msg, send){
                let savedName = config.field;

                if(config.fieldType === "flow"){
                    config.registered = this.context().flow.get(String(savedName));
                }
                else if(config.fieldType === "global"){
                    config.registered = this.context().global.get(String(savedName));
                }
                else{
                    config.registered = this.context().node.get(String(savedName));
                }
                msg.payload = HTML()
                send = send || function(){this.send.apply(this, arguments)}
                send(msg)
            })
    }

    RED.nodes.registerType("object-detection", ObjectDetectionNode);
}
