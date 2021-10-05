Stream = require('./index')
stream = new Stream({
  name: 'name',
  streamUrl: 'rtsp://wowzaec2demo.streamlock.net/vod/mp4:BigBuckBunny_115k.mov',
  wsPort: 9999,
  ffmpegOptions: { // options ffmpeg flags
    '-stats': '', // an option with no neccessary value uses a blank string
    '-r': '30', // options with required values specify the value after the key
    '-s': '160x120', 
  }
})