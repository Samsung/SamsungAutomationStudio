const util = require('util');

const exec = util.promisify(require('child_process').exec);

function sleep(ms) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}

module.exports = function (RED) {
    function MediapipeOpen(config){
        const mediapipeGlobalConfig = require('./MediapipeConfig.js');
        const mediapipeFunction = require('./MediapipeFunction.js');

        const node = this;
        
        RED.nodes.createNode(node, config);
        mediapipeGlobalConfig.openNode = this;
        node.on("input", async function (msg) {
            try {
                if(mediapipeGlobalConfig.mediapipeEnable) 
                    return;

                exec(`python ${__dirname}/mediapipe/main.py`);
                await sleep(4000);

                mediapipeFunction.setEventHandler();

                // connect to mediapipe server
                mediapipeGlobalConfig.client.connect(1881, '127.0.0.1', function() {
                    const requestData = {
                        _msgid : msg._msgid,
                        command : "open"
                    }
                    // request open server
                    mediapipeGlobalConfig.client.write(JSON.stringify(requestData));
                });

                // Sending result is handled together by MediapipeFunction.js/setEventHandler
                // node.send(msg.payload);

            } catch (error) {
                console.log(error);
                msg.payload = 'fail';
                node.send(msg);
            }
        });

    }

    RED.nodes.registerType("open", MediapipeOpen, {});
}