# pose-similarity-find

This node receives a number of input key points (ex: sequence of continuous time) and determines the similarity to the saved pose, and derives the most similar pose.

Please check the following [link(Determination of Similarity)](https://github.com/5FNSaaS/node-red-contrib-motion-pose/wiki/Determination-of-similarity) for the method referenced to calculate the similarity between poses (described in our project wiki topic).

## Key Point Definition

The key point expresses the positional coordinates and accuracy of the body pose calculated by Pose Detection. Objects representing position and accuracy are stored in the form of an array.

```
Key point : [ ... ,{"x": float, "y":float, "z":float, "visibility": float}, ...]
```

## Usage

This node finds a pose similar to the pose model that enters in real-time input. Criteria to determine that they are similar can be set sensitivity through the properties of the node. 

To this end, nodes must receive an arrangement of pose that has already been stored as input. 

If a similar pose exists, return the name and similarity of the pose. Refer to 'status' of the output data for the presence of similar poses.

## Properties

### Similar Sensitivity(percentage)

This attribute is a criterion (percentage) to determine that a particular two poses are similar.

## Input

### inputKeypoints

This array is the coordinate detection values of the pose being recognized by Detection Node. This array can have multiple frame data, because multiple frame data accumulated over time can be need to determine the similarity. 

```json
inputKeypoints : [
	keypoint1, keypoint2, keypoint3,...
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

### similarity

If there is a similar pose, it means the similarity with the most similar pose. If there is none, 0 is assigned.