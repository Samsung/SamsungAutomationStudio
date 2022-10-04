module.exports = function (RED) {
    "use strict";
    var spawn = require("child_process").spawn;

    function Iotcam2imgNode(config) {
        RED.nodes.createNode(this, config);
        var node = this;

        var cleanup = function (p) {
            node.activeProcesses[p].kill();
        };

        this.on("input", function (msg, nodeSend, nodeDone) {
            if (msg.hasOwnProperty("kill")) {
                if (
                    typeof msg.kill !== "string" ||
                    msg.kill.length === 0 ||
                    !msg.kill.toUpperCase().startsWith("SIG")
                ) {
                    msg.kill = "SIGTERM";
                }
                if (msg.hasOwnProperty("pid")) {
                    if (node.activeProcesses.hasOwnProperty(msg.pid)) {
                        node.activeProcesses[msg.pid].kill(
                            msg.kill.toUpperCase()
                        );
                        node.status({
                            fill: "red",
                            shape: "dot",
                            text: "killed",
                        });
                    }
                } else {
                    if (Object.keys(node.activeProcesses).length === 1) {
                        node.activeProcesses[
                            Object.keys(node.activeProcesses)[0]
                        ].kill(msg.kill.toUpperCase());
                        node.status({
                            fill: "red",
                            shape: "dot",
                            text: "killed",
                        });
                    }
                }
                nodeDone();
            } else {
                const MNID = this.credentials.smartthingsMnid;
                const PAT = this.credentials.smartthingsPat;
                const rtspURL = msg.rtspURL || config.rtspURL;
                const saveURL = config.saveURL;
                const totalFrame = config.totalFrame;
                const fps = config.timer
                    ? totalFrame / (config.timer * 0.7)
                    : 5;

                const cmd = "ffmpeg";
                const arg = `-thread_queue_size 512 -i ${
                    rtspURL.split("//")[0]
                }//${MNID}:${PAT}@${
                    rtspURL.split("//")[1]
                } -r ${fps} ${saveURL}%d.png`;
                this.timer = Number(config.timer || 0) * 1000 || 0;
                this.activeProcesses = {};
                this.oldrc = false.toString();
                this.spawnOpt = { windowsHide: true };

                var flowContext = this.context().flow;
                flowContext.set("totalFrame", totalFrame);
                flowContext.set("landmarks", []);

                var child;
                /* istanbul ignore else  */
                node.debug(cmd + " [" + arg + "]");
                child = spawn(cmd, arg.split(" "), node.spawnOpt);
                node.status({
                    fill: "blue",
                    shape: "dot",
                    text: "pid:" + child.pid,
                });
                var unknownCommand = child.pid === undefined;
                if (node.timer !== 0) {
                    child.tout = setTimeout(function () {
                        cleanup(child.pid);
                    }, node.timer);
                }
                node.activeProcesses[child.pid] = child;
                child.stdout.on("data", function (data) {
                    if (
                        node.activeProcesses.hasOwnProperty(child.pid) &&
                        node.activeProcesses[child.pid] !== null
                    ) {
                        msg.payload = data;
                        nodeSend([RED.util.cloneMessage(msg), null, null]);
                    }
                });
                child.stderr.on("data", function (data) {
                    if (
                        node.activeProcesses.hasOwnProperty(child.pid) &&
                        node.activeProcesses[child.pid] !== null
                    ) {
                        msg.payload = Buffer.from(data);
                        nodeSend([null, RED.util.cloneMessage(msg), null]);
                    }
                });
                child.on("close", function (code, signal) {
                    if (
                        unknownCommand ||
                        (node.activeProcesses.hasOwnProperty(child.pid) &&
                            node.activeProcesses[child.pid] !== null)
                    ) {
                        delete node.activeProcesses[child.pid];
                        if (child.tout) {
                            clearTimeout(child.tout);
                        }
                        msg.payload = code;
                        if (node.oldrc === "false") {
                            msg.payload = { code: code };
                            if (signal) {
                                msg.payload.signal = signal;
                            }
                        }
                        if (code === 0) {
                            node.status({});
                        }
                        if (code === null) {
                            node.status({
                                fill: "red",
                                shape: "dot",
                                text: "killed",
                            });
                        } else if (code < 0) {
                            node.status({
                                fill: "red",
                                shape: "dot",
                                text: "rc:" + code,
                            });
                        } else {
                            node.status({
                                fill: "yellow",
                                shape: "dot",
                                text: "rc:" + code,
                            });
                        }
                        nodeSend([null, null, RED.util.cloneMessage(msg)]);
                    }
                    nodeDone();
                });
                child.on("error", function (code) {
                    if (child.tout) {
                        clearTimeout(child.tout);
                    }
                    delete node.activeProcesses[child.pid];
                    if (
                        node.activeProcesses.hasOwnProperty(child.pid) &&
                        node.activeProcesses[child.pid] !== null
                    ) {
                        node.error(code, RED.util.cloneMessage(msg));
                    }
                });
            }
        });

        this.on("close", function () {
            for (var pid in node.activeProcesses) {
                /* istanbul ignore else  */
                if (node.activeProcesses.hasOwnProperty(pid)) {
                    if (node.activeProcesses[pid].tout) {
                        clearTimeout(node.activeProcesses[pid].tout);
                    }
                    // console.log("KILLING",pid);
                    var process = node.activeProcesses[pid];
                    node.activeProcesses[pid] = null;
                    process.kill();
                }
            }
            node.activeProcesses = {};
            node.status({});
        });
    }

    RED.nodes.registerType("iotcam2img", Iotcam2imgNode, {
        credentials: {
            smartthingsMnid: { value: "" },
            smartthingsPat: { value: "" },
        },
    });
};
