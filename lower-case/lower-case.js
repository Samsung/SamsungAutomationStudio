module.exports = function(RED) {
    // config 는 어디서 생긴 걸까?
    function LowerCaseNode(config) {
        RED.nodes.createNode(this, config)
        this.prefix = config.prefix
        var node = this
        node.on('input', function(msg) {
        msg.payload = msg.payload.toLowerCase()
        node.send(msg)
        })
    }
    RED.nodes.registerType("lower-case", LowerCaseNode)
}

// The node .js file defines the runtime behavior of the node.

function SampleNode(config) {
    RED.nodes.createNode(this, config)

    // node specific codes below.

    // listener to receive messages from the up-stream nodes in a flow.
    this.on('input', (msg, send, done) => {
        // do something
        // 참고로 send와 done은 1.0 버전 이후에 추가된 기능

        // 0.x 버전에서 호환되게끔 하려면 아래처럼 처리하면 됨
        if (done) {
        done();
        }

        // 인풋을 받은 후에 외부로 메시지를 보낼 때 (0.x 버전 호환)
        send = send || function() { this.send.apply(this, arguments )}
        send(msg)
    })

    // 외부로 메시지를 보낼 때
    this.send({ payload: 'this is message from SampleNode' })

    // 여러개의 아웃풋에 메시지를 보낼 때
    this.send([ msg1, msg2 ])

    // 여러 아웃풋에 각각 여러개의 메시지를 보낼 때
    this.send([ [msgA1, msgA2], msgB ])

    // 다른 플로우가 배포되면, 기존의 노드들은 삭제됩니다.
    // 이 삭제를 리스닝해서 무언가를 해야 한다면 아래처럼 하면 됩니다.
    this.on('close', function() {
        // do something
    })

}
RED.nodes.registerType("sample", SampleNode, {
    // settings
    settings: {
        // 반드시 camelCase로 작성되어야 하며,
        // 노드 이름으로 시작해야 한다.
        // 아래처럼 작성하면 'colour' 속성이 추가되는 것이다.
        sampleNodeColour: {
        value: 'red',
        exportable: true
        }
    }
})