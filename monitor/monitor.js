"use strict"


const http = require('http')
const express = require('express')
const io = require('socket.io')


module.exports = function(RED) {

    function MonitorNode(config) {

        function HTML() {
            return require('./monitor-html.js').code(config)
        }

        RED.nodes.createNode(this, config)

        // construct socket server for monitoring.
        // 모니터 socket 서버 생성
        const port = config.monitorPort
        const app = express()
        const httpServer = http.createServer(app)
        let socketServer

        // if port is busy, don't do anything but return html document.
        // port 사용 중이면 HTML 문서만 반환
        httpServer.once('error', err => {
            if (err.code === 'EADDRINUSE') {
                console.log(`Socket.io [monitor] : port ${port} is busy.`)
            }
        })

        // if port is available, run the socket server.
        // port 사용 가능할 경우, socket 서버 실행
        httpServer.once('listening', () => {
            console.log(`Socket.io [monitor] : port ${port} is now ready.`)
    
            // config for CORS. (I referenced the link below)
            // CORS 설정 (아래 링크를 참고하였음)
            // https://socket.io/docs/v3/handling-cors/
            socketServer = io(httpServer, {
                cors: {
                    origin: [
                        "http://localhost:1880",
                        `http://${config.serverUrl}:1880`,
                    ],
                    methods: ["GET", "POST"]
                }
            });

            // socket server event handler.
            // socket 서버 이벤트 핸들러
            socketServer.on('connection', socket => {
                console.log(`Socket.io [monitor] : new client has connected to port ${port}.`)
    
                socket.on('video', msg => {
                    socketServer.emit('video', msg)
                })
            })
        })

        httpServer.listen(port)
        
        // on input event.
        // input 들어오면
        this.on('input', (msg, send, done) => {

            // Return HTML document to the client.
            // 클라이언트에 HTML 문서 반환
            msg.payload = HTML()
            send = send || function() { this.send.apply(this, arguments )}
            send(msg)
        })
        
        // if flow is closed, socket server would be closed.
        // flow 중단되면, socket server 종료
        this.on('close', function() {
            socketServer.close()
        })
    }
    RED.nodes.registerType("monitor", MonitorNode)
}