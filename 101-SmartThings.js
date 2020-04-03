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
            console.log(`RES ok : ${JSON.stringify(obj)}`);
            res.json(obj);
        },
        error: function (res, status, msg) {
            console.log(`RES error[${status}] : ${msg}`);
            res.status(status).send(msg);
        }
    };

    function Automation(n) {
        RED.nodes.createNode(this, n);
        this.id = n.id;
        this.wires = n.wires;
        this.name = n.name;
        this.url = n.url;
        this.publickey = n.publickey;

        var NODE = this;

        var EventSectionID;
        var Eventcapability;
        var Eventattribute;
        //clone nodes information
        var allnodes = [];
        RED.nodes.eachNode(function (nn) {
            allnodes[nn.id] = Object.assign({}, nn);
        });

        // 사용하는 config node id 저장
        usedDeviceNodes = []
        eventDeviceNodes = []
        actionDeviceNodes = []

        /* ---------------------------------------------------------------------------------- */
        /* queue 파라미터에 해당하는 연결 노드들에 대한 BFS 탐색을 처리한다.                       */
        /* Automation부터 wires를 따라 노드를 스캔하면서 Device 일 경우 해당 Deivce Config 저장   */
        /* node visited 여부 확인 - loop, flow traverse 동안 중복 체크                          */
        var queue = [];
        queue.push(this.id);

        // var checkVisited = {};
        // checkVisited[this.id] = true;

        // var checkSet = {};

        var visited = new Set([this.id])
        var sectionConfig={}
        var subscriptionDevices=[]
        while (queue.length > 0) {
            var curID = queue.shift();
            var node = allnodes[curID];
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
                // if (node.deviceNodeId in checkSet) {  // 이미 추가된 경우
                //     //skip
                // } else if(node.deviceNodeId && node.deviceNodeId !== '') {
                //     usedDeviceNodes.push(node.deviceNodeId)
                //     checkSet[node.deviceNodeId] = true;
                //     if (node.type == ST_EVENT_DEVICE) {
                //         Eventattribute = node.attributeId;
                //     }
                // }
                // if(node.type == ST_EVENT_DEVICE && eventDeviceNodes.indexOf(node.deviceNodeId)<0) {
                //     eventDeviceNodes.push(node.deviceNodeId)
                // }
                // if(node.type == ST_COMMAND_DEVICE && actionDeviceNodes.indexOf(node.deviceNodeId)<0) {
                //     actionDeviceNodes.push(node.deviceNodeId)
                // }
            }
            /* 해당 Node의 다음 연결 wires 정보로 탐색을 계속한다. */
            var wires = node.wires;
            node.wires.forEach(function(wire){
                wire.forEach(function(nodeId){
                    if(visited.has(nodeId) == false){
                        visited.add(nodeId)
                        queue.push(nodeId)
                    }
                })
            })
            // for (var port in wires) {
            //     for (var connectedNode in wires[port]) {
            //         if (wires[port][connectedNode] in checkVisited) {
            //             //skip
            //         } else {
            //             queue.push(wires[port][connectedNode]);
            //             checkVisited[wires[port][connectedNode]] = true;
            //         }
            //     }
            // }
        }
        var sections = Object.values(sectionConfig)
        /* ---------------------------------------------------------------------------------- */
        /*  사용중인 page config 만 골라와서 배열에 JSON 형식으로 section 값을 할당한다 */

        // var sections = [];
        // for (var i in usedDeviceNodes) {
        //     var confNode = allnodes[usedDeviceNodes[i]];
        //     // child 가 event 면 child 가 action 이면
        //     var permissions = ['r'];
        //     if(eventDeviceNodes.indexOf(confNode.id)>-1) {
        //         EventSectionID = confNode.name;
        //         Eventcapability = confNode.capabilityId;
        //     }
        //     if (actionDeviceNodes.indexOf(confNode.id)>-1) {
        //         permissions.push('x');
        //     }
        //     var section = {
        //         name: confNode.name,
        //         settings: [
        //             {
        //                 id: confNode.name,
        //                 name: confNode.name,
        //                 description: confNode.name + ":" + confNode.capabilityId,
        //                 type: 'DEVICE',
        //                 required: true,
        //                 multiple: false,
        //                 capabilities: [confNode.capabilityId],
        //                 permissions: permissions
        //             }
        //         ]
        //     }
        //     sections.push(section);
        // }

        if (!n.url) {
            this.warn(RED._("SmartThings.error.missing-path"));
            return;
        }

        this.url = n.url;
        if (this.url[0] !== '/') {
            this.url = '/' + this.url;
        }

        var automationPing = function (req, res) {
            var evt = req.body;
            if (!evt.pingData) {
                var msg = "Required parameter doesn't exist";
                debugLog("[error] " + msg);
                RES.error(res, 400, msg);
                return;
            }
            RES.ok(res, {statusCode: 200, pingData: {challenge: evt.pingData.challenge}});
        };

        var automationConfiguration = function (req, res) {
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
        };

        var automationInstall = function (req, res) {
            var evt = req.body
            var installedAppId = evt.installData.installedApp.installedAppId
            var authToken = evt.installData.authToken

            subscriptionDevices.forEach((eventDevice)=>{
                var sectionInfo = evt.installData.installedApp.config[eventDevice.sectionId]
                var subRequest = {
                    sourceType: 'DEVICE',
                    device: {
                        deviceId: sectionInfo.deviceConfig.deviceId,
                        componentId: sectionInfo.deviceConfig.componentId,
                        capability: eventDevice.capabilityId,
                        attribute: eventDevice.attributeId,
                        stateChangeOnly: true,
                        subscriptionName: `${Eventattribute}_subscription`,
                        value: "*"
                    }
                }
                var keyParam = {}
                keyParam.installedAppId = installedAppId

                OneApi.executeCreateSubscription(keyParam, subRequest, authToken).then(function (data) {
                    debugLog("Create Subscription : " + JSON.stringify(data))
                }).catch(function (err) {
                    console.log("[error] " + err.errCd + ", " + err.errMsg);
                })
            })
            RES.ok(res, {statusCode: 200, installData: {}})
        }

        var automationUpdate = function (req, res) {
            var evt = req.body;
            var installedAppId = evt.updateData.installedApp.installedAppId;
            var config = evt.updateData.installedApp.config;
            var authToken = evt.updateData.authToken;
            var EventID = config[EventSectionID][0];
            var subRequest = {
                sourceType: 'DEVICE',
                device: {
                    deviceId: EventID.deviceConfig.deviceId,
                    componentId: EventID.deviceConfig.componentId,
                    capability: Eventcapability,
                    attribute: Eventattribute,
                    stateChangeOnly: true,
                    subscriptionName: `${Eventattribute}_subscription`,
                    value: "*"
                }
            };

            var keyParam = {};
            keyParam['installedAppId'] = installedAppId;
            /* executeDeleteSubscription 처리 */
            OneApi.executeDeleteSubscription(keyParam, authToken).then(function (data) {
                OneApi.executeCreateSubscription(keyParam, subRequest, authToken).then(function (data) {
                }).catch(function (err) {
                    console.log("Install errorCode : " + err.errCd + " message : " + err.errMsg);
                });
            }).catch(function (err) {
                console.log("Delete errorCode : " + err.errCd + " message : " + err.errMsg);
            });
            RES.ok(res, {statusCode: 200, updateData: {}});
        };

        var automationUninstall = function (req, res) {
            RES.ok(res, {statusCode: 200, uninstallData: {}});
        };

        var automationEvent = function (req, res) {
            RES.ok(res, {statusCode: 200, eventData: {}});
            NODE.context().flow.set('evt', req.body);
            NODE.send({payload: req.body});
        };

        var confirmation = function (req,res){
            console.log(req)

            RES.ok(res, {statusCode: 200, targetUrl: "target_url"});
        }
        var routingMap = {
            "PING": automationPing,
            "CONFIRMATION": confirmation,
            "CONFIGURATION": automationConfiguration,
            "INSTALL": automationInstall,
            "UPDATE": automationUpdate,
            "UNINSTALL": automationUninstall,
            "EVENT": automationEvent
        };

        this.errorHandler = function (err, req, res, next) {
            NODE.error(err);
            RES.error(res, 500, "Internal Server Errror");
        };

        this.callback = function (req, res) {
            var msgid = RED.util.generateId();
            var handler = routingMap[req.body.lifecycle];
            if (!handler) {
                var msg = "No matched lifecycle";
                debugLog("[error] " + msg);
                RES.error(res, 400, msg);
            } else {
                debugLog('[lifecycle] '+req.body.lifecycle)
                handler(req, res);
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
        RED.httpNode.post(this.url, nextHandler, httpMiddleware, corsHandler, nextHandler, jsonParser, nextHandler, this.callback, this.errorHandler);
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
        this.device=n.device
    }
    RED.nodes.registerType(ST_DEVICE_PROFILE, DeviceConfigNode);

    function installedDeviceConfigNode(n) {
        RED.nodes.createNode(this, n)
        this.device = n.device
    }

    RED.nodes.registerType(ST_MY_DEVICE, installedDeviceConfigNode,{credentials:{
            stAccessToken:{type:'text', required:true}
        }});

    function ThingNode(n) {
        function sendDebug(message) {
            var msg = {};
            RED.comms.publish("debug", {"msg": message});
        }

        RED.nodes.createNode(this, n)
        this.deviceNodeId = n.deviceNodeId
        this.deviceId = n.deviceId
        this.capabilityId = n.capabilityId
        this.attributeId = n. attributeId
        this.sensorCapaDs = n.sensorCapaDs || []
        this.rules = n.rules || []

        if(n.deviceNodeId===''){
            this.warn('Deivce Node error: deviceNodeId is undefined')
            return
        }

        var NODE = this;

        this.on('input', function (msg) {
            var onward = [];
            try {
                var param = {};
                var confName = RED.nodes.getNode(NODE.deviceNodeId).name;
                let flowContext = NODE.context().flow.get('evt');
                if (flowContext == undefined) {
                    // throw new Error("Context Data is null");
                }
                //TEST noAutomation
                var evt = {};
                var fromEvent = {};
                var targetInfo = ""
                var authToken = "";
                param.deviceId = "";
                var isAutomation=true;

                if (RED.nodes.getNode(NODE.deviceNodeId).type == ST_MY_DEVICE){
                    isAutomation=false;
                    authToken = RED.nodes.getNode(NODE.deviceNodeId).credentials.stAccessToken;
                    param.deviceId = NODE.deviceId
                }else{
                    isAutomation=true;
                    evt = flowContext.eventData;
                    fromEvent = evt.events[0].deviceEvent;
                    targetInfo = evt.installedApp.config[confName][0].deviceConfig;//현재는 section 당 한개의 기기만으로 제한되어있음.[0]처리
                    authToken = evt.authToken;
                    param.deviceId = targetInfo.deviceId;
                }

                if (NODE.type == ST_EVENT_DEVICE) {
                    sendDebug("[flow] Event:" + NODE.name + "("+confName+")")
                    var opCheck = false;
                    for (var idx = 0; idx < NODE.rules.length; idx++) {
                        var rule = NODE.rules[idx]
                        var attrHierarchy = rule.hidden1.split("|")
                        var val = fromEvent.value

                        if (typeof val == 'object') val = val.value;
                        if (rule.value == '' || rule.value == undefined) rule.value = "\'\'"
                        opCheck = operators[rule.operator](val, rule.value);
                        if (opCheck) {
                            RED.util.setMessageProperty(msg, 'payload', attrHierarchy[0] + "=\""+val+"\" check success[" + idx + "]")
                            onward.push(msg)
                        } else {
                            onward.push(null)
                        }
                    }
                    if (NODE.rules.length == 0) {
                        RED.util.setMessageProperty(msg, 'payload', JSON.stringify(fromEvent));
                        onward.push(msg);
                    }
                    NODE.send(onward);
                } else if (NODE.type == ST_STATUS_DEVICE) {
                    OneApi.getDeviceStates(param, authToken).then(function (data) {
                        sendDebug("[flow] Condition:" + NODE.name + "("+confName+")");
                        var deviceStatus = data;
                        var opCheck = false;

                        NODE.rules.forEach((rule,idx)=>{
                            var attributeValue = deviceStatus.components[targetInfo.componentId||'main'][NODE.capabilityId][NODE.attributeId].value;

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
                        sendDebug("[error] " + err.errCd + ", " + err.errMsg);
                    });
                } else {
                    sendDebug("[flow] Action:" + NODE.name + "("+confName+")");
                    //multiple : true 기능 지원 으로 (해당 deviceid의 모든 기기를 동시에 제어)
                    var confName = RED.nodes.getNode(NODE.deviceNodeId).name;
                    var multipleCmd = [];

                    var targetInfoArr=[];
                    if(isAutomation){
                        targetInfoArr = evt.installedApp.config[confName];
                    }else{
                        targetInfoArr=[{deviceConfig:{componentId:"main"}}]
                    }

                    for (var idx = 0; idx < targetInfoArr.length; idx++) {
                        targetInfo = targetInfoArr[idx].deviceConfig;
                        var commandArr = [];
                        for(var rule of NODE.rules){
                            var cmd = {"component": targetInfo.componentId || "main", "capability": rule.capaId, "command": rule.attrId};
                            cmd.arguments = [];

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
                            multipleCmd.push(OneApi.executeDeviceCommands(param, {"commands": commandArr}, authToken));
                        }
                    }
                    if (multipleCmd.length > 0) {
                        Promise.all(multipleCmd).then(function (data) {
                            RED.util.setMessageProperty(msg, 'payload', "command execute success");
                            onward.push(msg);
                            NODE.send(onward);
                        }).catch(function (err) {
                            sendDebug("[error] " + err.errCd + ", " + err.errMsg);
                        });
                    } else {
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

}
