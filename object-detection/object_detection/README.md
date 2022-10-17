# object-detection-node

A node that detect various objects, determine the interactions between a user and objects, and record logs.

Detectable objects are about 80 that are easy to see around us like table, cup, etc.

![캡처](https://user-images.githubusercontent.com/57743143/192708101-bda33886-d665-46de-9e0b-d73efa1ec0d1.PNG)

<br>

## Properties

![image](https://user-images.githubusercontent.com/57743143/192708281-79f7f7a6-eea6-4e1e-93c5-43bc24d9f659.png)

### Data Socket Url
Specify the URI including the endpoint when communicating data using the WebSocket. (default: 'ws://localhost:1880/ws/data')

### Register Socket Url
Specify the URI including the endpoint when registering recognizable objectsusing the WebSocket. (default: 'ws://localhost:1880/ws/register')

### Property
a name of the variable that saved regitstered object from database for object-node input

### Camera Test
You can check the webcam screen in advance in the node attribute.

<br>

## Example

This is an example of a JSON string of data from a browser through a websocket.

There are four outputs.

- **Detected object** :  output from coco-ssd object detection model,

- **Detected  objects (for registration)** : object name array for detectable object registration  

- **Detected  command (for registration)** : array composed of pose and object and command for registration 

- **Log information** : informations of detected objects per 1 min

<br>

### Detected object information

```javascript
{ dataType : "object",
  data : {
  			bbox: [x, y, width, height],
  			class: "person",
  			score: 0.8380282521247864
		}
}
```

### Detected objects information for registration

```javascript
{ dataType : "object",
  data : {"chair", "person", "cell phone"}
}
```

### Detected command information for registration

```javascript
{ dataType : "command",
  data : {"seat", "chair", "turn-on-tv"}
}
```

### Log information

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
