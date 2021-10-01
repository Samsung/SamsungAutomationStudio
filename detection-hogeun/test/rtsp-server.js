// 참고 링크
// https://www.npmjs.com/package/node-rtsp-stream
// https://webnautes.tistory.com/1476


// .env로부터 변수 호출
require("dotenv").config()
const mnid = process.env.SAMSUNG_MNID
const token = process.env.SAMSUNG_TOKEN


// rtsp로 수신한 스트리밍 데이터를 브로드캐스팅하는 웹소캣 서버 생성
const Stream = require('node-rtsp-stream')
const stream = new Stream({
    name: 'name',
    streamUrl: `rtsps://${mnid}:${token}@gateway36.ec2.st-av.net:8556/nrjrV5POcaLZgObluf7iS`,
    wsPort: 9999,
    ffmpegOptions: { // options ffmpeg flags
        '-stats': '', // an option with no neccessary value uses a blank string
        '-r': 30 // options with required values specify the value after the key
    }
})