# @GOOD-I-DEER/node-red-contrib-face-detection

[![platform](https://img.shields.io/badge/platform-Node--RED-red)](https://nodered.org)
[![npm version](https://badge.fury.io/js/@good-i-deer%2Fnode-red-contrib-face-detection.svg)](https://badge.fury.io/js/@good-i-deer%2Fnode-red-contrib-face-detection)
[![GitHub license](https://img.shields.io/github/license/GOOD-I-DEER/node-red-contrib-face-detection)](https://github.com/GOOD-I-DEER/node-red-contrib-face-detection/blob/main/LICENSE)

This module provides a node that detects faces using AI in Node-RED.

These nodes require node.js version 18.16.1 and Node-RED version 3.1.0.

<hr>

# Description

 This module provides a node that detects faces in the picture. you can use it with other services. You can also cut the face images you want from the origin image and download them. If you want, you can easily create a service by uploading images directly, using a webcam, or inputting photos from an IoT camera.

# Pre-requisites

The Node-Red-Contrib-Face-Detection requires **[Node-RED](https://nodered.org/)** to be installed.

# Install

To use this module you need to go to the folder where node-red is installed and use the npm install command.

```bash
cd ~/.node-red/
npm install @good-i-deer/node-red-contrib-face-detection
```

# Node

## face-detection

This is a node that detects and outputs faces in image.

### input

Image Buffer

- Image represented as binary buffer

### property

<img width="700" alt="detected_object" src="https://github.com/GOOD-I-DEER/node-red-contrib-face-detection/assets/130892737/4b813dbf-d39b-4a84-b731-1f9f82500d2e">

Name

- The name of the node displayed on the workspace.

Return Value

- Type of data to be transmitted as output of the node. Supports Detected Object, Image Buffer, and Image File.
    - Detected Object : Result object of the pre-trained model. A model can contain only the face object. Included values are x, y, w, h, prob.
        - x : zero-indexed offset from left edge of the original image
        - y : zero-indexed offset from top edge of the original image
        - w : the width of cropped image
        - h : the height of cropped image
        - prob : Accuracy of the face detected by the model
    - Image Buffer : Image buffer resulting from a pre-trained model
    - Image File : Image file resulting from a pre-trained model.

Absolute Path Dir

- Absolute path to save the file to. Show only when you select Image File as Return Value

Confidence Threshold

- Confidence threshold of the results of the pre-trained model. You must specify a value between 0 and 1. The lower the value, the more faces are detected.

### output

Data is output in the output format selected in the 'Return Value' property.

<details>
  <summary>Detected Object</summary>
  <img width="180" style="display : inline-block; margin-left: 10px;" alt="detected_object" src="https://github.com/GOOD-I-DEER/node-red-contrib-face-detection/assets/130892737/abdb239c-8b53-4af2-8ebc-77956cdc42b1">
</details>
    
<details>
  <summary>Image Buffer</summary>
  <img width="700" alt="image_buffer" src="https://github.com/GOOD-I-DEER/node-red-contrib-face-detection/assets/130892737/f2842c90-b1ec-4dc1-8b8d-6f9aa361c604">
</details>

<details>
  <summary>Image File</summary>
  <img width="700" alt="image_file" src="https://github.com/GOOD-I-DEER/node-red-contrib-face-detection/assets/130892737/c9fdd466-d80c-440d-b360-0894dff76949">
</details>
    
    

### Examples

This is a simple example of this node.

<img width="700" alt="example_flow" src="https://github.com/GOOD-I-DEER/node-red-contrib-face-detection/assets/130892737/ce1c102c-b1ca-4ed6-a2c0-d30cd10cc581">

### JSON

```json
[
    {
        "id": "bf67e15413744e7a",
        "type": "debug",
        "z": "83078a0b9760cbee",
        "name": "Result",
        "active": true,
        "tosidebar": true,
        "console": false,
        "tostatus": false,
        "complete": "payload",
        "targetType": "msg",
        "statusVal": "",
        "statusType": "auto",
        "x": 910,
        "y": 340,
        "wires": []
    },
    {
        "id": "8619fc0fa7da3fe8",
        "type": "good-face-detection",
        "z": "83078a0b9760cbee",
        "name": "",
        "returnValue": "2",
        "threshold": 0.5,
        "absolutePathDir": "C:\\Users\\SSAFY\\Desktop\\test",
        "x": 720,
        "y": 340,
        "wires": [
            [
                "bf67e15413744e7a"
            ]
        ]
    },
    {
        "id": "0f11aafbbf09699e",
        "type": "file in",
        "z": "83078a0b9760cbee",
        "name": "Image Path",
        "filename": "C:\\Users\\SSAFY\\Desktop\\ssdc\\object\\플로우만들기\\test.png",
        "filenameType": "str",
        "format": "",
        "chunk": false,
        "sendError": false,
        "encoding": "none",
        "allProps": false,
        "x": 510,
        "y": 340,
        "wires": [
            [
                "8619fc0fa7da3fe8"
            ]
        ]
    },
    {
        "id": "b9dc304adfa64f1c",
        "type": "inject",
        "z": "83078a0b9760cbee",
        "name": "Inject",
        "props": [
            {
                "p": "payload"
            },
            {
                "p": "topic",
                "vt": "str"
            }
        ],
        "repeat": "",
        "crontab": "",
        "once": false,
        "onceDelay": "3",
        "topic": "",
        "payload": "",
        "payloadType": "date",
        "x": 350,
        "y": 340,
        "wires": [
            [
                "0f11aafbbf09699e"
            ]
        ]
    }
]
```

## **Discussions and suggestions**

Use **[GitHub Issues](https://github.com/GOOD-I-DEER/node-red-contrib-face-vectorization/issues)** to ask questions or to discuss new features.

## **Authors**

**[GOOD-I-DEER](https://github.com/GOOD-I-DEER)** in SSAFY(Samsung Software Academy for Youth) 9th

- [Kim Jaea](https://github.com/kimjaea)
- [Yi Jong Min](https://github.com/chickennight)
- [Lee Deok Yong](https://github.com/Gitgloo)
- [Lee Che Lim](https://github.com/leecr1215)
- [Lee Hyo Sik](https://github.com/hy06ix)
- [Jung Gyu Sung](https://github.com/ramaking)

## **Copyright and license**

Copyright Samsung Automation Studio Team under the **[GNU General Public License v3.0 license](https://www.gnu.org/licenses/gpl-3.0.html)**.

## **Reference**

- [Node-RED Creating Nodes](https://nodered.org/docs/creating-nodes/)
- [SamsungAutomationStudio Github Repository](https://github.com/Samsung/SamsungAutomationStudio)
- [Ultralytics YOLOv8](https://docs.ultralytics.com/)
- [yolov8 onnx on javascript](https://github.com/AndreyGermanov/yolov8_onnx_javascript)
- [yolov8 onnx on nodejs](https://github.com/AndreyGermanov/yolov8_onnx_nodejs)
- [yolov8 face model](https://github.com/akanametov/yolov8-face/tree/dev#inference)