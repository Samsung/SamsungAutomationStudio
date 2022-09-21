const mediapipeGlobalConfig = require('./MediapipeConfig.js');

module.exports = function (RED) {
    function MediapipeClose(config){
        const node = this;
        RED.nodes.createNode(node, config);
        
        node.on("input", function (msg){
            try {
                mediapipeGlobalConfig.client.write('close');
                mediapipeGlobalConfig.client.write('close');
                mediapipeGlobalConfig.client.off('data');
                mediapipeGlobalConfig.pid.kill('SIGINT');
                msg.payload = 'sucess';
            } catch (error) {
                console.log(error);
                msg.payload = 'fail';
            }
            node.send(msg);
        })
    }

    RED.nodes.registerType("close", MediapipeClose, {});
}