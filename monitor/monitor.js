"use strict"


const http = require('http')
const express = require('express')
const io = require('socket.io')


module.exports = function(RED) {

    function MonitorNode(config) {

        function HTML() {
            const html = String.raw`
            <!DOCTYPE html>
            <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <meta http-equiv="X-UA-Compatible" content="IE=edge">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Document</title>
                    <script src="https://cdn.socket.io/4.1.2/socket.io.min.js" integrity="sha384-toS6mmwu70G0fw54EGlWWeA4z3dyJ+dlXBtSURSKN4vyRFOcxd3Bzjj/AoOwY+Rg" crossorigin="anonymous"></script>
                </head>
            <body>

                <img id="video" src="" />

                <script>
                    const videoElem = document.getElementById('video')
                
                    // construct socket client for monitoring.
                    // 소켓 클라이언트 인스턴스 생성
                    const monitorUrl = 'http://${config.serverUrl}:${config.monitorPort}'
                    const monitorSocket = io(monitorUrl)
                    monitorSocket.on("connect", () => {
                        console.log("Connection to the socket server has been completed.")
                    });

                    // delivering data from socket server to DOM element.
                    // 소켓 서버로부터 수신한 데이터를 화면에 출력
                    monitorSocket.on("video", (msg) => {
                        videoElem.src = msg
                    })
                </script>
            </body>
            </html>
            `
            return html
        }

        RED.nodes.createNode(this, config)

        let socketServer
        
        // on input event.
        // input 들어오면
        this.on('input', (msg, send, done) => {

            // construct socket server for monitoring.
            // 모니터 socket 서버 생성
            const port = config.monitorPort
            const app = express()
            const httpServer = http.createServer(app)

            // if port is busy, don't do anything but return html document.
            // port 사용 중이면 HTML 문서만 반환
            httpServer.once('error', err => {
                if (err.code === 'EADDRINUSE') {
                    console.log(`Socket.io : port ${port} is busy.`)
                }
            })

            // if port is available, run the socket server.
            // port 사용 가능할 경우, socket 서버 실행
            httpServer.once('listening', () => {
                console.log(`Socket.io : port ${port} is now ready.`)
        
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
                    console.log(`Socket.io : new client has connected to port ${port}.`)
        
                    socket.on('video', msg => {
                        socketServer.emit('video', msg)
                    })
                })
            })

            httpServer.listen(port)

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