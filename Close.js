

module.exports = function (RED) {
    function MediapipeClose(config){
        const mediapipeGlobalConfig = require('./MediapipeConfig.js');
        const node = this;
        RED.nodes.createNode(node, config);
        node.on("input", function (msg){
            try {
                mediapipeGlobalConfig.client.write('close');
                mediapipeGlobalConfig.mediapipeEnable = false;
                // mediapipeGlobalConfig.client.off('data');
                // mediapipeGlobalConfig.pid.kill('SIGINT');
                msg.payload = 'success';
            } catch (error) {
                console.log(error);
                msg.payload = 'fail';
            }
            node.send(msg);
        })
    }

    RED.nodes.registerType("close", MediapipeClose, {});
}