
const ws = require('ws')
const http = require('http')
const cors = require('cors')
const express = require('express')
const Stream = require('node-rtsp-stream')

module.exports = function (RED) {

    function ObjectDetectionNode(config) {
        RED.nodes.createNode(this, config)
        var node = this;



        function HTML() {
            return require('./object-detection-html-iot.js').code(config)
        }

        node.on('input', function (msg, send) {
            const rtspUrl = msg.payload.com
            const rtspPort = config.rtspPort || 1886
            const app = express();

            app.use(cors({
                origin: true,
                credentials: true
            }))

            const httpServer = http.createServer(app)

            httpServer.once('error', err => {
                if (err.code === 'EADDRINUSE') {
                    console.log('WEbSocker [RTSP] : port ${rtspPort} is already in use.')
                }
            })

            httpServer.once('listening', () => {
                const stream = Stream
                stream.prototype = Stream.prototype
                stream.prototype.constructor = stream

                stream.prototype.pipeStreamToSeockerServer = function () {
                    this.wsServer = new ws.Server({
                        server: httpServer
                    })
                    this.wsServer.on('connection', (socker, requset) => {
                        return this.soSockerConnect(socker, requset)
                    })
                    this.wsServer.broadcast = function (data, opts) {
                        var results = []
                        for (let client of this.clients) {
                            if (client.readyState === 1) {
                                results.push(client.send(data, opts))
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
            send = send || function () { this.send.apply(this, arguments) }
            send(msg)
        })
        this.on('close', function () {
            rtspStream.stop()
        })
    }

    RED.nodes.registerType("object-detect-iotcam", PoseDetectIotcamNode, {
        credentials: {
            smartthingsMnid: { type: "text" },
            smartthingsPat: { type: "text" }
        }
    })
}
