## object-detection-node

a node that detect various objects, determine the interactions between a user and objects, and record logs

detectable objects are about 80 that are easy to see around us like table, cup, etc

![캡처](C:\Users\multicampus\Desktop\캡처1.PNG)



### Properties

- **Data Socket Url**

  Specify the URI including the endpoint when communicating data using the WebSocket. (default: 'ws://localhost:1880/ws/data')

  ​

- **Register Socket Url**

  Specify the URI including the endpoint when registering recognizable objectsusing the WebSocket. (default: 'ws://localhost:1880/ws/register')

  ​

- **Property**

  a name of the variable that saved regitstered object from database for object-node input

  ​

- **Camera Test**

  You can check the webcam screen in advance in the node attribute.



### Example

This is an example of a JSON string of data from a browser through a websocket.



##### three outputs 

Detected object :  output from coco-ssd object detection model,

Detected  objects (for registration) : object name array for detectable object registration  

Detected  command (for registration) : array composed of pose and object and command for registration 

Log information : informations of detected objects per 1 min



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