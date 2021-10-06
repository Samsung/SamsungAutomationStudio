# hand-detection-webcam

A simple node that recognizes and visualizes hand using a webcam.

## Usage

This node recognizes the coordinates of the hand by providing tracking for both hands in a browser environment.

This node provides exactly the same function as the `hand-detection-webcam` node, but there is a difference in using an external camera device. We recommend using Samsung's 'SmartThings' IoT camera. When the webcam recognizes the hand, 20 landmark coordinates are predicted and visually displayed as shown in the picture below.

![image](https://user-images.githubusercontent.com/30489264/136223035-decf4060-8a0d-4fb3-9fa7-8cffd1c2491e.png)

Specify the hands pose to save and press the capture button to record the pose model at a specific time. When the hands pose is captured, images and coordinate information are displayed. Check the registration status through the 'register' and 'cancel' buttons.

## Properties

### Server Url

URL address of your websocket server. Server receives the user's hands pose recognition result in real time using a WebSocket. Do not include a prefix such as 'http://'. This is an attribute input item to facilitate both local and deployment environments.

### Mirror Port

Port number to be used to monitor hands pose recognition results from other resources. (default: 1881)

### Data Socket Url

Specify the URI including the endpoint when communicating data using the WebSocket. (default: 'ws://localhost:1880/ws/data')

### Camera Test

You can check the webcam screen in advance in the node attribute.

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