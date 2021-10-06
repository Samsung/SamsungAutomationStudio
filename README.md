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

## Pre-requisites

The Motion-Pose-Node requires [Node-RED](https://nodered.org/) to be installed.

## Install

To install the latest version use the `Menu - Manage palette` option and search for `node-red-contrib-motion-pose-node`, or run the following command in you Node-RED user directory - typically `~/.node-red` :

    npm install node-red-contrib-motion-pose-node

## Usage

[How to use Bixby Nodes](https://sasm.developer.samsung.com/tutorials/article_2_4)  
[How to use SmartThings Nodes](https://sasm.developer.samsung.com/tutorials/article_2_3)

## Authors
[5FNSaaS in SSAFY(Samsung Software Academy for Youth)](https://github.com/5FNSaaS)

## Copyright and license
Copyright Samsung Automation Studio Team under [the Apache 2.0 license](https://www.apache.org/licenses/LICENSE-2.0).

## Reference

- [Node-RED Creating Nodes](https://nodered.org/docs/creating-nodes/)
- [Google Mediapipe Repository](https://github.com/google/mediapipe)

- [Tensorflow Model Github Repository](https://github.com/tensorflow/tfjs-models)