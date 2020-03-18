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

    var operator = {
        "eq": "==",
        "neq": "!=",
        "lt": "<",
        "lte": "<=",
        "gt": ">",
        "gte": ">="
    };

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
        }
    };

    var usedDeviceConfig = [];
    var eventDeviceConfig = [];
    var actionDeviceConfig = [];
    
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

        var node = this;

        var EventSectionID;
        var Eventcapability;
        var Eventattribute;
        //clone nodes information
        var allnodes = [];
        RED.nodes.eachNode(function (nn) {
            allnodes[nn.id] = Object.assign({}, nn);
        });

        // 사용하는 config node id 저장
        usedDeviceConfig = [];
        eventDeviceConfig = [];
        actionDeviceConfig = [];
        /* ---------------------------------------------------------------------------------- */
        /* queue 파라미터에 해당하는 연결 노드들에 대한 BFS 탐색을 처리한다.                       */
        /* Automation부터 wires를 따라 노드를 스캔하면서 Device 일 경우 해당 Deivce Config 저장   */
        /* node visited 여부 확인 - loop, flow traverse 동안 중복 체크                          */
        var queue = [];
        queue.push(this.id);

        var checkVisited = {};
        checkVisited[this.id] = true;

        var checkSet = {};

        while (queue.length > 0) {
            var curID = queue.shift();
            var nodeInfo = allnodes[curID];
            if (/^(event|status|command)-device$/g.test(nodeInfo.type) && allnodes[nodeInfo.deviceId] && allnodes[nodeInfo.deviceId].type === 'device-profile') {
                if (nodeInfo.deviceId in checkSet) {  // 이미 추가된 경우
                    //skip
                } else if(nodeInfo.deviceId && nodeInfo.deviceId !='') {
                    usedDeviceConfig.push(nodeInfo.deviceId); /* Config id 저장*/
                    checkSet[nodeInfo.deviceId] = true;
                    if (nodeInfo.eqtype == "event") {
                        Eventattribute = nodeInfo.attribute;
                    }
                }
                if(nodeInfo.type == 'event-device' && eventDeviceConfig.indexOf(nodeInfo.deviceId)<0) {
                    eventDeviceConfig.push(nodeInfo.deviceId);
                }
                if(nodeInfo.type == 'command-device' && actionDeviceConfig.indexOf(nodeInfo.deviceId)<0) {
                    actionDeviceConfig.push(nodeInfo.deviceId);
                }
            }
            /* 해당 Node의 다음 연결 wires 정보로 탐색을 계속한다. */
            var wires = nodeInfo.wires;
            for (var port in wires) {
                for (var connectedNode in wires[port]) {
                    if (wires[port][connectedNode] in checkVisited) {
                        //skip
                    } else {
                        queue.push(wires[port][connectedNode]);
                        checkVisited[wires[port][connectedNode]] = true;
                    }
                }
            }
        }
        /* ---------------------------------------------------------------------------------- */
        /*  사용중인 page config 만 골라와서 배열에 JSON 형식으로 section 값을 할당한다 */

        var PageValArr = [];
        for (var i in usedDeviceConfig) {
            var confNode = allnodes[usedDeviceConfig[i]];
            // child 가 event 면 child 가 action 이면
            var permissions = ['r'];
            if(eventDeviceConfig.indexOf(confNode.id)>-1) {
                EventSectionID = confNode.name;
                Eventcapability = confNode.capability;
            }
            if (actionDeviceConfig.indexOf(confNode.id)>-1) {
                permissions.push('x');
            }
            var PageJson = {
                name: confNode.name,
                settings: [
                    {
                        id: confNode.name,
                        name: confNode.name,
                        description: confNode.name + ":" + confNode.capability,
                        type: 'DEVICE',
                        required: true,
                        multiple: false,
                        capabilities: [confNode.capability],
                        permissions: permissions
                    }
                ]
            };
            PageValArr.push(PageJson);
        }
        if (!n.url) {
            this.warn(RED._("SmartThings.error.missing-path"));
            return;
        }

        this.url = n.url;
        if (this.url[0] !== '/') {
            this.url = '/' + this.url;
        }

        var automationPing = function (req, res) {
            debugLog("[lifecycle] PING");

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
            debugLog("[lifecycle] CONFIGURATION");

            //console.log("CONFIGURATION");
            var evt = req.body;
            if (!evt.configurationData) {
                var msg = "Required parameter doesn't exist";
                debugLog("[error] " + msg);
                RES.error(res, 400, msg);
                return;
            }

            var rtnObj = {};
            if (evt.configurationData.phase == "INITIALIZE") {
                rtnObj.initialize = {
                    id: "app_" + node.name.replace(/ /g, ''),  //공백제거
                    name: node.name,
                    description: node.name,
                    firstPageId: "1",
                    permissions: []
                };
            } else if (evt.configurationData.phase == "PAGE") {
                if (evt.configurationData.pageId !== "1") {
                    RES.error(res, 400, `Unsupported page id: ${evt.configurationData.pageId}`);
                    return;
                }
                rtnObj.page = {
                    pageId: '1',
                    name: node.name,
                    nextPageId: null,
                    previousPageId: null,
                    complete: true,
                    sections: PageValArr
                };
            } else {
                RES.error(res, 400, `Unsupported phase: ${evt.configurationData.phase}`);
                return;
            }
            RES.ok(res, {statusCode: 200, configurationData: rtnObj});
        };

        var automationInstall = function (req, res) {
            debugLog("[lifecycle] INSTALL");

            var evt = req.body;
            var installedAppId = evt.installData.installedApp.installedAppId;
            var config = evt.installData.installedApp.config;
            var authToken = evt.installData.authToken;
            var EventID = config[EventSectionID][0];
            var subRequest = {
                sourceType: 'DEVICE',
                device: {
                    componentId: EventID.deviceConfig.componentId,
                    deviceId: EventID.deviceConfig.deviceId,
                    capability: Eventcapability,
                    attribute: Eventattribute,
                    stateChangeOnly: true,
                    subscriptionName: `${Eventattribute}_subscription`,
                    value: "*"
                }
            };
            /* executeCreateSubscription 처리 */
            var keyParam = {};
            keyParam['installedAppId'] = installedAppId;
            OneApi.executeCreateSubscription(keyParam, subRequest, authToken).then(function (data) {
                debugLog("Create Subscription : " + JSON.stringify(data))
            }).catch(function (err) {
                console.log("[error] " + err.errCd + ", " + err.errMsg);
            });
            RES.ok(res, {statusCode: 200, installData: {}});
        };

        var automationUpdate = function (req, res) {
            debugLog("[lifecycle] UPDATE");
            var evt = req.body;
            var installedAppId = evt.updateData.installedApp.installedAppId;
            var config = evt.updateData.installedApp.config;
            var authToken = evt.updateData.authToken;
            var EventID = config[EventSectionID][0];
            var subRequest = {
                sourceType: 'DEVICE',
                device: {
                    componentId: EventID.deviceConfig.componentId,
                    deviceId: EventID.deviceConfig.deviceId,
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
            debugLog("[lifecycle] UNINSTALL");
            RES.ok(res, {statusCode: 200, uninstallData: {}});
        };

        var automationEvent = function (req, res) {
            debugLog("[lifecycle] EVENT");
            RES.ok(res, {statusCode: 200, eventData: {}});
            node.context().flow.set('evt', req.body);
            node.send({payload: req.body});
        };

        var routingMap = {
            "PING": automationPing,
            "CONFIGURATION": automationConfiguration,
            "INSTALL": automationInstall,
            "UPDATE": automationUpdate,
            "UNINSTALL": automationUninstall,
            "EVENT": automationEvent
        };

        this.errorHandler = function (err, req, res, next) {
            node.error(err);
            RES.error(res, 500, "Internal Server Errror");
        };

        this.callback = function (req, res) {
            var msgid = RED.util.generateId();
            var handleRequest = routingMap[req.body.lifecycle];
            if (!handleRequest) {
                var msg = "No matched lifecycle";
                debugLog("[error] " + msg);
                RES.error(res, 400, msg);
            } else {
                handleRequest(req, res);
            }
        };

        function verifySignature(req) {
            try {
                let publickey;
                if (node.publickey) {
                    publickey = node.publickey.replace(/\\r\\n/g, "").replace(/\\n/g, "");
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
                RED.comms.publish("debug", {id: node.id, z: node.z, name: node.name, topic: "Automation", msg: log});
            } catch (err) {
                console.error(err);
            }
        }
        RED.httpNode.post(this.url, nextHandler, httpMiddleware, corsHandler, nextHandler, jsonParser, nextHandler, nextHandler, nextHandler, this.callback, this.errorHandler);
        this.on("close", function () {
            var node = this;
            RED.httpNode._router.stack.forEach(function (route, i, routes) {
                if (route.route && route.route.path === node.url) {
                    routes.splice(i, 1);
                }
            });
        });
    }
    RED.nodes.registerType("automation", Automation);

    function DeviceConfigNode(n) {
        RED.nodes.createNode(this, n);
        this.name = n.name;
        this.capability = n.capability;
    }
    RED.nodes.registerType("device-profile", DeviceConfigNode);

    function installedDeviceConfigNode(n) {
        RED.nodes.createNode(this, n);
        this.name = n.name;
        this.capability = n.capability;

        this.stAccessToken = n.stAccessToken;
        if(n.device){
            this.stDeviceId = n.device.deviceId;
            this.device = n.device;
        }

    }
    RED.nodes.registerType("installed-device", installedDeviceConfigNode,{credentials:{
            stAccessToken:{type:'text', required:true}
        }});

    function ThingNode(n) {
        function sendDebug(message) {
            var msg = {};
            RED.comms.publish("debug", {"msg": message});
        }

        RED.nodes.createNode(this, n);

        this.type = n.type;
        this.name = n.name;
        this.eqtype = n.eqtype;
        this.capability = n.capability;

        this.sensorCapaDs = n.sensorCapaDs || [];
        this.sensorAttrDs = n.sensorAttrDs || [];
        if(n.deviceId===''){
            this.warn('Deivce Node error: deviceId is undefined');
            return;
        }
        this.deviceId = n.deviceId;

        //validation 체크 capability로우는 빈값이 없어야한다.
        var NODE = this;
        var valid = true;

        try {
            for (var i = 0; i < this.sensorCapaDs.length; i++) {
                var rule = this.sensorCapaDs[i];
                for (var key in rule) {
                    if (rule[key].trim() == '') {
                        throw new Error("Row[" + i + "] - Not a empty");
                    }
                }

                if (rule.argType != undefined) {
                    var argType = JSON.parse(rule.argType);
                    var keys = Object.keys(argType);

                    if (keys.length > 0) {//command 명령어가 존재한다면({}가 아니라면)
                        for (var j = 0; j < keys.length; j++) {
                            if (rule["col" + (j + 3) + "_vt"] == "num") {
                                if (isNaN(Number(rule["col" + (j + 3)]))) {
                                    throw new Error("Row[" + i + "] - Not a number");
                                }
                            }
                        }
                    }
                }
            }

            for (var i = 0; i < this.sensorAttrDs.length; i++) {
                var rule = this.sensorAttrDs[i];
                // [==,!=] 이외에는 모두 숫자형식의 데이터이다.
                if (rule.col2 != 'eq' && rule.col2 != 'neq') {
                    if (isNaN(Number(rule.col3))) {
                        throw new Error("Row[" + i + "] - Not a number");
                    }
                }
            }
        } catch (e) {
            this.error(RED._("SmartThings.error.invalid-input", {error: e.message}));
            valid = false;
        }

        if (!valid) {
            return;
        }

        this.on('input', function (msg) {
            var onward = [];
            try {
                var param = {};
                var confName = RED.nodes.getNode(NODE.deviceId).name;
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

                if (RED.nodes.getNode(NODE.deviceId).type==='installed-device'){
                    isAutomation=false;
                    authToken = RED.nodes.getNode(NODE.deviceId).credentials.stAccessToken;
                    param.deviceId = RED.nodes.getNode(NODE.deviceId).stDeviceId;
                }else{
                    isAutomation=true;
                    evt = flowContext.eventData;
                    fromEvent = evt.events[0].deviceEvent;
                    targetInfo = evt.installedApp.config[confName][0].deviceConfig;//현재는 section 당 한개의 기기만으로 제한되어있음.[0]처리
                    authToken = evt.authToken;
                    param.deviceId = targetInfo.deviceId;
                }

                if (NODE.eqtype == 'event') {
                    sendDebug("[flow] Event:" + NODE.name + "("+confName+")");
                    var opCheck = false;
                    for (var idx = 0; idx < NODE.sensorAttrDs.length; idx++) {
                        var rule = NODE.sensorAttrDs[idx];
                        var attrHierarchy = rule.hidden1.split("|");
                        var val = fromEvent.value;

                        if (typeof val == 'object') val = val.value;
                        if (rule.col3 == '' || rule.col3 == undefined) rule.col3 = "\'\'";
                        opCheck = operators[rule.col2](val, rule.col3);
                        if (opCheck) {
                            RED.util.setMessageProperty(msg, 'payload', attrHierarchy[0] + "=\""+val+"\" check success[" + idx + "]");
                            onward.push(msg);
                        } else {
                            onward.push(null);
                        }
                    }
                    if (NODE.sensorAttrDs.length == 0) {
                        RED.util.setMessageProperty(msg, 'payload', JSON.stringify(fromEvent));
                        onward.push(msg);
                    }
                    NODE.send(onward);
                } else if (NODE.eqtype == 'status') {
                    OneApi.getDeviceStates(param, authToken).then(function (data) {
                        sendDebug("[flow] Condition:" + NODE.name + "("+confName+")");
                        var deviceStates = data;
                        var opCheck = false;

                        NODE.sensorAttrDs.forEach((rule,idx)=>{
                            var attrHierarchy = rule.hidden1.split("|");
                            var val = deviceStates['components'][targetInfo.componentId||'main'][NODE.capability][attrHierarchy[0]];

                            if (typeof val == 'object'){
                                val = val.value;
                            }
                            if (rule.col3 == '' || rule.col3 == undefined){
                                rule.col3 = "\'\'";
                            }
                            opCheck = operators[rule.col2](val, rule.col3);
                            if (opCheck) {
                                RED.util.setMessageProperty(msg, 'payload', attrHierarchy[0] + "=\""+val+"\" check success[" + idx + "]");
                                onward.push(msg);
                            } else {
                                onward.push(null);
                            }
                        })

                        if (NODE.sensorAttrDs.length == 0) {
                            RED.util.setMessageProperty(msg, 'payload', JSON.stringify(data));
                            onward.push(msg);
                        }
                        NODE.send(onward);

                    }).catch(function (err) {
                        sendDebug("[error] " + err.errCd + ", " + err.errMsg);
                    });
                } else {
                    sendDebug("[flow] Action:" + NODE.name + "("+confName+")");
                    //multiple : true 기능 지원 으로 (해당 deviceid의 모든 기기를 동시에 제어)
                    var confName = RED.nodes.getNode(NODE.deviceId).name;
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
                        for (var i = 0; i < NODE.sensorCapaDs.length; i++) {
                            var rule = NODE.sensorCapaDs[i];
                            var tCmd = rule.col2;
                            var cmd = {"component": targetInfo.componentId || "main", "capability": rule.col1, "command": tCmd};
                            cmd.arguments = [];
                            var argument = {};
                            if (rule.argType != undefined) {
                                var argType = JSON.parse(rule.argType);
                                var keys = Object.keys(argType);
                                var types;
                                if (rule.types != undefined) {
                                    types = JSON.parse(rule.types);
                                }
                                if (keys.length > 0) {//command 명령어가 존재한다면({}가 아니라면)
                                    var tmp;
                                    var tempIdx = 0;
                                    for (var j = 0; j < keys.length; j++) {
                                        //typeinput 값이 존재하고 데이터 유형이 object인 경우
                                        if (types != undefined && types[keys[j]].hasOwnProperty("prop")) {
                                            argument = {};

                                            var propKeys = Object.keys(types[keys[j]].prop);

                                            for (var k = 0; k < propKeys.length; k++, tempIdx++) {
                                                tmp = rule["col" + (tempIdx + 3)];
                                                if (rule["col" + (tempIdx + 3) + "_vt"] == "num") {
                                                    tmp = Number(tmp);
                                                }
                                                argument[propKeys[k]] = tmp;
                                            }
                                            cmd.arguments.push(argument);
                                        } else {
                                            tmp = rule["col" + (tempIdx + 3)];
                                            if (rule["col" + (tempIdx + 3) + "_vt"] == "num") {
                                                tmp = Number(tmp);
                                            }
                                            tempIdx++
                                            cmd.arguments.push(tmp);
                                        }
                                    }
                                }
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

    RED.nodes.registerType("event-device", ThingNode);
    RED.nodes.registerType("status-device", ThingNode);
    RED.nodes.registerType("command-device", ThingNode);

}
