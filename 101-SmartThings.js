/**
    Copyright 2020 Samsung Automation Studio Team

    Licensed under the Apache License, Version 2.0 (the "License");
    you may not use this file except in compliance with the License.
    You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

    Unless required by applicable law or agreed to in writing, software
    distributed under the License is distributed on an "AS IS" BASIS,
    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
    See the License for the specific language governing permissions and
    limitations under the License.
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

    process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0;

    var os = require('os');
    var bodyParser = require("body-parser");
    var cors = require('cors');
    var jsonParser = bodyParser.json();
    // var httpSignature = require('http-signature');
    var reqApi = require('./lib/oneapigateway');
    var SmartThingsAPI = require('./lib/SmartThingsAPI');
    var SmartThingsProfile = require('./lib/SmartThingsProfile');
    var corsHandler = cors({origin: "*", methods: "POST"});

    RED.httpNode.options("*", corsHandler);
    var nextHandler = function (req, res, next) {
        next();
    }

    RED.httpNode.get('/_smartthings/capabilities',RED.auth.needsPermission("settings.read"),(req,res)=>{
        res.json(SmartThingsProfile.getCapabilities()||{});
    })
    RED.httpNode.get('/_smartthings/mydeviceinfo',RED.auth.needsPermission("credentials.read"),(req,res)=>{
        SmartThingsProfile.getMDinfos().then(MDinfos=>{
            res.json(MDinfos||{});
        })
    })

    var operators = {
        //parameter a : condition value set by user
        //parameter b : value get from device
        eq: function (a, b) {
            if(typeof b ==='object'){
                if(typeof a != 'object'){
                    try{ a=JSON.parse(a); }
                    catch(e){ return false; }
                }
                return Object.keys(a).every(key=>{
                    return b.hasOwnProperty(key) && this.eq(a[key],b[key]);
                })
            }else{
                return a==b;
            }
        },
        neq: function (a, b) {
            return !this.eq(a,b);
        },
        lt: function (a, b) {
            return a < b;
        },
        lte: function (a, b) {
            return a <= b;
        },
        gt: function (a, b) {
            return a > b;
        },
        gte: function (a, b) {
            return a >= b;
        },
        in: function(v,arr){
            return Array.isArray(arr) && arr.some(dv=>this.eq(v,dv))
        },
        nin: function(v,arr){
            return Array.isArray(arr) && !(this.in(v,arr))
        },
        o_eq: function(v,obj){
            if(typeof v != 'object'){
                try{
                    v=JSON.parse(v)
                }catch(e){
                    return false;
                }
            }
            if(obj==undefined || obj==null || typeof obj != 'object'){
                return false;
            }
            return Object.keys(v).every(k=>{
                return obj && obj.hasOwnProperty(k) && v[k] == obj[k]
            })
        },
        o_neq: function(v,obj){
            if(typeof v != 'object'){
                try{
                    v=JSON.parse(v)
                }catch(e){
                    return false
                }
            }
            if(typeof obj != 'object'){
                return false
            }

            return Object.keys(v).every(k=>{
                return obj && obj.hasOwnProperty(k) && v[k] != obj[k]
            })
        },

    };

    var usedDeviceNodes = [];
    var eventDeviceNodes = [];
    var actionDeviceNodes = [];

    var OneApi = {
        executeDeleteSubscription: function (keyParam, token) {
            return new Promise(function (resolve, reject) {
                reqApi.callOneApi("subscriptions", "executeDeleteSubscription", keyParam, undefined, undefined, token, function (body) {
                    try {
                        resolve(body);
                    } catch (e) {
                        reject(body);
                    }
                });
            },true);
        },

        executeCreateSubscription: function (keyParam, bodyParam, token) {
            return new Promise(function (resolve, reject) {
                reqApi.callOneApi("subscriptions", "executeCreateSubscription", keyParam, undefined, bodyParam, token, function (body) {
                    try {
                        resolve(body);
                    } catch (e) {
                        reject(body);
                    }
                });
            },true);
        },

        getDeviceStates: function (keyParam, token, isLogging) {
            return new Promise(function (resolve, reject) {
                reqApi.callOneApi("device", "getDeviceStates", keyParam, undefined, undefined, token, function (data) {
                    try {
                        resolve(data);
                    } catch (e) {
                        reject(data);
                    }
                }, isLogging);
            });

        },

        executeDeviceCommands: function (keyParam, bodyParam, token, isLogging) {
            return new Promise(function (resolve, reject) {
                reqApi.callOneApi("device", "executeDeviceCommands", keyParam, undefined, bodyParam, token,function (data) {
                    if (typeof data === 'object') {
                        if (data.hasOwnProperty("errMsg")) {
                            reject(data);
                        } else {
                            resolve(data);
                        }
                    } else {
                        resolve(data);
                    }
                }, isLogging);
            });
        }
    };

    var RES = {
        ok: function (res, obj) {
            // console.log(`RES ok : ${JSON.stringify(obj)}`)
            res.json(obj)
        },
        error: function (res, status, msg) {
            // console.log(`RES error[${status}] : ${msg}`)
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
        var eventDevices=[]

        while (queue.length > 0) {
            var currentId = queue.shift();
            var node = allnodes[currentId];
            if(node.hasOwnProperty('capabilityId')){
                node.capabilityId = node.capabilityId.split('_v')[0]||''
            }
            if (/^(event|status|command)-device$/g.test(node.type) && allnodes[node.deviceNodeId] && allnodes[node.deviceNodeId].type === ST_DEVICE_PROFILE) {
                if(!sectionConfig.hasOwnProperty(node.deviceNodeId)){
                    var deviceNode = allnodes[node.deviceNodeId]
                    deviceNode.capabilityId = deviceNode.capabilityId.split('_v')[0]
                    sectionConfig[deviceNode.id]={
                        name: deviceNode.name,
                        settings: [
                            {
                                id: deviceNode.id,
                                name: deviceNode.name||deviceNode.alias,
                                description: (deviceNode.name||deviceNode.alias) + ":" + deviceNode.capabilityId,
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
                    eventDevices.push({sectionId:node.deviceNodeId,capabilityId:node.capabilityId,attributeId:node.attributeId});
                }
            }

            node.wires.flat()
                .filter(nodeId=>!visited.has(nodeId))
                .filter((nodeId,idx,arr)=>arr.indexOf(nodeId)==idx)
                .forEach(nodeId=>{
                    visited.add(nodeId);
                    queue.push(nodeId);
                })
        }

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
            if(req.body.lifecycle){
                NODE.loggingEditor&&debugLog(`[${req.body.lifecycle}] : ${JSON.stringify(req.body)}`);
                NODE.loggingConsole&&console.log(`SmartThings Automation[${req.body.lifecycle}] : ${JSON.stringify(req.body)}`)
            }

            switch(req.body.lifecycle){
                case "PING":
                    var reqBody = req.body;
                    if (!reqBody.pingData) {
                        var msg = "Required parameter doesn't exist";
                        NODE.loggingEditor&&debugLog("[error] " + msg);
                        RES.error(res, 400, msg);
                        return;
                    }else{
                        RES.ok(res, {statusCode: 200, pingData: {challenge: reqBody.pingData.challenge}});
                    }
                    break;

                case "CONFIRMATION":
                    var data = req.body.confirmationData;
                    if( !!data === false || data.hasOwnProperty("confirmationUrl") === false){
                        msg = "cannot find 'confirmationUrl'";
                        NODE.loggingEditor&&debugLog("[error] " + msg);
                        RES.error(res,400, {msg:msg});
                    }

                    SmartThingsAPI.confirmUrl(data.confirmationUrl)
                        .then(response=>{
                            if([200,202].includes(response.statusCode)){
                                RES.ok(res,{targetUrl:data.confirmationUrl});
                            }else{
                                RES.error(res,response.statusCode,'confirm URL faile : ',response.statusMessage);
                            }
                        })
                        .catch(error=>{
                            RES.error(res,500,error)
                        })
                    break;
                case "CONFIGURATION":
                    var reqBody = req.body;
                    if (!reqBody.configurationData) {
                        var msg = "Required parameter doesn't exist";
                        NODE.loggingEditor&&debugLog("[error] " + msg);
                        RES.error(res, 400, msg);
                        return;
                    }

                    var responseConfigData = {};
                    if (reqBody.configurationData.phase == "INITIALIZE") {
                        responseConfigData.initialize = {
                            id: "app_" +NODE.id,
                            name: NODE.name||NODE.alias,
                            description: NODE.name||NODE.alias,
                            firstPageId: "1",
                            permissions: []
                        }
                    } else if (reqBody.configurationData.phase == "PAGE") {
                        if (reqBody.configurationData.pageId !== "1") {
                            RES.error(res, 400, `Unsupported page id: ${reqBody.configurationData.pageId}`);
                            return;
                        }
                        const sections = Object.values(sectionConfig);
                        responseConfigData.page = {
                            pageId: '1',
                            name: NODE.name||NODE.alias,
                            nextPageId: null,
                            previousPageId: null,
                            complete: true,
                            sections: sections
                        };
                    } else {
                        RES.error(res, 400, `Unsupported phase: ${reqBody.configurationData.phase}`);
                        return;
                    }
                    RES.ok(res, {statusCode: 200, configurationData: responseConfigData});
                    break;
                case "INSTALL":
                    var reqBody = req.body;
                    var installedAppId = reqBody.installData.installedApp.installedAppId;
                    var authToken = reqBody.installData.authToken;

                    NODE.loggingConsole&&console.log('subscription devices : '+eventDevices);

                    eventDevices.forEach((eventDevice)=>{
                        eventDevice.capabilityId = eventDevice.capabilityId.split('_v')[0]
                        var installedConfig = reqBody.installData.installedApp.config[eventDevice.sectionId][0]
                        var subscriptionBody = {
                            sourceType: 'DEVICE',
                            device: {
                                deviceId: installedConfig.deviceConfig.deviceId,
                                componentId: installedConfig.deviceConfig.componentId,
                                capability: eventDevice.capabilityId,
                                attribute: eventDevice.attributeId,
                                stateChangeOnly: true,
                                subscriptionName: (eventDevice.name+'_'+eventDevice.capabilityId+'_'+eventDevice.attributeId+'_SUBS').slice(0,32),
                                value: "*"
                            }
                        }
                        NODE.loggingConsole&&console.log('[ST_AUTOMATION] INSTALL_createSubscription:',JSON.stringify(subscriptionBody))

                        const keyParam = {installedAppId:installedAppId};
                        OneApi.executeCreateSubscription(keyParam, subscriptionBody, authToken)
                            .then(function (data) {
                                NODE.loggingEditor&&debugLog("Create Subscription : " + JSON.stringify(data))
                                NODE.loggingConsole&&console.log("Create Subscription : " + JSON.stringify(data))
                            }).catch(function (err) {
                                NODE.loggingEditor&&debugLog("[error] " + err.errCd + ", " + err.errMsg)
                                NODE.loggingConsole&&console.log("[error] " + err.errCd + ", " + err.errMsg)
                            })
                    })
                    RES.ok(res, {statusCode: 200, installData: {}})
                    break;

                case "UPDATE":
                    var reqBody = req.body;
                    var installedAppId = reqBody.updateData.installedApp.installedAppId;
                    var authToken = reqBody.updateData.authToken;

                    const keyParam = {installedAppId:installedAppId};

                    OneApi.executeDeleteSubscription(keyParam, authToken).then(function (data) {
                        eventDevices.forEach(function(eventDevice){
                            eventDevice.capabilityId = eventDevice.capabilityId.split('_v')[0]
                            var installedConfig = reqBody.updateData.installedApp.config[eventDevice.sectionId][0]
                            var subRequest = {
                                sourceType: 'DEVICE',
                                device: {
                                    deviceId: installedConfig.deviceConfig.deviceId,
                                    componentId: installedConfig.deviceConfig.componentId,
                                    capability: eventDevice.capabilityId,
                                    attribute: eventDevice.attributeId,
                                    stateChangeOnly: true,
                                    subscriptionName: (eventDevice.name+'_'+eventDevice.capabilityId+'_'+eventDevice.attributeId+'_SUBS').slice(0,32),
                                    value: "*"
                                }
                            }
                            NODE.loggingConsole&&console.log('[ST_AUTOMATION] UPDATE_createSubscription:',JSON.stringify(subscriptionBody))

                            const keyParam = {installedAppId:installedAppId};
                            OneApi.executeCreateSubscription(keyParam, subRequest, authToken).then(function (data) {
                                NODE.loggingEditor&&debugLog("Update Subscription : " + JSON.stringify(data))
                                NODE.loggingConsole&&console.log("Update Subscription : " + JSON.stringify(data))
                            }).catch(function (err) {
                                NODE.loggingEditor&&debugLog("Update Subscription Fail: " + JSON.stringify(data)+" / ("+err.errCd +")"+err.errMsg)
                                NODE.loggingConsole&&console.log("Install errorCode : " + err.errCd + " message : " + err.errMsg);
                            })
                        })
                    }).catch(function (err) {
                        NODE.loggingEditor&&debugLog("Delete Subscription : " + installedAppId +" / ("+err.errCd +")"+err.errMsg)
                        NODE.loggingConsole&&console.dir(err)
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
                    NODE.loggingEditor&&debugLog("[error] " + msg);
                    RES.error(res, 400, msg);
                    break;
            }
        };

        function x509headerParse(headerStr){
            var result = {};

            ['keyId','signature','headers','algorithm'].forEach(k=>{
                if(headerStr.indexOf(k+'=')>-1){
                    var v = headerStr.substr(headerStr.indexOf(k+'=')+k.length+2);
                    v=v.substr(0,v.indexOf('"'));
                    result[k]=v;
                }
            })
            return result;
        }

        var httpMiddleware = function (req, res, next) {
            // console.log('===========Automation Request header / body ==========')
            // console.dir(req.headers,{depth:null})
            // console.dir(req.body,{depth:null})

            var authHeader = x509headerParse(req.headers.authorization);
            if(['PING','CONFIRMATION'].includes(req.body.lifecycle)){
                next()
            }else{
                SmartThingsAPI.keyValidate(authHeader.keyId)
                    .then(response=>{
                        if([200,202].includes(response.statusCode)){
                            next()
                        }else{
                            RES.error(res, response.statusCode, response.statusMessage);
                        }
                    })
                    .catch(e=>{
                        var msg = "Invalid keyId, internal server error";
                        NODE.loggingEditor&&debugLog("[error] " + msg + e + e.msg);
                        RES.error(res, 500, msg);
                    })
            }
        };
        function debugLog(log) {
            try {
                RED.comms.publish("debug", {id: NODE.id, z: NODE.z, name: NODE.name||NODE.alias, topic: "Automation", msg: log});
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
        let pat = null;
        if(RED.nodes.getCredentials(n.id)&&RED.nodes.getCredentials(n.id).stAccessToken){
            pat = RED.nodes.getCredentials(n.id).stAccessToken;
        }
        SmartThingsProfile.addpat(n.id,pat);

        RED.nodes.createNode(this, n);
        Object.assign(this,n)
        stCompatibleCheck(this)

        this.on('close', function(removed, done) {
            const pat = (RED.nodes.getCredentials(this.id))?RED.nodes.getCredentials(this.id).stAccessToken:null;
            SmartThingsProfile.addpat(this.id,pat);
            done();
        });
    }
    RED.nodes.registerType(ST_DEVICE_PROFILE, DeviceConfigNode,{credentials:{
            stAccessToken:{type:'text'}
        }});

    function installedDeviceConfigNode(n) {
        let pat = null;
        if(RED.nodes.getCredentials(n.id)&&RED.nodes.getCredentials(n.id).stAccessToken){
            pat = RED.nodes.getCredentials(n.id).stAccessToken
        }
        SmartThingsProfile.addpat(n.id,pat);

        RED.nodes.createNode(this, n);
        Object.assign(this,n);
        stCompatibleCheck(this);

        this.on('close', function(removed, done) {
            const pat = (RED.nodes.getCredentials(this.id))?RED.nodes.getCredentials(this.id).stAccessToken:null;
            SmartThingsProfile.addpat(this.id,pat);

            /*if (removed) {
                SmartThingsProfile.addpat(this.id,null);
            }*/
            done();
        });
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
            RED.comms.publish("debug", {topic:'debug',id:NODE.id,msg: message});
        }

        this.on('input', function (msg) {
            var onward = [];
            try {
                const automationEvent = NODE.context().flow.get('evt');

                var deviceConfig = ""
                var authToken = "";
                var param = {deviceId:""};

                if (RED.nodes.getNode(NODE.deviceNodeId).type == ST_MY_DEVICE){
                    authToken = RED.nodes.getCredentials(NODE.deviceNodeId).stAccessToken;
                    param.deviceId = NODE.deviceId || RED.nodes.getNode(NODE.deviceNodeId).device.deviceId
                }else{
                    deviceConfig = automationEvent.eventData.installedApp.config[NODE.deviceNodeId][0].deviceConfig;//현재는 section 당 한개의 기기만으로 제한되어있음.[0]처리
                    authToken = automationEvent.eventData.authToken;
                    param.deviceId = deviceConfig.deviceId;
                }

                if (NODE.type == ST_EVENT_DEVICE) {
                    var resultMsg=[];
                    NODE.loggingEditor&&NODE.warn("[SmartThings] Event:" + NODE.name||NODE.alias||NODE.type);

                    automationEvent.eventData.events.forEach(function(event){
                        var deviceEvent = event.deviceEvent;
                        if(deviceEvent && deviceEvent.deviceId == deviceConfig.deviceId && deviceEvent.componentId == deviceConfig.componentId ){
                            resultMsg=[];
                            NODE.rules.forEach(function(rule){
                                var opCheck = false;
                                rule.capaId=rule.capaId.split('_v')[0];
                                if(deviceEvent.capability == rule.capaId && deviceEvent.attribute == rule.attrId){
                                    let ruleValue = rule.value;
                                    if(rule.argType==='jsonata'){
                                        ruleValue = RED.util.evaluateJSONataExpression(ruleValue,msg);
                                    }else{
                                        ruleValue = RED.util.evaluateNodeProperty(ruleValue,rule.argType,NODE,msg);
                                    }
                                    opCheck=operators[rule.operator](ruleValue, deviceEvent.value);
                                }

                                if (opCheck) {
                                    RED.util.setMessageProperty(msg, 'payload', deviceEvent);
                                    resultMsg.push(msg);
                                } else {
                                    resultMsg.push(null);
                                }
                            })
                        }
                    })
                    if (NODE.rules.length == 0) {
                        RED.util.setMessageProperty(msg, 'payload', automationEvent.eventData.events);
                        resultMsg.push(msg);
                    }
                    NODE.send(resultMsg);
                } else if (NODE.type == ST_STATUS_DEVICE) {
                    OneApi.getDeviceStates(param, authToken, NODE.logging).then(function (data) {
                        NODE.loggingEditor&&NODE.warn("[SmartThings] Status :" + NODE.name||NODE.alias||NODE.type);
                        var deviceStatus = data;
                        var opCheck = false;
                        NODE.capabilityId = NODE.capabilityId.split('_v')[0]
                        NODE.rules.forEach((rule,idx)=>{
                            var attributeValue = deviceStatus.components[deviceConfig.componentId||'main'][NODE.capabilityId][NODE.attributeId].value;

                            let ruleValue = rule.value;

                            if(rule.valueType=='object'){
								ruleValue={};
                            	for(let k in rule.value){
                            		const data = rule.value[k];
									ruleValue[k] = RED.util.evaluateNodeProperty(data.value,rule.type,NODE,msg);
								}
							}else{
								if(rule.argType==='jsonata'){
									ruleValue = RED.util.evaluateJSONataExpression(ruleValue,msg);
								}else{
									ruleValue = RED.util.evaluateNodeProperty(ruleValue,rule.argType,NODE,msg);
								}
							}

                            if (ruleValue == '' || ruleValue == undefined){
                                ruleValue = "\'\'";
                            }
                            if(rule.valueType == 'Iso8601Date'){
                                opCheck = operators[rule.operator](new Date(ruleValue), new Date(attributeValue));
                            }else{
                                opCheck = operators[rule.operator](ruleValue, attributeValue);
                            }
                            if (opCheck) {
                                // sendDebug(NODE.attributeId+"=\""+attributeValue+"\", ("+idx+")port success")
                                RED.util.setMessageProperty(msg, 'payload', attributeValue);
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
                        NODE.loggingEditor&&console.error(err);
                        NODE.loggingConsole&&NODE.error("[error] " + err.errCd + ", " + err.errMsg);
                    });
                } else {
                    NODE.loggingEditor&&NODE.warn("[SmartThings] Action:" + NODE.name||NODE.alias||NODE.type);

                    var commandArr = [];
                    var componentId = (deviceConfig && deviceConfig.componentId) ? deviceConfig.componentId : 'main';
                    for(var rule of NODE.rules){
                        rule.capaId=rule.capaId.split('_v')[0];
                        var cmd = {component: componentId || "main", capability: rule.capaId, command: rule.attrId};
                        cmd.arguments = [];

                        var argObj={};

                        rule.args.forEach(arg=>{
                            var argValue=arg.value;

                            if(arg.argType=='jsonata'){
                                argValue = RED.util.evaluateJSONataExpression(argValue,msg);
                            }else{
                                argValue = RED.util.evaluateNodeProperty(argValue,arg.argType,NODE,msg);
                            }
                            if(arg.type != 'object'||arg.argType=='json'){
                                arg.type = arg.type || '';
                                if(arg.type.toLowerCase().indexOf('integer')>-1||arg.type.toLowerCase().indexOf('number')>-1) {
                                    cmd.arguments.push(Number(argValue));
                                }else if(arg.type === 'json'){
                                    cmd.arguments.push(JSON.parse(argValue));
                                }else{
                                    cmd.arguments.push(argValue);
                                }
                            }else{
                                arg.propType=arg.propType || '';
                                if(arg.propType.toLowerCase().indexOf('integer')>-1||arg.propType.toLowerCase().indexOf('number')>-1) {
                                    argValue = Number(argValue);
                                }else{
                                    argValue = argValue;
                                }
                                argObj[arg.propId]=argValue;
                            }
                        })
                        if(Object.keys(argObj).length>0){
                            cmd.arguments.push(argObj);
                        }
                        commandArr.push(cmd);
                    }
                    if (commandArr.length > 0) {
                        OneApi.executeDeviceCommands(param, {commands: commandArr}, authToken, NODE.logging).then(function (data) {
                            RED.util.setMessageProperty(msg, 'payload', commandArr);
                            onward.push(msg);
                            NODE.send(onward);
                        }).catch(function (err) {
                            NODE.loggingConsole&&console.error(err);
                            NODE.loggingEditor&&NODE.error("[error] " + err.errCd + ", " + err.errMsg);
                        })
                    }else {
                        RED.util.setMessageProperty(msg, 'payload', "command is empty");
                        onward.push(msg);
                        NODE.send(onward);
                    }
                }
            } catch (err) {
                var msg='Invalid property or argument value, '+err.message
                NODE.error(msg);
            }
        });
    }

    RED.nodes.registerType(ST_EVENT_DEVICE, ThingNode);
    RED.nodes.registerType(ST_STATUS_DEVICE, ThingNode);
    RED.nodes.registerType(ST_COMMAND_DEVICE, ThingNode);
    function stCompatibleCheck(node){
        if(ST_NODES.includes(node.type) && node.capabilityId && node.capabilityId.indexOf('_v')===-1){
            node.capabilityId+='_v1'
        }
        if(ST_NODES.includes(node.type) && (node.capability || (node.device && typeof node.device.capabilities == 'object'))) {
            switch (node.type) {
                case ST_DEVICE_PROFILE:
                    node.capabilityId = node.capability
                    node.profileId = node.id

                    delete node.capability
                    delete node.device
                    break;
                case ST_MY_DEVICE:
                    if(node.device && node.device.components){
                        var capas = []
                        node.device.components.forEach(component=>{
                            component.capabilities.forEach(capability=>{
                                capas.push(capability.id+'_v'+capability.version)
                            })
                        })
                        node.device.capabilities = capas
                    }
                    node.profileId = node.id
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