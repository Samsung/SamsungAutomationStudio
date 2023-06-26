const _axios = require('axios');
const HttpsProxyAgent = require('https-proxy-agent');

const axiosConfig = {};
if (process.env.https_proxy || process.env.http_proxy) {
	axiosConfig.httpsAgent = new HttpsProxyAgent(process.env.https_proxy || process.env.http_proxy);
	axiosConfig.proxy = false;
}
const axios = _axios.create(axiosConfig);
function createRequestOption(_method, _url, _payload, _headers) {
    var req = this;

    var prox;
    if (process.env.http_proxy != null) {
        prox = process.env.http_proxy;
    }
    if (process.env.HTTP_PROXY != null) {
        prox = process.env.HTTP_PROXY;
    }
    if (prox) {
        req.proxy = prox;
    }

    req.method = _method;
    req.url = _url;
    if (_payload) {
        req.body = _payload;
    }
    req.json = true;

    if (_headers) {
        req.headers = _headers;
    }
}

module.exports = function (RED) {

    function Notification(n) {
        RED.nodes.createNode(this, n);
        var node = this;
        node.name = n.name;
        node.notificationtype = n.notificationtype;
        node.datatype = n.datatype;
        node.datavalue = n.datavalue;
        node.on("input",function(msg) {
            let payload = RED.util.evaluateNodeProperty(node.datavalue, node.datatype, this, msg);
            if (payload.hooks == null || payload.hooks.indexOf("slack") < 0) {
                node.status({fill: "red", shape: "dot", text: "error"});
                node.error("Invalid 'hooks'. 'hooks' is required.");
                return;
            }

            return axios
                .post(payload.hooks, payload)
                .then((response) => {
                    node.warn(response.data);
                    return response.data;
                })
                .catch((err) => {
                    node.status({ fill: 'red', shape: 'dot', text: 'error', });
                    node.error(`Slack webhooks failed: ${err.message} ${msg}`);
                });
        });
    }

    RED.nodes.registerType('slack-notification', Notification);
};
