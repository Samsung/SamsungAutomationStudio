const net = require('net');

module.exports = {
    client: new net.Socket(),
    mediapipeEnable : false,
    openNode : null,
    closeNode : null,
    holisticNode : null,
    running : false,
    queue : []
}
