# @GOOD-I-DEER/node-red-contrib-face-vectorization

[![platform](https://img.shields.io/badge/platform-Node--RED-red)](https://nodered.org)
[![npm version](https://badge.fury.io/js/@good-i-deer%2Fnode-red-contrib-face-vectorization.svg)](https://badge.fury.io/js/@good-i-deer%2Fnode-red-contrib-face-vectorization)
[![GitHub license](https://img.shields.io/github/license/GOOD-I-DEER/node-red-contrib-face-vectorization)](https://github.com/GOOD-I-DEER/node-red-contrib-face-vectorization/blob/main/LICENSE)

This module provides a node that vectorizes facial photos using AI in Node-RED.

These nodes require node.js version 18.16.1 and Node-RED version 3.1.0.

<hr>

## Description

This node is part of the Facial Recognition with AI package.  
If you would like to see the entire package, please go to the link.
[@good-i-deer/node-red-contrib-vision-ai](https://www.npmjs.com/package/@good-i-deer/node-red-contrib-vision-ai)

The **AI** used in this node uses the **Inception ResNet v1** architecture, an implementation of the **FaceNet** model in Pytorch, and is trained on the **VGGFace2** dataset.  
It converts the pre-trained model into **onnx** format and operates through the **onnx-runtime** module. Files are provided directly to reduce dependency on external APIs.  
The input image buffer is converted into 512 vector values and provided.

<hr>

## Pre-requisites

The Node-Red-Contrib-Face-Vectorization requires [Node-RED](https://nodered.org) to be installed.

<hr>

## Install

```
cd ~/.node-red
npm install @good-i-deer/node-red-contrib-face-vectorization
```

Restart your Node-RED instance

<hr>

## Input

Single Image

- The input is an image file containing one face. Used for input to one image buffer.

Image Array

- The image buffer can be input in the form of an array. It can be used when there is a possibility of extracting and transmitting face photos of multiple people from linked nodes.
<hr>

## property

![image](https://github.com/GOOD-I-DEER/node-red-contrib-face-vectorization/assets/112360329/004b2539-aaaf-4b77-83fd-c80c02aa79db)

Name

- The name of the node displayed on the screen.

Input Type

- You can choose whether to insert one image buffer or multiple image buffers. In case of multiple image buffers, you can put them in the form of an Array.

Return Type

- You can choose whether to receive the vector result as output or save it as a file. The exported data is in the form of an array of vector arrays of faces. When selecting save as file, Path and Method are activated. We recommend saving as a text file.

Path

- This is where you enter the desired root, including the file name and extension, when saving a text file. If you do not specify an absolute path, it will be determined based on the execution space.

Method

- When saving a file, you can decide whether to overwrite or add. Create a file if it does not already exist.
<hr>

## Output

Array of Arrays

- Vectors for faces are output in the form of an array to msg.payload.

Text File

- Save vector data in file format. Depending on the method, overwrite or add to the input path.
<hr>

## Examples

Here are some example flows face vectorization.
![image](https://github.com/GOOD-I-DEER/node-red-contrib-face-vectorization/assets/112360329/99ba056e-e104-417c-ba4c-9a94747d65da)

### JSON

```json
[
    {
        "id": "e64532d90f9d901d",
        "type": "tab",
        "label": "Example",
        "disabled": false,
        "info": "",
        "env": []
    },
    {
        "id": "41638e97512ab913",
        "type": "good-face-vectorization",
        "z": "e64532d90f9d901d",
        "name": "",
        "inputType": "0",
        "returnType": "0",
        "method": "0",
        "path": "",
        "x": 450,
        "y": 40,
        "wires": [
            [
                "754b7ba59d20b8b7"
            ]
        ]
    },
    {
        "id": "361b506c1fd58e5e",
        "type": "file in",
        "z": "e64532d90f9d901d",
        "name": "image input",
        "filename": "",
        "filenameType": "str",
        "format": "",
        "chunk": false,
        "sendError": false,
        "encoding": "none",
        "allProps": false,
        "x": 250,
        "y": 40,
        "wires": [
            [
                "41638e97512ab913"
            ]
        ]
    },
    {
        "id": "754b7ba59d20b8b7",
        "type": "debug",
        "z": "e64532d90f9d901d",
        "name": "debug 1",
        "active": true,
        "tosidebar": true,
        "console": false,
        "tostatus": false,
        "complete": "false",
        "statusVal": "",
        "statusType": "auto",
        "x": 640,
        "y": 40,
        "wires": []
    },
    {
        "id": "559e69aa7caf19ed",
        "type": "inject",
        "z": "e64532d90f9d901d",
        "name": "start",
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
        "onceDelay": 0.1,
        "topic": "",
        "payload": "",
        "payloadType": "date",
        "x": 90,
        "y": 40,
        "wires": [
            [
                "361b506c1fd58e5e"
            ]
        ]
    }
]
```

<hr>

## Discussions and suggestions

Use [GitHub Issues](https://github.com/GOOD-I-DEER/node-red-contrib-face-vectorization/issues) to ask questions or to discuss new features.

<hr>

## Authors

[**GOOD-I-DEER**](https://github.com/GOOD-I-DEER) in SSAFY(Samsung Software Academy for Youth) 9th

- [Kim Jaea](https://github.com/kimjaea)
- [Yi Jong Min](https://github.com/chickennight)
- [Lee Deok Yong](https://github.com/Gitgloo)
- [Lee Che Lim](https://github.com/leecr1215)
- [Lee Hyo Sik](https://github.com/hy06ix)
- [Jung Gyu Sung](https://github.com/ramaking)
<hr>

## Copyright and license

Copyright Samsung Automation Studio Team under the [Apache 2.0 license](https://www.apache.org/licenses/LICENSE-2.0)

<hr>

## Reference

- [Node-RED Creating Nodes](https://nodered.org/docs/creating-nodes/)
- [SamsungAutomationStudio Github Repository](https://github.com/Samsung/SamsungAutomationStudio)
- [FaceNet: A Unified Embedding for Face Recognition and Clustering](https://www.cv-foundation.org/openaccess/content_cvpr_2015/papers/Schroff_FaceNet_A_Unified_2015_CVPR_paper.pdf)
- [VGGFace2](https://paperswithcode.com/dataset/vggface2-1)
- [inception_resnet_v1](https://github.com/timesler/facenet-pytorch/blob/master/models/inception_resnet_v1.py)
<hr>
