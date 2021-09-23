"use strict"

const path = require('path')
const http = require('http')
const express = require('express')
const io = require('socket.io')


module.exports = function(RED) {

    // The node .js file defines the runtime behavior of the node.

    function SocketServerNode(config) {

        RED.nodes.createNode(this, config)

        const port = config.port
        const app = express()
        const httpServer = http.createServer(app).listen(port, () => {
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
    
        // 다른 플로우가 배포되면, 기존의 노드들은 삭제됩니다.
        // 이 삭제를 리스닝해서 무언가를 해야 한다면 아래처럼 하면 됩니다.
        this.on('close', function() {
            // do something
        })
    }
    RED.nodes.registerType("socket-server", SocketServerNode)
}

