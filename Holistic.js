module.exports = function (RED) {
    function Holistic(config){
        const node = this;
        RED.nodes.createNode(node, config);
        const mediapipeGlobalConfig = require('./MediapipeConfig.js');
        mediapipeGlobalConfig.holisticNode = this;
        node.path = config.path;
        node.on("input", function (msg) {
            const requestData = {
                command : "holistic",
                path : ((node.path === "") ? msg.payload : node.path),
                result : "array"
            }

            // for debug 
            // if(!mediapipeGlobalConfig.mediapipeEnable){
            //     // exec(`python ${__dirname}/mediapipe/main.py`);
            //     // await sleep(4000);
            //     mediapipeGlobalConfig.mediapipeEnable = true;
                
            //     mediapipeGlobalConfig.client.on('data', function(data) {    
            //         // receive data
            //         msg.payload = data.toString();

            //         // MediaPipe is already open. result is holistic data
            //         // => send to holistic node.
            //         if(mediapipeGlobalConfig.mediapipeEnable){
            //             mediapipeGlobalConfig.holisticNode.send(msg);
            //             mediapipeGlobalConfig.send();
            //         }else{
            //             // Mediapipe Server connection is estblished.
            //             // send to Open node.
            //             mediapipeGlobalConfig.openNode.send(msg);
            //         }

            //     });

            //     mediapipeGlobalConfig.client.on('disconnect', function(data) {
            //         try {
            //             mediapipeGlobalConfig.client.off('data');
            //             mediapipeGlobalConfig.client.off('disconnect');
            //         } catch (error) {
            //             console.log(error);
            //         }
            //         mediapipeGlobalConfig.mediapipeEnable = false;
            //     });

            //     mediapipeGlobalConfig.client.connect(1881, '127.0.0.1', function() {
            //         const requestData = {
            //             command : "open"
            //         }
            //         mediapipeGlobalConfig.client.write(JSON.stringify(requestData));
            //     });
            //     }
            

            mediapipeGlobalConfig.queue.push(JSON.stringify(requestData));

            // if send function is Not working, Start send;
            if(!mediapipeGlobalConfig.running){
                mediapipeGlobalConfig.send();
            }

            // Sending result is handled together by Open.js.
            // node.send(msg.payload);
        });
    }

    RED.nodes.registerType("holistic", Holistic, {});
}