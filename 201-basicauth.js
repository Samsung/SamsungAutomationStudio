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
function verifyBasicAuth({nodeMsg, rawAuthData, getUser, send, realm, req, res}) {
    const decodedAuthString = new Buffer(rawAuthData, "base64").toString();

    const authenticatingUser = decodedAuthString.split(":");
    const username = authenticatingUser[0];
    const password = authenticatingUser[1];

    try {
        const configuredUser = getUser(username);
        if (password === configuredUser.password) {
            handleSuccessfulAuth({
                send,
                nodeMsg,
                realm
            });
        } else {
            handleFailedAuthAttempt({
                send,
                req,
                res,
                errorMsg: `Invalid password for username "${username}"`,
                username,
                realm
            });
        }
    } catch (error) {
        handleFailedAuthAttempt({
            send,
            req,
            res,
            errorMsg: `Invalid username "${username}"`,
            username,
            realm
        });
    }
}

const requestAuth = ({realm, res}) => {
    res.set("WWW-Authenticate", `Basic realm="${realm}"`);
    res.type("text/plain");
    res.status(401).send("401 Unauthorized");
}

const handleSuccessfulAuth = ({send, nodeMsg}) => {
    send(nodeMsg);
}

const handleFailedAuthAttempt = ({send, req, res, errorMsg, username, realm}) => {
    requestAuth({
        res,
        realm
    });

    const ipAddress = req.headers["x-real-ip"];
    const url = req.url || req.originalUrl;

    send({
        payload: errorMsg,
        url,
        username,
        ipAddress,
    });
}

module.exports = function (RED) {
    "use strict";
    function debugLog(log) {
        try {
            console.debug(log);
        } catch (err) {
            console.error(err);
        }
    }

    function BasicAuthNode(config) {
        const node = this;
        RED.nodes.createNode(node, config);

        // Config data
        const realm = config.realm.trim();

        debugLog(node);

        const username = node.credentials.username;
        const password = node.credentials.password;

        // Configured user
        const user = {
            username,
            password
        }

        debugLog(user);

        const getUser = (username) => {
            if (user.username === username) {
                return user;
            } else {
                throw new Error();
            }
        }

        this.on('input', function (nodeMsg, send, done) {
            send = send || function () {
                node.send.apply(node, arguments);
            }
            const req = nodeMsg.req._req || nodeMsg.req;
            const res = nodeMsg.res._res || nodeMsg.res;
            const authHeader = nodeMsg.req.get("Authorization");
            const authHeaderMatches = authHeader ? authHeader.match(/^(\w+) (.*)$/) : [];

            const context = {nodeMsg,getUser,send,realm,req,res,}
            if (authHeader && authHeaderMatches[1] === "Basic") {
                const rawAuthData = authHeaderMatches[2];
                context.rawAuthData = rawAuthData;
                if (rawAuthData) {
                    verifyBasicAuth(context);
                } else {
                    requestAuth(context);
                }
            } else {
                requestAuth(context);
            }
            if (done) {
                done();
            }
        });
    }
    RED.nodes.registerType("basic-auth", BasicAuthNode, {
        credentials: {
            username: {type: "text", required: true},
            password: {type: "password", required: true}
        }
    });
};
