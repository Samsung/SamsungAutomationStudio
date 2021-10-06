# Motion Pose Node

This module provides a set of nodes of node-RED for recognizing body poses and hands poses.

Use MediaPipe's BlazePose and Hands to track and visualize body and hands poses.

In this module, the type of camera device for recognizing poses is separated into a webcam or external camera devices which support Samsung Smartthings.

Certain poses can be saved through the 'Pose/Hand Register' node, and the 'Pose/Hand Find' node can determine similarity with other poses.

Various devices are generally controlled by touch and voice, but the type of control may be limited in certain circumstances. There are also users who cannot freely use these control methods.

This node was developed to solve the problems described above by presenting a new direction of "motion recognition" to Node-RED.

Furthermore, by using the node of "5FNSaaS", you will be able to develop a flow of various services that utilize body information.

Due to the nature of Node-RED, which is a flow development for node-based visual programming, we wrote the code with the aim of freely customizing by developers.

These nodes require Node.js version 14.17.0 and Node-RED 2.0.6.

<br>

## Node
> If you want a more detailed description of Node, see its Readme. For more detailed "Flow" and "Algorithms", check out the [Wiki](https://github.com/5FNSaaS/node-red-contrib-motion-pose/wiki)
- [monitor](https://github.com/5FNSaaS/node-red-contrib-motion-pose/tree/master/monitor) : A node for monitoring the pose/hand recognition screen in an external browser.
- [pose-detection-webcam](https://github.com/5FNSaaS/node-red-contrib-motion-pose/tree/master/body/pose-detection-webcam) : A simple node that recognizes and visualizes pose using a webcam.
- [pose-detection-iotcam](https://github.com/5FNSaaS/node-red-contrib-motion-pose/tree/master/body/pose-detection-iotcam) : A simple node that recognizes and visualizes pose using a external camera device which support Samsung Smartthings.
- [pose-similarity-find](https://github.com/5FNSaaS/node-red-contrib-motion-pose/tree/master/body/pose-similarity-find) : This node receives a number of input key points and determines the similarity to the saved pose, and derives the most similar pose.
- [pose-similarity-register](https://github.com/5FNSaaS/node-red-contrib-motion-pose/tree/master/body/pose-similarity-register) : This node accepts a single key point, determines similarity of the saved pose , and derives whether registration is possible.
- [hand-register](https://github.com/5FNSaaS/node-red-contrib-motion-pose/tree/master/hand/hand-register) : This node receives a number of input key points and determines the similarity to the saved hands pose, and whether registration is possible.
- [hand-find](https://github.com/5FNSaaS/node-red-contrib-motion-pose/tree/master/hand/hand-find) : This node receives a number of input key points (ex: sequence of continuous time) and determines the similarity to the saved hands pose, and derives the most similar pose.
- [hand-detection-webcam](https://github.com/5FNSaaS/node-red-contrib-motion-pose/tree/master/hand/hand-detection-webcam) : A simple node that recognizes and visualizes hand using a webcam.
- [hand-detection-iotcam](https://github.com/5FNSaaS/node-red-contrib-motion-pose/tree/master/hand/hand-detection-iotcam) : A simple node that recognizes and visualizes hand using a external camera device which support Samsung Smartthings.

<br>

## Pre-requisites

The Motion-Pose-Node requires [Node-RED](https://nodered.org/) to be installed.

<br>

## Install

To install the latest version use the `Menu - Manage palette` option and search for `node-red-contrib-motion-pose`, or run the following command in you Node-RED user directory - typically `~/.node-red` :

    npm i node-red-contrib-motion-pose

<br>

## Usage

[How to use Bixby Nodes](https://sasm.developer.samsung.com/tutorials/article_2_4)  
[How to use SmartThings Nodes](https://sasm.developer.samsung.com/tutorials/article_2_3)

<br>

## Authors
[5FNSaaS in SSAFY(Samsung Software Academy for Youth)](https://github.com/5FNSaaS)

<br>

## Copyright and license
Copyright Samsung Automation Studio Team under [the Apache 2.0 license](https://www.apache.org/licenses/LICENSE-2.0).

<br>

## Reference

- [Node-RED Creating Nodes](https://nodered.org/docs/creating-nodes/)
- [Google Mediapipe Repository](https://github.com/google/mediapipe)
- [Tensorflow Model Github Repository](https://github.com/tensorflow/tfjs-models)