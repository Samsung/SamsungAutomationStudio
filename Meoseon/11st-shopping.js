module.exports = function (RED) {
  "use strict";
  var axios = require("axios");
  var iconv = require("iconv-lite");
  var convert = require("xml-js");
  function sk11stShopping(config) {
    RED.nodes.createNode(this, config);
    if (RED.nodes.getNode(config.creds)) {
      this.apikey = RED.nodes.getNode(config.creds).credentials.apikey;
    } else {
      this.apikey = "";
    }
    var node = this;
    node.name = config.name;
    node.params = {};
    node.params["key"] = node.apikey;
    node.params["apiCode"] = config.apiCode;
    if (config.apiCode === "ProductInfo" || config.apiCode === "ProductImage") {
      node.params["productCode"] = config.productCode;
      if (config.apiCode === "ProductInfo")
        node.params["option"] = config.option;
    } else {
      node.params["pageNum"] = config.pagenum;
      node.params["pageSize"] = config.pagesize;
      node.params["sortCd"] = config.sortcd;
      node.params["option"] = config.option;
      if (config.apiCode === "ProductSearch") {
        node.params["keyword"] = config.keyword;
        node.params["tagetSearchPrd"] = config.tagetSearchPrd;
      } else node.params["categoryCode"] = config.categoryCode;
    }

    this.on("input", function (msg) {
      axios
        .get("http://openapi.11st.co.kr/openapi/OpenApiService.tmall", {
          params: node.params,
          responseType: "arraybuffer",
        })
        .then((response) => {
          const decoded = iconv.decode(response.data, "EUC-KR");
          msg.payload = convert.xml2js(decoded, {
            compact: true,
            spaces: 4,
          });
          node.send(msg);
        })
        .catch((error) => {
          msg.payload = error.message;
          node.send(msg);
        });
    });
  }
  RED.nodes.registerType("sk11st-shopping", sk11stShopping, {
    credentials: {
      apikey: { type: "text" },
    },
  });
  function sk11stCredentialNode(n) {
    RED.nodes.createNode(this, n);
    this.apikey = n.apikey;
  }
  RED.nodes.registerType("sk11st-credential", sk11stCredentialNode, {
    credentials: {
      apikey: { type: "text" },
    },
  });
};
