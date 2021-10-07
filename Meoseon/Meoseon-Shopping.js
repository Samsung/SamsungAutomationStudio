module.exports = function (RED) {
    const axios = require("axios")
    const iconv = require("iconv-lite");
    const convert = require("xml-js");
    
    const NAVER_API_URL_XML = "https://openapi.naver.com/v1/search/shop.xml";
    const NAVER_API_URL_JSON = "https://openapi.naver.com/v1/search/shop.json";
    const SK11ST_API_URL = "http://openapi.11st.co.kr/openapi/OpenApiService.tmall";

    "use strict";
    const mustache = require("mustache");
    
    function NodeContext(msg, nodeContext, parent) {
		this.msgContext = new mustache.Context(msg,parent);
		this.nodeContext = nodeContext;
	}
    
    NodeContext.prototype = new mustache.Context();

	NodeContext.prototype.lookup = function (name) {
		// try message first:
		try {
			const value = this.msgContext.lookup(name);
			if (value !== undefined) {
				return value;
			}

			// try node context:
			const dot = name.indexOf(".");
			if (dot > 0) {
				const contextName = name.substr(0, dot);
				const variableName = name.substr(dot + 1);

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

    function shoppingNode(n) {
        RED.nodes.createNode(this, n);

        // naver shopping
        if (RED.nodes.getNode(n.naverShoppingCreds)){
            this.naverShoppingClientId = RED.nodes.getNode(n.naverShoppingCreds).credentials.clientId;
            this.naverShoppingClientSecret = RED.nodes.getNode(n.naverShoppingCreds).credentials.clientSecret;
        } else {
            this.naverShoppingClientId = "";
            this.naverShoppingClientSecret = "";
        }

        // sk11st
        if (RED.nodes.getNode(n.sk11stCreds)) {
            this.sk11stApikey = RED.nodes.getNode(n.sk11stCreds).credentials.apikey;
        } else {
            this.sk11stApikey = "";
        }

        const node = this;
        node.name = n.name;

        for (const key in n) {
            node[key] = n[key] || "";
        }

        this.on("input", function (msg) {
            for (const msgKey in msg) {
                if (
                    msgKey !== "req" ||
                    msgKey !== "res" ||
                    msgKey !== "payload" ||
                    msgKey !== "send" ||
                    msgKey !== "_msgid"
                ) {
                    node[msgKey] = msg[msgKey] || node[msgKey];
                }
            }
            
            if (n.apiType == "naverShopping") {
                const query = mustache.render(n.naverShoppingQuery, new NodeContext(msg, node.context())).split(",");
                node.url = n.naverShoppingReturnType == "json" ? NAVER_API_URL_JSON : NAVER_API_URL_XML;
                node.options = {};
                node.options.headers = {};
                
                if(node.params){
                    node.options.params = node.naverShoppingParams;
                }else{
                    node.options.params = {};
                    node.options.params.display = mustache.render(n.naverShoppingDisplay, new NodeContext(msg, node.context()));
                    node.options.params.start = mustache.render(n.naverShoppingStart, new NodeContext(msg, node.context()));
                    node.options.params.sort = n.naverShoppingSort;
                    node.options.params.filter = mustache.render(n.naverShoppingFilter, new NodeContext(msg, node.context()));
                }
                node.options.headers['X-Naver-Client-Id'] = node.naverShoppingClientId;
                node.options.headers['X-Naver-Client-Secret'] = node.naverShoppingClientSecret;
    
                for (const idx in query) {
                    node.options.params.query = query[idx];
    
                    axios.get(node.url, node.options)
                        .then(function (response) {
                            node.status({ fill: "green", shape: "dot", text: "success" });
                            node.log("naver shopping query success", msg);
    
                            if (node.options.params.filter != "") {
                                const items = response.data.items;
                                response.data.items = [];
    
                                for (const idx in items) {
                                    if (items[idx].mallName.indexOf(node.options.params.filter) !== -1) {
                                        response.data.items.push(items[idx]);
                                    }
                                }
                            }
    
                            msg.payload = response.data;
                            node.send(msg);
                        }).catch(function (error){
                            node.status({ fill: "red", shape: "dot", text: "error" });
                            node.error("naver shopping query failed", msg);
    
                            msg.payload = error;
                            node.send(msg);
                        });
                }
            } else if (n.apiType == "sk11st") {
                node.params = {};
                node.params["key"] = node.sk11stApikey;
                node.params["apiCode"] = n.sk11stApiCode;
		let keywords = undefined;
                if (n.sk11stApiCode === "ProductInfo" || n.sk11stApiCode === "ProductImage") {
                    node.params["productCode"] = mustache.render(n.sk11stProductCode, new NodeContext(msg, node.context()));
                    if (n.sk11stApiCode === "ProductInfo") {
                        node.params["option"] = mustache.render(n.sk11stOption, new NodeContext(msg, node.context()));
                    }
                } else {
                    node.params["pageNum"] = mustache.render(n.sk11stPagenum, new NodeContext(msg, node.context()));
                    node.params["pageSize"] = mustache.render(n.sk11stPagesize, new NodeContext(msg, node.context()));
                    node.params["sortCd"] = mustache.render(n.sk11stSortcd, new NodeContext(msg, node.context()));
                    node.params["option"] = mustache.render(n.sk11stOption, new NodeContext(msg, node.context()));
                    if (n.sk11stApiCode === "ProductSearch") {
                        keywords = mustache.render(n.sk11stKeyword, new NodeContext(msg, node.context())).split(",");
                        node.params["targetSearchPrd"] = mustache.render(n.sk11stTargetSearchPrd, new NodeContext(msg, node.context()));
                    } else {
                        node.params["categoryCode"] = mustache.render(n.sk11stCategoryCode, new NodeContext(msg, node.context()));
                    }
                }
		if (n.sk11stApiCode === "ProductSearch") {
			for (const idx in keywords) {
			    node.params["keyword"] = keywords[idx];
			    axios
			      .get(SK11ST_API_URL, {
				params: node.params,
				responseType: "arraybuffer",
			      })
			      .then((response) => {
				node.status({ fill: "green", shape: "dot", text: "success" });
				node.log("sk11st shopping query success", msg);
				const decoded = iconv.decode(response.data, "EUC-KR");
				msg.payload = convert.xml2js(decoded, {
				  compact: true,
				  spaces: 4,
				});
				node.send(msg);
			      })
			      .catch((error) => {
				node.status({ fill: "red", shape: "dot", text: "error" });
				node.error("sk11st shopping query failed", msg);
				msg.payload = error.message;
				node.send(msg);
			      });
			}
		} else {
			axios
			    .get(SK11ST_API_URL, {
			      params: node.params,
			      responseType: "arraybuffer",
			    })
			    .then((response) => {
			      node.status({ fill: "green", shape: "dot", text: "success" });
			      node.log("sk11st shopping query success", msg);
			      const decoded = iconv.decode(response.data, "EUC-KR");
			      msg.payload = convert.xml2js(decoded, {
				compact: true,
				spaces: 4,
			      });
			      node.send(msg);
			    })
			    .catch((error) => {
			      node.status({ fill: "red", shape: "dot", text: "error" });
			      node.error("sk11st shopping query failed", msg);
			      msg.payload = error.message;
			      node.send(msg);
			    });
		}
            }
        });
    }

    RED.nodes.registerType("shopping", shoppingNode, {
        credentials: {
            clientId: {type:"text"},
            clientSecret: {type:"text"}
        }
    });

    // naver shopping API key
    function naverShoppingApiKey(n){
        RED.nodes.createNode(this, n);
        this.clientId = n.clientId;
        this.clientSecret = n.clientSecret;
    }

    RED.nodes.registerType("naverShoppingApiKey", naverShoppingApiKey,{
        credentials: {
            clientId: {type:"text"},
            clientSecret: {type:"text"}
        }
    });

    // sk11st API key
    function sk11stApiKey(n) {
        RED.nodes.createNode(this, n);
        this.apikey = n.apikey;
    }

    RED.nodes.registerType("sk11stApiKey", sk11stApiKey, {
        credentials: {
            apikey: { type: "text" },
        },
    });
};
