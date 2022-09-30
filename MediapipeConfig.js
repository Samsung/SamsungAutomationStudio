const net = require('net');

module.exports = {
    client: new net.Socket(),
    mediapipeEnable : false,
    pid : 0,
    openNode : null,
    holisticNode : null,
    running : false,
    queue : [],
    send : function(){
        if(!this.mediapipeEnable){
            console.log("Mediapipe is not set.");
            this.running = false;
            return;
        }

        if(this.queue.length == 0){
            this.running = false;
            return;
        }else{
            this.running = true;
            this.client.write(this.queue[0]);
            this.queue.shift();
        }

    },
}
