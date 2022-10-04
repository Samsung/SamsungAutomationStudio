const net = require('net');
const mediapipeGlobalConfig = require('./MediapipeConfig.js');

function removeEventHandler(){
    mediapipeGlobalConfig.client.off('data', onListen);
    mediapipeGlobalConfig.client.off('disconnect', onDisconnect);
}

function send() {
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


function onListen(data){
 
    // receive data
    data = data.toString();
    data = JSON.parse(data);
    let msg = {
        _msgid : data._msgid,
        payload : "",
        topic : ""
    };
    msg.payload = data.result;

    switch (data.command) {
        case "open":
            // Mediapipe Server connection is estblished.
            // send to Open node.
            mediapipeGlobalConfig.mediapipeEnable = true;
            mediapipeGlobalConfig.openNode.send(msg);
            break;
            
        case "close":
            removeEventHandler();
            mediapipeGlobalConfig.mediapipeEnable = false;
            mediapipeGlobalConfig.running = false;
            mediapipeGlobalConfig.client = new net.Socket();
            mediapipeGlobalConfig.closeNode.send(msg);
            break;
            
        case "holistic":
            // => send to holistic node.
            msg.payload = JSON.parse(msg.payload);
            mediapipeGlobalConfig.holisticNode.send(msg);
            send();
            break;
    }
}

function onDisconnect(){
    try {
        mediapipeGlobalConfig.client.off('data', onListen);
        mediapipeGlobalConfig.client.off('disconnect', onDisconnect);
    } catch (error) {
        console.log(error);
    }
    mediapipeGlobalConfig.mediapipeEnable = false;
}


function setEventHandler(){
    // Set Event Listener
    mediapipeGlobalConfig.client.on('data', onListen);

    // set disconnect event handler
    mediapipeGlobalConfig.client.on('disconnect', onDisconnect);
}

exports.removeEventHandler = removeEventHandler;
exports.send = send;
exports.setEventHandler = setEventHandler;