# Object-Person-Determine

A node that determines which of the detected objects most interacts with the user.

<br>

## Input message properties

 Two types of messages can come in. It consists of one incoming message for logging and one message for simple detection.
 
```
msg.payload = {
    log : {
        data : {
            bbox : [x, y, width, height],
            class : 'name',
            score : 0.xxxx
        },
        date : 'yyyy-MM-ddThh:mm:ss'
    },
}
```
```
msg.payload = {
    dataType : "object",
    data : {
  		bbox: [x, y, width, height],
  		class: "person",
		score: 0.8380282521247864
	}
}
```

<br>

## Output

Returns the contents of the thing the user is interacting with as output.

There is no return value if the user does not exist or there is no thing to interact with.

```
msg.payload = {
    object : 'name',
    isLog : 'false',
    date : 'yyyy-MM-ddThh:mm:ss'
}
```
