"use strict"

const path = require('path')
const http = require('http')
const express = require('express')
const io = require('socket.io')
const { time } = require('console')


module.exports = function(RED) {

    // The node .js file defines the runtime behavior of the node.

    function WebsocketServerNode(config) {

        RED.nodes.createNode(this, config)

        const app = express()
        const httpServer = http.createServer(app).listen(1881, () => {
            console.log('포트 1881에 연결되었습니다.')
        })

        // CORS 설정
        // https://socket.io/docs/v3/handling-cors/
        const socketServer = io(httpServer, {
            cors: {
                origin: [
                    "http://localhost:1880",
                ],
                methods: ["GET", "POST"]
            }
        });
        socketServer.on('connection', socket => {
            console.log('connect client by Socket.io')

            socket.on('video', msg => {
                // console.log(msg)
                socketServer.emit('video', msg)
            })

            socket.on('echo', msg => {
                // console.log(msg)
                socketServer.emit('echo', 'hello from server')
            })
        })
        
        // listener to receive messages from the up-stream nodes in a flow.
        this.on('input', (msg, send, done) => {
            msg.payload = HTML()

            // send와 done은 1.0 버전 이후에 추가된 기능
            // 0.x 버전에서 호환되게끔 하려면 아래처럼 처리하면 됨
            if (done) {
                done()
            }
        
            // 인풋을 받은 후에 외부로 메시지를 보낼 때 (0.x 버전 호환)
            send = send || function() { this.send.apply(this, arguments )}
            send(msg)
        })
    
        // 외부로 메시지를 보낼 때
        this.send({ payload: 'this is message from WebsocketServerNode' })
    
        // 다른 플로우가 배포되면, 기존의 노드들은 삭제됩니다.
        // 이 삭제를 리스닝해서 무언가를 해야 한다면 아래처럼 하면 됩니다.
        this.on('close', function() {
            // do something
        })
    }
    RED.nodes.registerType("websocket-server", WebsocketServerNode)
}

