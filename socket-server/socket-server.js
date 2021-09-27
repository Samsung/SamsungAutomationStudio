"use strict"


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
            console.log(`Socket.io : 포트 ${port}이 준비되었습니다.`)
        })

        // CORS 설정 (아래 링크를 참고하였음)
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
            console.log(`Socket.io : 포트 ${port}에 클라이언트가 접속했습니다.`)

            socket.on('video', msg => {
                socketServer.emit('video', msg)
            })

            socket.on('echo', msg => {
                socketServer.emit('echo', `Socket.io : Hello from ${port}`)
            })
        })
        
        this.on('close', function() {
            // do something
        })
    }
    RED.nodes.registerType("socket-server", SocketServerNode)
}

