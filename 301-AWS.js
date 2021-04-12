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
module.exports = function(RED) {
    "use strict";
	var AWS = require("aws-sdk");
	var mustache = require("mustache");

	function NodeContext(msg, nodeContext,parent) {
		this.msgContext = new mustache.Context(msg,parent);
		this.nodeContext = nodeContext;
	}

	NodeContext.prototype = new mustache.Context();

	NodeContext.prototype.lookup = function (name) {
		// try message first:
		try {
			var value = this.msgContext.lookup(name);
			if (value !== undefined) {
				return value;
			}

			// try node context:
			var dot = name.indexOf(".");
			if (dot > 0) {
				var contextName = name.substr(0, dot);
				var variableName = name.substr(dot + 1);

				if (contextName === "flow" && this.nodeContext.flow) {
					return this.nodeContext.flow.get(variableName);
				}
				else if (contextName === "global" && this.nodeContext.global) {
					return this.nodeContext.global.get(variableName);
				}
			}
		}catch(err) {
			throw err;
		}
	}

	NodeContext.prototype.push = function push (view) {
		return new NodeContext(view, this.nodeContext,this.msgContext);
	};

	function AwsConfig(n) {
		RED.nodes.createNode(this,n);
		// this.accessKey = n.accessKey;
		// this.secretKey = n.secretKey;
		this.region = n.region;
		this.name = n.name;
		this.proxyRequired = n.proxyRequired;
		this.proxy = n.proxy;
	}

	function AwsSdkNode(n) {
		RED.nodes.createNode(this,n);
		var node = this;
		node.name = n.name;
		node.classes = n.service;
		node.methods = n.operation;
		node.params = n.params;
		node.configId = n.config;
		RED.nodes.eachNode(function (nn) {
			if(node.configId==nn.id) {
				node.config = nn;
                node.config.credentials = RED.nodes.getCredentials(nn.id)
			}
		});
		if(!node.config) {
			node.error("failed: Invalid AWS credentials");
			return;
		}
		if (node.config.proxyRequired){
			var proxy = require('proxy-agent');
			AWS.config.update({
				httpOptions: { agent: new proxy(node.config.proxy) }
			});
		}
		node.on("input", function(msg) {
			try {
				node.sendMsg = function (err, data) {
					if (err) {
						node.status({fill:"red",shape:"ring",text:"error"});
						node.error("failed: " + err.toString(), msg);
						node.send([null, { err: err }]);
						return;
					} else {
						msg.payload = data;
						node.status({});
					}
					node.send(msg);
				};
				var _cb=function(err, data){
					node.sendMsg(err, data);
				}
				AWS.config.update({
					accessKeyId: node.config.credentials.accessKey,
					secretAccessKey: node.config.credentials.secretKey,
					region: node.config.region
				});
				if (!AWS) {
					node.error("failed: Invalid AWS credentials");
					return;
				}
				var awsService = new AWS[node.classes]({region: node.config.region});
				if (typeof awsService[node.methods] == "function"){
					node.status({fill:"blue",shape:"dot",text:node.methods});

					var paramValue = JSON.parse(mustache.render(node.params, new NodeContext(msg, node.context())));
					var request = awsService[node.methods](paramValue || msg.param, _cb);
				} else {
					node.error("failed: Invalid Operation - " + node.methods);
				}
			}
			catch (e) {
				node.status({ fill: "red", shape: "dot", text: "error" });
				node.error(e);
			}
		});
	}

	RED.nodes.registerType("aws-config", AwsConfig,{
		credentials: {
			accessKey: {type: "text", required: true},
            secretKey: {type: "password", required: true}
		}
	});
	RED.nodes.registerType("aws-sdk", AwsSdkNode);
};
