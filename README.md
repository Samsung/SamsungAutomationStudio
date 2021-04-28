# Samsung Automation Studio Node-RED nodes
Samsung Automation Studio is to provide development tools and execution environment that can easily configure application logic by connecting both Samsung service and 3rd party service. This project is to share the node for open source NodeRED developed by Samsung Automation Studio team to the community. If you are using nodered, you can easily install the node we provide. And you can use Samsung's IoT and AI-related services more easily, and you can have an extended experience in conjunction with your own services.

## Install
Run the following command in you Node-RED user directory 

```
npm install node-red-contrib-samsung-automation-studio-nodes
```

## Compatibility
Node-RED version: v1.0.6  
Node-RED version: v1.1.2  
Node-RED version: v1.2.2
Node-RED version: v1.2.9

## Browser Compatibility
It works on browsers that support for ES6 (2015)   
(*Internet Explorer does not support ES6)

## Usage
[How to use Bixby Nodes](https://sasm.developer.samsung.com/tutorials/article_2_4)  
[How to use SmartThings Nodes](https://sasm.developer.samsung.com/tutorials/article_2_3)

## Authors
[Samsung Automation Studio Team](https://sasm.developer.samsung.com/)

## Getting Help
For further help, or general discussion, please contact https://github.com/Samsung/SamsungAutomationStudio/issues

## Copyright and license
Copyright Samsung Automation Studio Team under [the Apache 2.0 license](https://www.apache.org/licenses/LICENSE-2.0).

## Release Note
- 1.1.2 : 
    - SmartThings Node bugfix
      - Node.js 10.x version support : remove Promise.allSettled
      - status-device node bug fix
- 1.1.0 : 
    - SmartThings Node enhancement
        - Updating SmartThings Capabilities specification 
        - Device-Profile custom capability support 
        - My-Device node, device multi-select
        - Add Location and Room item to the device-list 
        - Logging option fix 
- 1.0.16 : 
    - Add 'slack-notification' node
    - Add 'status-device', 'command-device' node device response logging option
- 1.0.15 : SmartThings Automation node authorization process modify
- 1.0.13 : SmartThings device nodes logging modify
- 1.0.11 : 
    - Get custom capability spec. dynamically with SmartThings API
    - SmartThings Capability spec. update (2020.08.13)   
- 1.0.8 : nodered.org, flows page compatibility fix  
- 1.0.7 : Node-RED ver.1.1.2 compatibility bug fix  
    - Nodes credential access modify
    - Editor HTML template engine compatibility modify  
