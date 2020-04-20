/**
 * Copyright JS Foundation and other contributors, http://js.foundation
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 **/
module.exports = function (RED) {
    "use strict";

    const ST_EVENT_DEVICE = "event-device";
    const ST_STATUS_DEVICE = "status-device";
    const ST_COMMAND_DEVICE = "command-device";
    const ST_DEVICE_PROFILE = 'device-profile';
    const ST_MY_DEVICE = 'installed-device';
    const ST_AUTOMATION = 'automation';
    const ST_NODES=[ST_EVENT_DEVICE,ST_STATUS_DEVICE,ST_COMMAND_DEVICE,ST_DEVICE_PROFILE,ST_MY_DEVICE,ST_AUTOMATION];
    const ST_NODE_VERSION = 200330

    process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0;
    var os = require('os');
    var bodyParser = require("body-parser");
    var cors = require('cors');
    var jsonParser = bodyParser.json();
    var httpSignature = require('http-signature');
    var reqApi = require('./lib/oneapigateway');

    var corsHandler = cors({origin: "*", methods: "POST"});
    RED.httpNode.options("*", corsHandler);
    var nextHandler = function (req, res, next) {
        next();
    }

    var operators = {
        'eq': function (a, b) {
            return a == b;
        },
        'neq': function (a, b) {
            return a != b;
        },
        'lt': function (a, b) {
            return a < b;
        },
        'lte': function (a, b) {
            return a <= b;
        },
        'gt': function (a, b) {
            return a > b;
        },
        'gte': function (a, b) {
            return a >= b;
        },
        'in': function(v,arr){
            return Array.isArray(arr) && arr.includes(v)
        },
        'nin': function(v,arr){
            return Array.isArray(arr) && !(arr.includes(v))
        }
    };

    var usedDeviceNodes = [];
    var eventDeviceNodes = [];
    var actionDeviceNodes = [];

    var OneApi = {
        executeDeleteSubscription: function (keyParam, token) {
            return new Promise(function (resolve, reject) {
                reqApi.callOneApi(null, "subscriptions", "executeDeleteSubscription", keyParam, undefined, undefined, token, function (body) {
                    try {
                        resolve(body);
                    } catch (e) {
                        reject(body);
                    }
                });
            });
        },

        executeCreateSubscription: function (keyParam, bodyParam, token) {
            return new Promise(function (resolve, reject) {
                reqApi.callOneApi(null, "subscriptions", "executeCreateSubscription", keyParam, undefined, bodyParam, token, function (body) {
                    try {
                        resolve(body);
                    } catch (e) {
                        reject(body);
                    }
                });
            });
        },

        getDeviceStates: function (keyParam, token) {
            return new Promise(function (resolve, reject) {
                reqApi.callOneApi(null, "device", "getDeviceStates", keyParam, undefined, undefined, token, function (data) {
                    try {
                        resolve(data);
                    } catch (e) {
                        reject(data);
                    }
                });
            });

        },

        executeDeviceCommands: function (keyParam, bodyParam, token) {
            return new Promise(function (resolve, reject) {
                reqApi.callOneApi(null, "device", "executeDeviceCommands", keyParam, undefined, bodyParam, token, function (data) {
                    if (typeof data === 'object') {
                        if (data.hasOwnProperty("errMsg")) {
                            reject(data);
                        } else {
                            resolve(data);
                        }
                    } else {
                        resolve(data);
                    }
                });
            });
        }
    };

    var RES = {
        ok: function (res, obj) {
            console.log(`RES ok : ${JSON.stringify(obj)}`)
            res.json(obj)
        },
        error: function (res, status, msg) {
            console.log(`RES error[${status}] : ${msg}`)
            res.status(status).send(msg)
        }
    }

    function Automation(n) {
        RED.nodes.createNode(this, n)
        Object.assign(this,n)
        stCompatibleCheck(this)

        var NODE = this;

        var Eventattribute;
        var allnodes = [];
        RED.nodes.eachNode(function (nn) {
            var node = Object.assign({}, nn);
            if (/^(event|status|command)-device$/g.test(node.type)){
                stCompatibleCheck(node)
            }
            allnodes[nn.id] = node
        });

        // 사용하는 config node id 저장
        usedDeviceNodes = []
        eventDeviceNodes = []
        actionDeviceNodes = []

        var queue = [];
        queue.push(this.id);

        var visited = new Set([this.id])
        var sectionConfig={}
        var subscriptionDevices=[]

        while (queue.length > 0) {
            var currentId = queue.shift();
            var node = allnodes[currentId];
            if (/^(event|status|command)-device$/g.test(node.type) && allnodes[node.deviceNodeId] && allnodes[node.deviceNodeId].type === ST_DEVICE_PROFILE) {
                if(!sectionConfig.hasOwnProperty(node.deviceNodeId)){
                    var deviceNode = allnodes[node.deviceNodeId]

                    sectionConfig[deviceNode.id]={
                        name: deviceNode.name,
                        settings: [
                            {
                                id: deviceNode.id,
                                name: deviceNode.name,
                                description: deviceNode.name + ":" + deviceNode.capabilityId,
                                type: 'DEVICE',
                                required: true,
                                multiple: false,
                                capabilities: [deviceNode.capabilityId],
                                permissions: ['r']
                            }
                        ]
                    }
                }
                if(node.type == ST_COMMAND_DEVICE && sectionConfig[node.deviceNodeId].settings[0].permissions.includes('x') == false) {
                    sectionConfig[node.deviceNodeId].settings[0].permissions.push('x')
                }
                if(node.type == ST_EVENT_DEVICE){
                    subscriptionDevices.push({sectionId:node.deviceNodeId,capabilityId:node.capabilityId,attributeId:node.attributeId})
                }
            }

            node.wires.forEach(function(wire){
                wire.forEach(function(nodeId){
                    if(visited.has(nodeId) == false){
                        visited.add(nodeId)
                        queue.push(nodeId)
                    }
                })
            })
        }
        var sections = Object.values(sectionConfig)

        if (!n.url) {
            this.warn(RED._("SmartThings.error.missing-path"));
            return;
        }

        this.url = n.url;
        if (this.url[0] !== '/') {
            this.url = '/' + this.url;
        }
        this.errorHandler = function (err, req, res, next) {
            NODE.error(err);
            RES.error(res, 500, "Internal Server Errror");
        };

        this.lifecycleHandler = function (req, res) {
            console.log('===========Automation Request BODY ==========')
            console.dir(req.body,{depth:null})

            switch(req.body.lifecycle){
                case "PING":
                    var evt = req.body;
                    if (!evt.pingData) {
                        var msg = "Required parameter doesn't exist";
                        debugLog("[error] " + msg);
                        RES.error(res, 400, msg);
                        return;
                    }
                    RES.ok(res, {statusCode: 200, pingData: {challenge: evt.pingData.challenge}});
                    break;

                case "CONFIRMATION":
                    RES.ok(res, {statusCode: 200, targetUrl: "target_url"});
                    break;

                case "CONFIGURATION":
                    var evt = req.body;
                    if (!evt.configurationData) {
                        var msg = "Required parameter doesn't exist";
                        debugLog("[error] " + msg);
                        RES.error(res, 400, msg);
                        return;
                    }

                    var response = {};
                    if (evt.configurationData.phase == "INITIALIZE") {
                        response.initialize = {
                            id: "app_" + NODE.name.replace(/ /g, ''),  //공백제거
                            name: NODE.name,
                            description: NODE.name,
                            firstPageId: "1",
                            permissions: []
                        }
                    } else if (evt.configurationData.phase == "PAGE") {
                        if (evt.configurationData.pageId !== "1") {
                            RES.error(res, 400, `Unsupported page id: ${evt.configurationData.pageId}`);
                            return;
                        }
                        response.page = {
                            pageId: '1',
                            name: NODE.name,
                            nextPageId: null,
                            previousPageId: null,
                            complete: true,
                            sections: sections
                        };
                    } else {
                        RES.error(res, 400, `Unsupported phase: ${evt.configurationData.phase}`);
                        return;
                    }
                    RES.ok(res, {statusCode: 200, configurationData: response});
                    break;

                case "INSTALL":
                    var evt = req.body
                    var installedAppId = evt.installData.installedApp.installedAppId
                    var authToken = evt.installData.authToken

                    console.log('subscription devices : '+subscriptionDevices)

                    subscriptionDevices.forEach((subscription)=>{
                        console.log('-----------EVENT DEVICE SUBSCRIPTION-----------')
                        console.log(subscription)
                        var sectionInfo = evt.installData.installedApp.config[subscription.sectionId][0]
                        var subRequest = {
                            sourceType: 'DEVICE',
                            device: {
                                deviceId: sectionInfo.deviceConfig.deviceId,
                                componentId: sectionInfo.deviceConfig.componentId,
                                capability: subscription.capabilityId,
                                attribute: subscription.attributeId,
                                stateChangeOnly: true,
                                subscriptionName: subscription.name+'_'+subscription.capabilityId+'_'+subscription.attributeId+'_subscription',
                                value: "*"
                            }
                        }

                        var keyParam = {}
                        keyParam.installedAppId = installedAppId

                        OneApi.executeCreateSubscription(keyParam, subRequest, authToken).then(function (data) {
                            debugLog("Create Subscription : " + JSON.stringify(data))
                            console.log("Create Subscription : " + JSON.stringify(data))
                        }).catch(function (err) {
                            debugLog("[error] " + err.errCd + ", " + err.errMsg)
                            console.log("[error] " + err.errCd + ", " + err.errMsg)
                        })

                    })
                    RES.ok(res, {statusCode: 200, installData: {}})
                    break;

                case "UPDATE":
                    var evt = req.body;
                    var installedAppId = evt.updateData.installedApp.installedAppId;
                    var authToken = evt.updateData.authToken;

                    var keyParam = {installedAppId:installedAppId}

                    OneApi.executeDeleteSubscription(keyParam, authToken).then(function (data) {
                        subscriptionDevices.forEach(function(subscription){
                            console.log('-----------EVENT DEVICE SUBSCRIPTION-----------')
                            console.log(subscription)

                            var sectionInfo = evt.updateData.installedApp.config[subscription.sectionId][0]
                            var subRequest = {
                                sourceType: 'DEVICE',
                                device: {
                                    deviceId: sectionInfo.deviceConfig.deviceId,
                                    componentId: sectionInfo.deviceConfig.componentId,
                                    capability: subscription.capabilityId,
                                    attribute: subscription.attributeId,
                                    stateChangeOnly: true,
                                    subscriptionName: `${Eventattribute}_subscription`,
                                    value: "*"
                                }
                            }
                            var keyParam = {}
                            keyParam.installedAppId = installedAppId
                            OneApi.executeCreateSubscription(keyParam, subRequest, authToken).then(function (data) {
                                debugLog("Update Subscription : " + JSON.stringify(data))
                                console.log("Update Subscription : " + JSON.stringify(data))
                            }).catch(function (err) {
                                debugLog("Update Subscription Fail: " + JSON.stringify(data)+" / ("+err.errCd +")"+err.errMsg)
                                console.log("Install errorCode : " + err.errCd + " message : " + err.errMsg);
                            })
                        })
                    }).catch(function (err) {
                        debugLog("Delete Subscription : " + installedAppId +" / ("+err.errCd +")"+err.errMsg)
                        console.log("Delete errorCode : " + err.errCd + " message : " + err.errMsg);
                        console.dir(err)
                    });
                    RES.ok(res, {statusCode: 200, updateData: {}});
                    break;
                case "UNINSTALL":
                    RES.ok(res, {statusCode: 200, uninstallData: {}});
                    break;
                case "EVENT":
                    RES.ok(res, {statusCode: 200, eventData: {}});
                    NODE.context().flow.set('evt', req.body);
                    NODE.send({payload: req.body});
                    break;
                default:
                    var msg = "No matched lifecycle : "+req.body.lifecycle;
                    debugLog("[error] " + msg);
                    RES.error(res, 400, msg);
                    break;
            }
        };

        function verifySignature(req) {
            try {
                let publickey;
                if (NODE.publickey) {
                    publickey = NODE.publickey.replace(/\\r\\n/g, "").replace(/\\n/g, "");
                    publickey = publickey.replace("-----BEGIN PUBLIC KEY-----", "-----BEGIN PUBLIC KEY-----\n");
                    publickey = publickey.replace("-----END PUBLIC KEY-----", "\n-----END PUBLIC KEY-----\n");
                    publickey = publickey.replace(/\\n/g, os.EOL);
                }
                publickey = Buffer.from(publickey, 'utf8');
                let parsed = httpSignature.parseRequest(req);
                if (!httpSignature.verifySignature(parsed, publickey)) {
                    return false;
                }
            } catch (error) {
                debugLog("[error] " + JSON.stringify(error));
                return false;
            }
            return true;
        }

        var httpMiddleware = function (req, res, next) {
            if (req.body.lifecycle === "PING" || process.env.SKIP_SIGNATURE_CHECK || verifySignature(req)) {
                next();
            } else {
                var msg = "Invalid Public Key in Automation Node";
                debugLog("[error] " + msg);
                RES.error(res, 401, msg);
            }
        };
        function debugLog(log) {
            try {
                RED.comms.publish("debug", {id: NODE.id, z: NODE.z, name: NODE.name, topic: "Automation", msg: log});
            } catch (err) {
                console.error(err);
            }
        }
        RED.httpNode.post(this.url, nextHandler, httpMiddleware, corsHandler, nextHandler, jsonParser, nextHandler, this.lifecycleHandler, this.errorHandler);
        this.on("close", function () {
            var node = this;
            RED.httpNode._router.stack.forEach(function (route, i, routes) {
                if (route.route && route.route.path === node.url) {
                    routes.splice(i, 1);
                }
            });
        });
    }
    RED.nodes.registerType(ST_AUTOMATION, Automation);

    function DeviceConfigNode(n) {
        RED.nodes.createNode(this, n);
        Object.assign(this,n)
        stCompatibleCheck(this)
    }
    RED.nodes.registerType(ST_DEVICE_PROFILE, DeviceConfigNode);

    function installedDeviceConfigNode(n) {
        RED.nodes.createNode(this, n)
        Object.assign(this,n)
        stCompatibleCheck(this)
    }

    RED.nodes.registerType(ST_MY_DEVICE, installedDeviceConfigNode,{credentials:{
            stAccessToken:{type:'text', required:true}
        }});

    function ThingNode(n) {


        RED.nodes.createNode(this, n)
        this.rules = n.rules || []
        Object.assign(this,n)
        stCompatibleCheck(this)

        if(n.deviceNodeId===''){
            this.warn('Deivce Node error: deviceNodeId is undefined')
            return
        }

        var NODE = this;

        function sendDebug(message) {
            var msg = {};
            RED.comms.publish("debug", {id:NODE.id,msg: message});
        }

        this.on('input', function (msg) {
            var onward = [];
            try {
                let flowContext = NODE.context().flow.get('evt');
                if (flowContext == undefined) {
                    // throw new Error("Context Data is null");
                }

                var deviceConfig = ""
                var authToken = "";
                var param = {};
                param.deviceId = "";
                var isAutomation=true;

                if (RED.nodes.getNode(NODE.deviceNodeId).type == ST_MY_DEVICE){
                    isAutomation=false;
                    authToken = RED.nodes.getNode(NODE.deviceNodeId).credentials.stAccessToken;
                    param.deviceId = NODE.deviceId || RED.nodes.getNode(NODE.deviceNodeId).device.deviceId
                }else{
                    isAutomation=true;
                    deviceConfig = flowContext.eventData.installedApp.config[NODE.deviceNodeId][0].deviceConfig;//현재는 section 당 한개의 기기만으로 제한되어있음.[0]처리
                    authToken = flowContext.eventData.authToken;
                    param.deviceId = deviceConfig.deviceId;
                }

                if (NODE.type == ST_EVENT_DEVICE) {
                    var resultMsg=[]
                    sendDebug("[flow] Event:" + NODE.name + "("+NODE.deviceNodeId+")")

                    flowContext.eventData.events.forEach(function(event){
                        var deviceEvent = event.deviceEvent
                        if(deviceEvent && deviceEvent.deviceId == deviceConfig.deviceId && deviceEvent.componentId == deviceConfig.componentId ){
                            resultMsg=[]
                            NODE.rules.forEach(function(rule){
                                var opCheck = false

                                if(deviceEvent.capability == rule.capaId && deviceEvent.attribute == rule.attrId){
                                    opCheck=operators[rule.operator](deviceEvent.value, rule.value)
                                }

                                if (opCheck) {
                                    RED.util.setMessageProperty(msg, 'payload', deviceEvent)
                                    resultMsg.push(msg)
                                } else {
                                    resultMsg.push(null)
                                }
                            })
                        }
                    })
                    if (NODE.rules.length == 0) {
                        RED.util.setMessageProperty(msg, 'payload', flowContext.eventData.events);
                        resultMsg.push(msg);
                    }
                    NODE.send(resultMsg)
                } else if (NODE.type == ST_STATUS_DEVICE) {
                    OneApi.getDeviceStates(param, authToken).then(function (data) {
                        sendDebug("[flow] Status :" + NODE.name + "("+NODE.deviceNodeId+")");
                        var deviceStatus = data;
                        var opCheck = false;

                        NODE.rules.forEach((rule,idx)=>{
                            var attributeValue = deviceStatus.components[deviceConfig.componentId||'main'][NODE.capabilityId][NODE.attributeId].value;

                            if (rule.value == '' || rule.value == undefined){
                                rule.value = "\'\'"
                            }
                            if(rule.valueType == 'Iso8601Date'){
                                opCheck = operators[rule.operator](new Date(rule.value), new Date(attributeValue))
                            }else{
                                opCheck = operators[rule.operator](rule.value, attributeValue)

                            }
                            if (opCheck) {
                                // sendDebug(NODE.attributeId+"=\""+attributeValue+"\", ("+idx+")port success")
                                RED.util.setMessageProperty(msg, 'payload', attributeValue)
                                onward.push(msg);
                            } else {
                                // sendDebug(NODE.attributeId+"=\""+attributeValue+"\", ("+idx+")port fail")
                                onward.push(null);
                            }
                        })

                        if (NODE.rules.length == 0) {
                            RED.util.setMessageProperty(msg, 'payload', data);
                            onward.push(msg);
                        }
                        NODE.send(onward);

                    }).catch(function (err) {
                        console.error(err)
                        sendDebug("[error] " + err.errCd + ", " + err.errMsg);
                    });
                } else {
                    sendDebug("[flow] Action:" + NODE.name + "("+NODE.deviceNodeId+")");

                    var commandArr = [];
                    var componentId = (deviceConfig && deviceConfig.componentId) ? deviceConfig.componentId : 'main'
                    for(var rule of NODE.rules){
                        var cmd = {component: componentId || "main", capability: rule.capaId, command: rule.attrId}
                        cmd.arguments = []

                        var argObj={}
                        rule.args.forEach(arg=>{
                            if(arg.type != 'object'){
                                if(arg.type=='integer'||arg.type=='number') {
                                    cmd.arguments.push(Number(arg.value))
                                }else{
                                    cmd.arguments.push(arg.value)
                                }
                            }else{
                                var argValue
                                if(arg.propType=='integer'||arg.propType=='number') {
                                    argValue = Number(arg.value)
                                }else{
                                    argValue = arg.value
                                }
                                argObj[arg.propId]=argValue
                            }
                        })
                        if(Object.keys(argObj).length>0){
                            cmd.arguments.push(argObj)
                        }
                        commandArr.push(cmd);
                    }
                    if (commandArr.length > 0) {
                        OneApi.executeDeviceCommands(param, {commands: commandArr}, authToken).then(function (data) {
                            RED.util.setMessageProperty(msg, 'payload', commandArr);
                            onward.push(msg);
                            NODE.send(onward);
                        }).catch(function (err) {
                            console.error(err)
                            sendDebug("[error] " + err.errCd + ", " + err.errMsg);
                        })
                    }else {
                        RED.util.setMessageProperty(msg, 'payload', "command is empty");
                        onward.push(msg);
                        NODE.send(onward);
                    }
                }
            } catch (err) {
                NODE.warn(err);
            }
        });
    }

    RED.nodes.registerType(ST_EVENT_DEVICE, ThingNode);
    RED.nodes.registerType(ST_STATUS_DEVICE, ThingNode);
    RED.nodes.registerType(ST_COMMAND_DEVICE, ThingNode);
    function stCompatibleCheck(node){
        if(ST_NODES.includes(node.type) && (node.capability || (node.device && typeof node.device.capabilities == 'object'))) {
            switch (node.type) {
                case ST_DEVICE_PROFILE:
                    node.capabilityId = node.capability
                    delete node.capability
                    delete node.device
                    break;
                case ST_MY_DEVICE:
                    if(node.device){
                        var capas = []
                        node.device.components.forEach(component=>{
                            component.capabilities.forEach(capability=>{
                                capas.push(capability.id)
                            })
                        })
                        node.device.capabilities = capas
                    }
                    break;
                case ST_EVENT_DEVICE:
                case ST_STATUS_DEVICE:
                case ST_COMMAND_DEVICE:
                    node.deviceNodeId=node.deviceId
                    node.capabilityId=node.capability
                    node.attributeId=node.attribute

                    node.rules=[]
                    if(node.sensorAttrDs && node.sensorAttrDs.length>0){
                        for(var r of node.sensorAttrDs){
                            var rule = {}
                            rule.capaId=node.capabilityId
                            rule.attrId=r.col1
                            rule.operator=r.col2
                            rule.value=r.col3
                            rule.valueType=(r.col4=='num')?'integer':'string'
                            node.rules.push(rule)
                        }
                    }
                    if(node.sensorCapaDs && node.sensorCapaDs.length>0){
                        for(var r of node.sensorCapaDs){
                            var rule = {}
                            rule.capaId=r.col1
                            rule.attrId=r.col2
                            rule.args=[]
                            var typesObj = JSON.parse(r.argType)
                            var idx = 0
                            for(var argName in typesObj){
                                var arg = {name:argName,type:typesObj[argName],value:r['col'+(3+idx)]}
                                rule.args.push(arg)
                                idx++
                            }
                            node.rules.push(rule)
                        }
                    }

                    delete node.deviceId
                    delete node.capability
                    delete node.attribute
                    delete node.sensorAttrDs
                    delete node.sensorCapaDs

                    break;
            }
        }
    }

}
