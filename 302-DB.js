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

	function DatabaseConfig(n) {
		RED.nodes.createNode(this,n);
		this.dbType = n.dbType;
		this.dbIp = n.dbIp;
		this.dbPort = n.dbPort;
		this.dbName = n.dbName;
		// this.userId = n.userId;
		// this.userPwd = n.userPwd;
		this.proxyRequired = n.proxyRequired;
		this.proxy = n.proxy;		
	}

	function DatabaseQueryNode(n) {
		RED.nodes.createNode(this,n);
		var node = this;
		node.sql = n.sql;
		node.configId = n.config;
		RED.nodes.eachNode(function (nn) {
			if(node.configId==nn.id) {
				node.config = nn;
                node.config.credentials = RED.nodes.getCredentials(nn.id)
            }
		});
		if(!node.config) {
			node.error("failed: Invalid DB credentials");
			return;
		}
		if (node.config.proxyRequired){
			// set proxy		
		}
		node.on("input", function(msg) {
			try {
				// Connection, Run Query, callback
				node.query = mustache.render(node.sql, new NodeContext(msg, node.context()));
				console.log(node.config.dbType);
				console.log(node.sql);
				if (node.config.dbType == "mysql" || node.config.dbType == "mariadb") {
					var mysql = require('mysql');
					var connection = mysql.createConnection({
						database: node.config.dbName,
						host: node.config.dbIp,
						port: node.config.dbPort,
						user: node.config.credentials.userId,
						password: node.config.credentials.userPwd
					});
					connection.connect();
					connection.query(node.query, function (error, results, fields) {
						if (error) {
							console.error(error);
							node.status({ fill: "red", shape: "dot", text: "error" });
							node.error("failed: " + error.toString(), msg);
						}
						msg.payload = results;
						node.status({});
						node.send(msg);
					});
					connection.end();
				}else if (node.config.dbType == "postgres") {
					var {Pool, Client} = require('pg');
					var client = new Client({
						database: node.config.dbName,
						host: node.config.dbIp,
						port: node.config.dbPort,
						user: node.config.credentials.userId,
						password: node.config.credentials.userPwd
					})
					client.connect()
					client.query(node.query,function (error, results, fields) {
						if (error) {
							console.error(error);
							node.status({ fill: "red", shape: "dot", text: "error" });
							node.error("failed: " + error.toString(), msg);
						}
						msg.payload = results;
						node.status({});
						node.send(msg);
						client.end()
					})
				}else if (node.config.dbType == "oracle") {
					var oracledb = require('oracledb');
					var config = {
						user: node.config.credentials.userId,
						password: node.config.credentials.userPwd,
						connectString: node.config.dbIp+":"+node.config.dbPort+"/"+node.config.dbName
					}
					oracledb.getConnection(config, (err, conn) =>{
						if (err) {
							console.error(err);
							node.status({ fill: "red", shape: "dot", text: "error" });
							node.error("failed: " + err.toString(), msg);
							return;
						}
						conn.execute(node.sql, [], function (err, result) {
							if (err) {
								console.error(err);
								node.status({ fill: "red", shape: "dot", text: "error" });
								node.error("failed: " + err.toString(), msg);
								conn.release();
								return;
							}
							msg.payload = result;
							node.status({});
							node.send(msg);
							conn.release();
						});
					});
				}else if (node.config.dbType == "mssql") {
					var mssql = require('mssql');
					var config = {
						user: node.config.credentials.userId,
						password: node.config.credentials.userPwd,
						server: node.config.dbIp,
						port: node.config.dbPort,
						database: node.config.dbName,
						stream: true
					};
					mssql.connect(config, function(err) {
						var request = new mssql.Request();
						request.stream = true;
						request.query(node.query);
						request.on('row', function(row) {
							console.error(err);
							node.status({ fill: "red", shape: "dot", text: "error" });
							node.error("failed: " + err.toString(), msg);
						});
						request.on('error', function(err) {
							console.error(err);
							node.status({ fill: "red", shape: "dot", text: "error" });
							node.error("failed: " + err.toString(), msg);
						});
						request.on('done', function(returnValue) {
							msg.payload = returnValue;
							node.status({});
							node.send(msg);
						});
					});
				}
			}
			catch (e) {
				node.status({ fill: "red", shape: "dot", text: "error" });
				node.error(e);
			}
		});
	}
	RED.nodes.registerType("db-config", DatabaseConfig,{
		credentials:{
			userId: {type:"text"},
			userPwd: {type:"password"}
		}
	});
	RED.nodes.registerType("db-query", DatabaseQueryNode);
};
