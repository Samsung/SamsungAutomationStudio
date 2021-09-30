// 참고 링크
// https://www.npmjs.com/package/node-rtsp-stream
// https://webnautes.tistory.com/1476

Stream = require('node-rtsp-stream')
stream = new Stream({
  name: 'name',
  streamUrl: 'rtsps://fel4:59959be1-9652-4d67-8a85-2abee2ef3307@gateway36.ec2.st-av.net:8556/4tL1PeEi81PJKzMgK0goS',
//   streamUrl: 'rtsp://wowzaec2demo.streamlock.net/vod/mp4:BigBuckBunny_115k.mov',
  wsPort: 9999,
  ffmpegOptions: { // options ffmpeg flags
    '-stats': '', // an option with no neccessary value uses a blank string
    '-r': 30 // options with required values specify the value after the key
  }
})