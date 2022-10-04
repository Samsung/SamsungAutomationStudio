# node-red-contrib-mediapipe

![image](https://user-images.githubusercontent.com/38664481/193744817-07ae5359-7f09-4aba-9eac-514680dca548.png)

There is a problem that mediapipe cannot be used in nodejs. We present a new solution to solve this problem.

This module provides a set of nodes of node-RED for recognizing poses and hands using mediapipe.

In this module, Node receives the image and returns the result of detection with mediapipe.


## Description

The module consists of three nodes. Open/Close/Holistic.

In this module, the mediapipe is executed in python and the result is received. 

Therefore, use the Open/Close node to execute Mediapipe Python server.

After opening, the Holistic Node sends the requested image to Python and receives execution results.

These nodes require Node.js version 16.16.0 and Node-RED 1.2.9.

<br>

## Principle
Nodes runs Mediapipe on Python and nodes exchange requests and responses through socket communication.  

This node offers fewer features, but there are many areas that developers can add.
> Detailed usage and internal code can be found here [Wiki](https://github.com/TeamWildWest/node-red-contrib-mediapipe/wiki).

<br>

## Pre-requisites

- The Mediapipe-Node requires [Node-RED](https://nodered.org/) to be installed.
- Python must be installed. [Download](https://www.python.org/downloads)

<br>

## Install

- run the following command in you Node-RED user directory - typically `~/.node-red` :
```
npm i node-red-contrib-mediapipe
```

- Install the Python packages below.
```
pip install opencv-python==4.6.0.66
pip install mediapipe==0.8.11
pip install numpy==1.21.6
```
<br>

## Authors
[TeamWildWest in SSAFY(Samsung Software Academy for Youth)](https://github.com/TeamWildWest)

<br>

## Copyright and license
Copyright Samsung Automation Studio Team under [the Apache 2.0 license](https://www.apache.org/licenses/LICENSE-2.0).

<br>

## Reference

- [How to create Node in Node-RED](https://nodered.org/docs/creating-nodes/)
- [Mediapipe](https://github.com/google/mediapipe)
- [SamsungAutomationStudio](https://github.com/Samsung/SamsungAutomationStudio)
