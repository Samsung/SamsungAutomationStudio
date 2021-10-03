module.exports = function (RED) {
    "use strict";
    const axios = require("axios");
    
    function shipping(config) {
      RED.nodes.createNode(this, config);
      this.ApiKey = RED.nodes.getNode(config.creds).credentials.ApiKey || "";
      
      const node = this;
      node.name = config.name;
      if(config.ship_company.length === 1){
        config.ship_company = '0'+config.ship_company
      }
      
      node.on("input", (msg) => {
        node.requestUrl = `https://info.sweettracker.co.kr/api/v1/trackingInfo?t_key=${node.ApiKey}&t_code=${config.ship_company}&t_invoice=${config.ship_number}`;
        
        axios
          .get(node.requestUrl)
          .then((response) => {
            if (response.data.status === false) {
              node.status({ fill: "red", shape: "dot", text: "error" });
              node.error("this number is fail" + response.data.toString() + node.requestUrl, msg);
            } else {
              node.status({ fill: "green", shape: "dot", text: "success" });
            }
            msg.payload = response.data;
            msg.url = node.requestUrl;
            node.send(msg);
          })
          .catch((error) => {
            node.status({ fill: "red", shape: "dot", text: "error" });
            msg.payload = error;
            msg.url = node.requestUrl;
            node.send(msg);
          });
      });
    }
    
    RED.nodes.registerType("shipping", shipping, {
      credentials: {
        ApiKey: { type: "text" },
      },
    });
    
    function shippingApiKey(n) {
      RED.nodes.createNode(this, n);
      this.ApiKey = n.ApiKey;
    }
    
    RED.nodes.registerType("shippingApiKey", shippingApiKey, {
      credentials: {
        ApiKey: { type: "text" },
      },
    });
  };