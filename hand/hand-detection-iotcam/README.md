# hand-detection-iotcam

A simple node that recognizes and visualizes hand using a external camera device which support Samsung Smartthings.

## Pre-requisites

First, hand-detection-iotcam node requires [FFmpeg](https://ffmpeg.org/) to be installed. This node uses FFmpeg to receive rtsp streaming data and display it to the screen.

Second, you need to update `node_modules/node-rtsp-stream/mpeg1muxer.js` like below.

```JavaScript
...
 this.spawnOptions = [
    "-rtsp_transport", "tcp", "-i",
    this.url,
    '-f',
    'mpeg1video',
    '-b:v', '1000k',
    '-maxrate', '1000k',
    '-bufsize', '1000k',
     '-an', '-r', '24',
    // additional ffmpeg options go here
    ...this.additionalFlags,
    '-'
  ]
...
```

## Usage

This node recognizes the coordinates of the hand by providing tracking for both hands in a browser environment.

This node provides exactly the same function as the `hand-detection-webcam` node, but there is a difference in using an external camera device. We recommend using Samsung's 'SmartThings' IoT camera. When the webcam recognizes the hand, 20 landmark coordinates are predicted and visually displayed as shown in the picture below.

![image](https://user-images.githubusercontent.com/30489264/136223035-decf4060-8a0d-4fb3-9fa7-8cffd1c2491e.png)

Specify the hands pose to save and press the capture button to record the pose model at a specific time. When the hands pose is captured, images and coordinate information are displayed. Check the registration status through the 'register' and 'cancel' buttons.

## Properties

### Server Url

URL address of your websocket server for monitoring and receiving streaming data from the camera. Do not include a prefix such as 'http://'. This is an attribute input item to facilitate both local and deployment environments. (default: 'localhost')

### Monitor Port

Port number to be used to monitor pose recognition results from other resources. To use properly, you need to match this value with `Monitor Port` attribute of [the monitor node](https://github.com/5FNSaaS/node-red-contrib-motion-pose/tree/master/monitor). (default: 1884)

### Rtsp Port

Port number to be used to receive streaming data from your Samsung Smartthings camera device. (default: 1886)

### Data Socket Url

Specify the URL including the endpoint to receive the user's pose recognition result data in real time using a WebSocket. (default: 'ws://localhost:1880/ws/data')

### Smartthings MNID

Your MNID to get access to your Samsung Smartthings camera device. You can check your MNID on [this page](https://smartthings.developer.samsung.com/partner/dashboard).

### Smartthings PAT

Your PAT to get access to your Samsung Smartthings camera device. You can generate a PAT on [this page](https://account.smartthings.com/login?redirect=https%3A%2F%2Faccount.smartthings.com%2Ftokens).

## Example

This is an example of a JSON string of data from a browser through a websocket. Note that if the data is newly registered data, the value of the `regist` is displayed as true. The coordinates of the unrecognized hand are assigned a null value.

```json
{
  "_id": {
    "$oid": "615d66a03211d3839b196999"
  },
  "left_hand_landmarks": [
    {
      "x": 0.3092707395553589,
      "y": 0.5108007192611694,
      "z": 0
    },
    {
      "x": 0.3847595453262329,
      "y": 0.42168834805488586,
      "z": 0.04432171210646629
    },
    // ...
  ],
  "right_hand_landmarks": null,
  "name": "HandsExample1"
}
```