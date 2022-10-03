const net = require('net');
const mediapipeGlobalConfig = require('./MediapipeConfig.js');

function makeMessage(){
    return {
        _msgid: "41c3bb1b.1c25b4",
        payload: 1664815898371,
        topic: "",
    }
    
}

exports.send = function(){
    if(!mediapipeGlobalConfig.mediapipeEnable){
        console.log("Mediapipe is not set.");
        mediapipeGlobalConfig.running = false;
        return;
    }

    if(mediapipeGlobalConfig.queue.length == 0){
        mediapipeGlobalConfig.running = false;
        return;
    }else{
        mediapipeGlobalConfig.running = true;
        mediapipeGlobalConfig.client.write(mediapipeGlobalConfig.queue.shift());
    }
}

exports.setEventHandler = function(){
    // Set Event Listener
    mediapipeGlobalConfig.client.on('data', function(data) {
                    
        // receive data
        data = data.toString();
        data = JSON.parse(data);
        msg.payload = data.toString();

        switch (msg.command) {
            case "open":
                // Mediapipe Server connection is estblished.
                // send to Open node.
                mediapipeGlobalConfig.mediapipeEnable = true;
                mediapipeGlobalConfig.openNode.send(msg);
                break;

            case "close":
                removeEventHandler();
                mediapipeGlobalConfig.mediapipeEnable = false;
                mediapipeGlobalConfig.client = new net.Socket();
                mediapipeGlobalConfig.closeNode.send(msg);
                break;

            case "holistic":
                // => send to holistic node.
                mediapipeGlobalConfig.holisticNode.send(msg);
                send();
                break;
        
        }
    });

    // set disconnect event handler
    mediapipeGlobalConfig.client.on('disconnect', function(data) {
        try {
            mediapipeGlobalConfig.client.off('data');
            mediapipeGlobalConfig.client.off('disconnect');
        } catch (error) {
            console.log(error);
        }
        mediapipeGlobalConfig.mediapipeEnable = false;
    });
}

exports.removeEventHandler = function(){
    mediapipeGlobalConfig.client.off('data');
    mediapipeGlobalConfig.client.off('disconnect');
}