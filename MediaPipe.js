// "child_process": "^1.0.2",
// "util": "^0.12.4"
const util = require('util');
const net = require('net');
const exec = util.promisify(require('child_process').exec);

module.exports = function (RED) {
    this.client = new net.Socket();
    this.mediapipeEnable = false;

    function MediapipeOpen(config){
        const node = this;
        RED.nodes.createNode(node, config);
        
        node.on("input", function (msg) {
            try {
                this.pid = exec(`python ./mediapipe/main.py`);
                
                this.client.on('data', function(data) {
                    msg.payload = data;
                    node.send(msg);
                });

                this.client.connect(1881, '127.0.0.1', function() {
                    this.client.write('sendTest');
                });
            } catch (error) {
                console.log(error);
                msg.payload = 'fail';
            }

            node.send(msg);
        });
    }

    function MediapipeClose(config){
        const node = this;
        RED.nodes.createNode(node, config);
        
        node.on("input", function (msg){
            try {
                this.client.write('close');
                this.client.off('data');
                this.pid.kill('SIGINT');
                msg.payload = 'sucess';
            } catch (error) {
                console.log(error);
                msg.payload = 'fail';
            }

            node.send(msg);
        })

    }

    function Holistic(config){
        const node = this;
        RED.nodes.createNode(node, config);
        this.py = require('./mediapipe/py');

        node.on("input", async function (msg) {
            this.client.write(msg.payload);
            print(1);
            // node.status(200).send(msg);
            // node.error(e);
        });
    }


    RED.nodes.registerType("open", MediapipeOpen, {});
    RED.nodes.registerType("close", MediapipeClose, {});
    RED.nodes.registerType("holistic", Holistic, {});
}