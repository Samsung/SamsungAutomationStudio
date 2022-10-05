## object-detection-iot-node

a node that detect various objects, determine the interactions between a user and objects, and record logs

detectable objects are about 80 that are easy to see around us like table, cup, etc


### Pre-requisites

 object-detection-iot node requires [FFmpeg](https://ffmpeg.org/) to be installed. This node uses FFmpeg to receive rtsp streaming data and display it to the screen.

 And you need to update spawn option in `node_modules/node-rtsp-stream/mpeg1muxer.js` 

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

### Properties

- **RTSP port**
  Write the rtsp port number to use. (default: 1886)

- **Data Socket Url**

  Specify the URI including the endpoint when communicating data using the WebSocket. (default: 'ws://localhost:1880/ws/data')

- **Register Socket Url**

  Specify the URI including the endpoint when registering recognizable objectsusing the WebSocket. (default: 'ws://localhost:1880/ws/register')

- **Property**
  a name of the variable that saved regitstered object and motion-pose from database for object-node input
  ​
- **Camera Test**

  You can check the webcam screen in advance in the node attribute.

- **SmartThings MNID**
 Your MNID to get access to your Samsung SmartThings camera device. You can check your MNID on below link.
[here](https://us.account.samsung.com/accounts/v1/STWS/signInGate?response_type=code&locale=en&countryCode=US&client_id=3694457r8f&redirect_uri=https:%2F%2Fsmartthings.developer.samsung.com%2Fsa%2Fsignin%2Fcallback&state=VmpKMGIxTXlSa2hWV0d4V1lteHdjRlJVU2xOT2JHUlhXVE5vYTJKVldrcFdWbEYzVUZFOVBR&goBackURL=https:%2F%2Fsmartthings.developer.samsung.com)
- **SmartThings PAT**
  Your PAT to get access to your Samsung SmartThings camera device. You can generate a PAT on below link.
[here](https://account.samsung.com/accounts/v1/ST/signInGate?response_type=code&client_id=4dt548jm01&redirect_uri=https:%2F%2Faccount.smartthings.com%2FssoCallback&goBackURL=https:%2F%2Faccount.smartthings.com%2Flogin&state=aec1fdbff5b0ad01952ead31d9cd3205c3afa4c2cd3e7803645ceb1c46daac59aHR0cHM6Ly9hY2NvdW50LnNtYXJ0dGhpbmdzLmNvbS90b2tlbnM%3D&countryCode=&locale=ko)

### Example

This is an example of a JSON string of data from a browser through a websocket.



##### four outputs 

**Detected object** :  output from coco-ssd object detection model,

**Detected  objects (for registration)** : object name array for detectable object registration  

**Detected  command (for registration)** : array composed of pose and object and command for registration 

**Log information** : informations of detected objects per 1 min



#### detected object information

```javascript
{ dataType : "object",
  data : {
  			bbox: [x, y, width, height],
  			class: "person",
  			score: 0.8380282521247864
		}
}
```

#### detected objects information for registration

```javascript
{ dataType : "object",
  data : {"chair", "person", "cell phone"}
}
```

#### detected command information for registration

```javascript
{ dataType : "command",
  data : {"seat", "chair", "turn-on-tv"}
}
```

#### log information

```javascript
{ log : {
    data : [
      		{
      		bbox: [x, y, width, height],
  			class: "person",
  			score: 0.8380282521247864
  				},
  			{
  			bbox: [x, y, width, height],
  			class: "chair",
  			score: 0.8380282521247864
  			}
    ]
    date : "수요일, 2022년 9월 28일, 오후 3:20"
}
 
```
