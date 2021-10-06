# hand-find

This node receives a number of input key points (ex: sequence of continuous time) and determines the similarity to the saved hands pose, and derives the most similar pose.

Please check the following [link(Determination of Similarity)](https://github.com/5FNSaaS/node-red-contrib-motion-pose/wiki/Determination-of-similarity) for the method referenced to calculate the similarity between poses (described in our project wiki topic).

## Key Point Definition

`(left/right)_hand_landmarks` represents the position coordinates of a specific hand pose calculated by detection. Objects represented by location are stored in an array.

```
Key point : [ ... ,{"x": float, "y":float, "z":float}, ...]
```

## Usage

This node finds a pose similar to the hands pose model that is entered in real time. If the user maintains his or her behavior for a certain period of time, it is determined that he or she has taken a specific pose.

To this end, the node must receive a pose array that has already been stored as input and a pose array that has been maintained for a specific time. 

If there is a similar pose, return the similarity with the name of the pose. If you have a similar pose, refer to 'Status' of the output data.

## Input

### multiHandLandmarks

It is the coordinate array of the recognized hand. Each hand is marked with a list of 21 landmarks and has values of {x, y, z}.

### multiHandedness

It is an attribute of the recognized hand information. Each hand has a `label` value indicating which hand it is, and a `score` value indicating the estimated accuracy of the hand.

### savedLeftHand / savedRightHand

It is an array in which the coordinates of the left/right hand are stored to compare the similarity with the input hand pose.

### savedNameList

This is an array in which the name of the hand coordinates is stored to compare the similarity with the input hand pose. The order of indexes matches the coordinate order of `savedLeft(Right)Hand`.

### inputLeftHand / inputRightHand

A pose array to calculate whether a pose has been maintained for a specific time. The length of this array is set by the developer as desired.

## Output

### status

Returns whether there is a pose similar to the pose entered in real-time. In other words, if a matching pose is found, return 'true' and if not, return 'false'.

### handName

Returns the name of the most similar pose if there is a similar action. However, if there is no action that is judged to be similar, null is returned. In other words, it represents a meaningful value only when status is true.
