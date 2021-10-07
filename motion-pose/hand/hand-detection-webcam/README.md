# hand-detection-webcam

A simple node that recognizes and visualizes hand using a webcam.

## Usage

This node recognizes the coordinates of the hand by providing tracking for both hands in a browser environment.

Basically, we use a computer-mounted webcam device. When the webcam recognizes the hand, 20 landmark coordinates are predicted and visually displayed as shown in the picture below.

![image](https://user-images.githubusercontent.com/30489264/136223035-decf4060-8a0d-4fb3-9fa7-8cffd1c2491e.png)

Specify the hands pose to save and press the capture button to record the pose model at a specific time. When the hands pose is captured, images and coordinate information are displayed. Check the registration status through the 'register' and 'cancel' buttons.

## Properties

### Server Url

URL address of your websocket server for monitoring. Do not include a prefix such as 'http://'. This is an attribute input item to facilitate both local and deployment environments. (default: 'localhost')

### Monitor Port

Port number to be used to monitor pose recognition results from other resources. To use properly, you need to match this value with `Monitor Port` attribute of [the monitor node](https://github.com/5FNSaaS/node-red-contrib-motion-pose/tree/master/monitor). (default: 1883)

### Data Socket Url

Specify the URI including the endpoint when communicating data using the WebSocket. (default: 'ws://localhost:1880/ws/data')

### Camera Test

You can check the webcam screen in advance in the node attribute.

## Example

This is an example of a JSON string of data from a browser through a websocket. Note that if the data is newly registered data, the value of the `regist` is displayed as true. The coordinates of the unrecognized hand are assigned a null value.

```json
{
  "multiHandLandmarks": [
    [
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
     [
      {
        "x": 0.613612711429596
        "y": 0.6383929252624512
        "z": 0
      },
      {
        "x": 0.5581011176109314
        "y": 0.626939594745636
        "z": -0.00810244306921959
      },
      // ...
  ],
  "multiHandLandmarks": [
    {
      "index":0,
      "score":0.96533203125,
      "label":"Left"
    },
    {
      "index":1,
      "score":0.953643798828125,
      "label":"Right"
    }
   ],
  "regist": true
  "poseName": "HandsExample1"
}
```
