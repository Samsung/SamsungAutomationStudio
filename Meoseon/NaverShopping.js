const axios = require("axios")

module.exports = function (RED) {
  const NAVER_API_URL_XML = "https://openapi.naver.com/v1/search/shop.xml";
  const NAVER_API_URL_JSON = "https://openapi.naver.com/v1/search/shop.json";
  
  function naverShoppingNode(n) {
    RED.nodes.createNode(this, n);
    if (RED.nodes.getNode(n.creds)){
      this.clientId = RED.nodes.getNode(n.creds).credentials.clientId;
      this.clientSecret = RED.nodes.getNode(n.creds).credentials.clientSecret;
    } else {
      this.clientId = "";
      this.clientSecret = "";
    }
    const node = this;
    this.name = n.name;
    
    this.on("input", function (msg) {
      const query = n.query.split(",");
      node.url = n.returnType == "json" ? NAVER_API_URL_JSON : NAVER_API_URL_XML;
      node.options = {};
      node.options.headers = {};
      
      if(node.params){
        node.options.params = node.params;
      }else{
        node.options.params = {};
        node.options.params.display = n.display;
        node.options.params.start = n.start;
        node.options.params.sort = n.sort;
        node.options.params.filter = n.filter;
      }
      node.options.headers['X-Naver-Client-Id'] = node.clientId;
      node.options.headers['X-Naver-Client-Secret'] = node.clientSecret;
      
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
          node.error("naver shopping query failed: " + response.data.toString(), msg);
          
          msg.payload = error;
          node.send(msg);
        });
      }
    });
  }
  
  RED.nodes.registerType("naver-shopping", naverShoppingNode, {
    credentials: {
      clientId: {type:"text"},
      clientSecret: {type:"text"}
    }
  });
  
  function naverShoppingApiKey(n){
    RED.nodes.createNode(this, n);
    this.clientId = n.clientId;
    this.clientSecret = n.clientSecret;
  }
  
  RED.nodes.registerType("naver-shopping-api-key", naverShoppingApiKey,{
    credentials: {
      clientId: {type:"text"},
      clientSecret: {type:"text"}
    }
  });
};