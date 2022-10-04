# @d5mi/node-red-contrib-object-detection

This module provides nodes of Node-RED for recognizing objects with a camera, determining and recording interactions between users and objects.

Use TensoFlow's COCO-SSD model to detect objects defined in the COCO dataset, which is a large-scale object detection, segmentation, and captioning dataset.

These nodes work reliably Node.js version 16.17.0 and Node-RED 3.0.2.

<br>

## Node

- [object-detection](https://github.com/D5MI/node-red-contrib-object-detection/tree/master/object_detection): A node that detect various objects, determine the interactions between a user and objects, and record logs.
- [object-person-determine](https://github.com/D5MI/node-red-contrib-object-detection/tree/master/object-person-determine): A node that determines which of the detected objects most interacts with the user.
- [log](https://github.com/D5MI/node-red-contrib-object-detection/tree/master/log): This node records the detected motion poses and objects and saves them to a file. The files are saved in the entered storage location by date named log-yyyy-MM-dd.

<br>

## Pre-requisites

This module requires [Node-RED](https://nodered.org/) to be installed.

<br>

## Install

To install the stable version use the `Menu - Manage palette` option and search for `@d5mi/node-red-contrib-object-detection`, or run the following command in your Node-RED user directory - typically `~/.node-red`:

```bash
npm i @d5mi/node-red-contrib-object-detection
```

<br>

## Example Flows

<br>

## Authors

[D5MI in SSAFY(Samsung Software Academy for Youth)](https://github.com/D5MI)

<br>

## Copyright and License

Copyright Samsung Automation Studio Team under [the Apache 2.0 license](https://www.apache.org/licenses/LICENSE-2.0).

<br>

## Feedback

Please send bug reports, feedbacks, and questions to [GitHub Issues](https://github.com/D5MI/node-red-contrib-object-detection/issues).
