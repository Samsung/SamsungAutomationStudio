# pose-detect-webcam

A simple node that recognizes and visualizes pose using a webcam.

## Usage

This node provides body tracking in a browser environment to recognize body pose.

Basically, we use webcam devices mounted on computers. When a person is recognized on a webcam, 33 landmark coordinates are predicted and visually shown as shown in the picture below.

![image](https://user-images.githubusercontent.com/30489264/136204900-ef4e1304-bca2-41e6-bc31-00aaf3df2467.png)

Specify a pose to save and press the capture button to record the pose model at a specific time. When the pose is captured, the image and coordinate information are displayed. Check the registration status through the `register` and `cancel` buttons.

## Properties

### Server Url

URL address of your websocket server for monitoring. Do not include a prefix such as 'http://'. This is an attribute input item to facilitate both local and deployment environments. (default: 'localhost')

### Monitor Port

Port number to be used to monitor pose recognition results from other resources. To use properly, you need to match this value with `Monitor Port` attribute of [the monitor node](https://github.com/5FNSaaS/node-red-contrib-motion-pose/tree/master/monitor). (default: 1881)

### Data Socket Url

Specify the URI including the endpoint when communicating data using the WebSocket. (default: 'ws://localhost:1880/ws/data')

### Camera Test

You can check the webcam screen in advance in the node attribute.

## Example

This is an example of a JSON string of data from a browser through a websocket. Note that if the data is newly registered data, the value of the `regist` is displayed as true.

```json
{
  "image": {},
  "poseLandmarks": [
    {
      "x": 0.49571552872657776,
      "y": 0.7027847766876221,
      "z": -0.4364425241947174,
      "visibility": 0.999972939491272
    },
    {
      "x": 0.5213351845741272,
      "y": 0.6515322923660278,
      "z": -0.4486660063266754,
      "visibility": 0.9999632239341736
    },
    // ...
  ],
  "poseWorldLandmarks": [
    {
      "x": -0.04314113035798073,
      "y": -0.5568732023239136,
      "z": -0.2147870659828186,
      "visibility": 0.999972939491272
    },
    {
      "x": -0.021963711827993393,
      "y": -0.5950214266777039,
      "z": -0.21838122606277466,
      "visibility": 0.9999632239341736
    },
    // ...
  ],
  "segmentationMask": {},
  "regist": true,
  "poseName": "Pose Example 1"
}
```