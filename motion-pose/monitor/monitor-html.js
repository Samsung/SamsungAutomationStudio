module.exports.code = (config) => {
  return String.raw`
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
}