# hand-register

This node receives a number of input key points (ex: sequence of continuous time) and determines the similarity to the saved hands pose, and whether registration is possible.

Please check the following [link(Determination of Similarity)](https://github.com/5FNSaaS/node-red-contrib-motion-pose/wiki/Determination-of-similarity) for the method referenced to calculate the similarity between poses (described in our project wiki topic).

## Key Point Definition

`(left/right)_hand_landmarks` represents the position coordinates of a specific hand pose calculated by detection. Objects represented by location are stored in an array.

```
Key point : [ ... ,{"x": float, "y":float, "z":float}, ...]
```

## Usage

This node is used when a new hand pose is entered that the user wishes to register with a new pose.

To this end, the node must receive a pose array that has already been stored as an input. 

If there is a similar pose, return the similarity with the name of the pose. If you have a similar pose, refer to the 'Status' of the output data.

## Input

### multiHandLandmarks

It is the coordinate arrangement of the recognized hand. Each hand is marked with a list of 21 landmarks and has values of {x, y, z}.

### multiHandedness

It is an attribute of the recognized hand information. Each hand has a `label` value indicating which hand it is, and a `score` value indicating the estimated accuracy of the hand.

### savedLeftHand / savedRightHand

It is an arrangement in which the coordinates of the left/right hand are stored to compare the similarity with the input hand pose.

### savedNameList

This is an arrangement in which the name of the hand coordinates is stored to compare the similarity with the input hand pose. The order of indexes matches the coordinate order of `savedLeft(Right)Hand`.

### poseName

This is the name of the pose the user wishes to save the hand pose.

## Output

### status

Returns whether there is a pose similar to the pose entered in real-time. In other words, if a matching pose is found, return 'true' and if not, return 'false'.

### handName

Returns the name of the most similar pose if there is a similar action. However, if there is no action that is judged to be similar, null is returned. In other words, it represents a meaningful value only when status is true.

### inputLeftHand / inputRightHand

This is the coordinate value of each hand that is returned when the hand pose can be registered (not already registered). It completely matches the input value of this node, `(left/right)_hand_landmarks` of `multiHandLandmarks`.
