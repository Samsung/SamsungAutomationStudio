# pose-register

This node accepts a single key point, determines similarity of the saved pose , and derives whether registration is possible.

Please check the following [link(Determination of Similarity)](https://github.com/5FNSaaS/node-red-contrib-motion-pose/wiki/Determination-of-similarity) for the method referenced to calculate the similarity between poses (described in our project wiki topic).

## Key Point Definition

The key point expresses the positional coordinates and accuracy of the body pose calculated by Pose Detection. Objects representing position and accuracy are stored in the form of an array.

```
Key point : [ ... ,{"x": float, "y":float, "z":float, "visibility": float}, ...]
```

## Usage

This node is used when the user wishes to register with a new pose. Check whether the pose is already registered by the user. Sensitivity can be set through node attributes.

To this end, the node must receive a pose arrangement that has already been saved as input.

If there is a similar pose, return the similarity with the name of the pose. If you have a similar pose, refer to 'Status' of the output data.

## Properties

### Similar Sensitivity(percentage)

This attribute is a criterion (percentage) to determine that a particular two poses are similar.

## Input

### inputKeypoint

This is the coordinate data of the pose you wish to register a new pose.

```json
inputKeypoint : [    {
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
]
```

### savedKeypoints

An array of target key points to detect similarity. The key value is assigned the name of the corresponding pose specified by the user.

```json
savedKeypoints : {
	"name1":keypoint1, "name2":keypoint2, "name3":keypoint3, ..., 
}
```

## Output

### status

Returns whether there is a pose similar to the pose entered in real-time. In other words, if a matching pose is found, return 'true' and if not, return 'false'.

### poseName

Returns the name of the most similar pose if there is a similar action. However, if there is no action that is judged to be similar, null is returned. In other words, it represents a meaningful value only when status is true.

### isAccurate

This is a status value that verified whether the pose the user wants to register is valid data. true if the correctness of the action to be registered is sufficient, false otherwise (boolean)