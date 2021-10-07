"use strict"


const ws = require('ws')
const http = require('http')
const cors = require('cors')
const express = require('express')
const Stream = require('node-rtsp-stream')


module.exports = function(RED) {

    function HandDetectIotcamNode(config) {

        function HTML() {
            return require('./hand-iotcam-html.js').code(config)
        }

        RED.nodes.createNode(this, config)
        let rtspStream
        
        // listener to receive messages from the up-stream nodes in a flow.
        this.on('input', (msg, send, done) => {

            // construct socket server for RTSP.
            // RTSP socket 서버 생성
            const rtspUrl = msg.payload.components.main.videoStream.stream.value.OutHomeURL.split('//')[1]
            const rtspPort = config.rtspPort || 1886
            const app = express()

            // CORS config
            // CORS 설정
            app.use(cors({
                origin: true,
                credentials: true
            }))
            const httpServer = http.createServer(app)
            
            httpServer.once('error', err => {
                if (err.code === 'EADDRINUSE') {
                    console.log(`WebSocket [RTSP] : port ${rtspPort} is busy.`)
                }
            })
            
            httpServer.once('listening', () => {
                console.log(`WebSocket [RTSP] : port ${rtspPort} is now ready.`)
                const newStream = Stream
                newStream.prototype = Stream.prototype
                newStream.prototype.constructor = newStream

                // rtsp-stream method override.
                // rtsp-stream 메서드 오버라이드
                newStream.prototype.pipeStreamToSocketServer = function () {
                    
                    // CORS configed WebSocket Server.
                    // cors 처리한 WebSocket Server
                    this.wsServer = new ws.Server({
                        server: httpServer
                    })
                    this.wsServer.on("connection", (socket, request) => {
                        return this.onSocketConnect(socket, request)
                    })
                    this.wsServer.broadcast = function(data, opts) {
                        const results = []
                        for (let client of this.clients) {
                            if (client.readyState === 1) {
                                results.push(client.send(data, opts))
                            } else {
                                results.push(console.log("WebSocket Error [RTSP] : Client from remoteAddress " + client.remoteAddress + " not connected."))
                            }
                        }
                        return results
                    }
                    return this.on('camdata', (data) => {
                        return this.wsServer.broadcast(data)
                    })
                }
                
                const smartthingsMnid = this.credentials.smartthingsMnid
                const smartthingsPat = this.credentials.smartthingsPat
                
                rtspStream = new newStream({
                    name: 'name',
                    streamUrl: `rtsps://${smartthingsMnid}:${smartthingsPat}@${rtspUrl}`,
                    wsPort: rtspPort,
                    ffmpegOptions: { 
                        '-stats': '', 
                        '-r': 30 
                    }
                })
            })

            httpServer.listen(rtspPort)
            
            msg.payload = HTML()
            send = send || function() { this.send.apply(this, arguments )}
            send(msg)
        })
        
        this.on('close', function() {
            rtspStream.stop()
        })
    }
    RED.nodes.registerType("hand-detect-iotcam", HandDetectIotcamNode, {
        credentials: {
            smartthingsMnid: {type:"text"},
            smartthingsPat: {type:"text"}
        }
    })
}