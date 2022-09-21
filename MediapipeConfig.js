const net = require('net');

module.exports = {
    client: new net.Socket(),
    mediapipeEnable : false,
    pid : 0,
    openNode : null,
    holisticNode : null
}
