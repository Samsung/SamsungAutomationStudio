# @soop-sasm/node-red-soop-dashboard
[![platform](https://img.shields.io/badge/platform-Node--RED-red)](https://nodered.org)
[![npm version](https://badge.fury.io/js/@soop-sasm%2Fnode-red-soop-dashboard.svg)](https://badge.fury.io/js/@soop-sasm%2Fnode-red-soop-dashboard)
[![GitHub license](https://img.shields.io/github/license/SoopSASM/node-red-soop-dashboard)](https://github.com/SoopSASM/node-red-soop-dashboard/blob/master/LICENSE)

This module provides a set of nodes in Node-RED to configure dashboard.

These nodes require node.js version 16.17.1 and Node-RED version 3.0.2.
<hr>

## Description
With these nodes, you can easily configure a **fancy** dashboard.  
Just add a node on the palette, and freely **customize** your own dashboard.  
You can bind nodes as a group, and groups as a tab.  
Also, You can arrange each group, just **drag & drop** it on the dashboard.  
Moreover, you can **control** devices with our nodes such as button, slider, and so on.  
Furthermore, you can **visualize** data with our nodes such as chart, gauge, and so on.  

<hr>

## Pre-requisites
The Node-RED-Soop-Dashboard requires [Node-RED](https://nodered.org) to be installed.
<hr>

## Install
```
cd ~/.node-red/
npm install @soop-sasm/node-red-soop-dashboard
```
Restart your Node-RED instance and you should have dashboard nodes available in the palette.

The dashboard interface is available at http://localhost:1880/dashboard
<hr>

## Layout
### Grid
Basically, in a resolution environment with a width greater than 1200px, the dashboard consists of 12 columns. The width of each grid may vary depending on resolution. And the height of each grid is fixed at 75px.  
The gap of each grid is 10px for width and height, and the gap of each widget is 20px, 10px for width and height.
### Drag & Drop
According to our stacking algorithm, groups are placed in order from the large area group to the top left.  
If drag and drop option is activated, all groups are aligned up to the top compactly.
<hr>

## Nodes
> This is a brief description of each node.  
If you want a more detailed description of nodes, check out our [Wiki](https://github.com/SoopSASM/node-red-soop-dashboard/wiki).

- *Button*: A widget that delivers a specific message when pressed by a user.

- *Chart*: A widget that receives data from a user and displays it in a chart.
    - Line: Plot a time-series data as a line chart on the dashboard.
    - Bar: Plot a time-series or non-time-series data as a bar chart on the dashboard.
    - Pie: Plot a non-time-series data as a pie chart on the dashboard.

- *Dropdown*: A widget that shows the value entered by the user in a drop-down format.

- *Gauge*: A widget that shows the percentage of the total value that a user receives.
    - Gauge: Plot a data as a gauge graph on the dashboard.
    - Donut: Plot a data as a donut graph on the dashboard.
    - Liquid: Plot a data as a liquid fill gauge chart on the dashboard.

- *Image*: A widget that shows images through an image file or image URL.

- *List*: A widget that shows the values entered by the user in list form.
    - Ordered: Show an ordered list on the dashboard.
    - Unordered: Show an unordered list on the dashboard.
    - Checkbox: Show a checkbox list on the dashboard.

- *Slider*: A slider-type widget that allows users to set values.

- *Switch*: A widget that allows the user to toggle (on/off) values.

- *Text*: A widget that shows the value entered by the user in text format.

- *Dashboard Config*: A configuration node for soop dashboard.

- *Data Format*: A node for labeling each dataset to use chart nodes.

- *Group*: A set of widgets. It will be sorted automatically.

- *Tab*: A set of groups. The default name is given as `Tab # number`. It doesn't matter if the name is duplicated.
<hr>

## Examples
Here are some example flows configured with our dashboard nodes.
![image](https://user-images.githubusercontent.com/69517473/194187358-e0b248eb-c3f9-44b5-8eeb-64eac1113bd8.png)
![image](https://user-images.githubusercontent.com/69517473/194187374-4a6432f2-2a22-4cdf-88f7-5eb86283b322.png)
![image](https://user-images.githubusercontent.com/69517473/194187422-6559735e-4a28-44a4-8ced-823b1f387d54.png)

<hr>

## Discussions and suggestions
Use [GitHub Issues](https://github.com/SoopSASM/node-red-soop-dashboard/issues) to ask questions or to discuss new features.
<hr>

## Authors
[**SoopSASM**](https://github.com/SoopSASM) in SSAFY(Samsung Software Academy for Youth) 7th
- [Hee won Hwang](https://github.com/lea-hwang)
- [Hye Rim Kim](https://github.com/hrookim)
- [Jae Hoon Lim](https://github.com/quaternion12345)
- [Je Kwan Kim](https://github.com/jekwan)
- [Jun Sik Jo](https://github.com/zzunsik)
- [Sang Hyeon Jeon](https://github.com/gemnsh)
<hr>

## Copyright and license
Copyright Samsung Automation Studio Team under the [Apache 2.0 license](https://www.apache.org/licenses/LICENSE-2.0)
<hr>

## Reference
- [Node-RED Creating Nodes](https://nodered.org/docs/creating-nodes/)
- [Node-RED node-red-dashboard](https://flows.nodered.org/node/node-red-dashboard)
- [SamsungAutomationStudio Github Repository](https://github.com/Samsung/SamsungAutomationStudio)
<hr>
