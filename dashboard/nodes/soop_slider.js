module.exports = function(RED) {
    const dashboard = require("../dashboard")(RED);

    function SoopSliderNode(config) {
        // Node-specific code
        RED.nodes.createNode(this, config);
        this.pass = config.pass; // pass input flow or not
        // this.state = [" "," "]; // save node state

        var node = this;

        // node.status({}); // setting status below node at palette

        var group = RED.nodes.getNode(config.group);
        if (!group) { return; }
        var tab = RED.nodes.getNode(group.config.tab);
        if (!tab) { return; }

        var min = Math.min(config.min, config.max);
        var max = Math.max(config.max, config.min);
        var step = Math.abs(config.step) || 1;
        var value = min;

        // send node configuration        
        /* Currently, html<->js communication is used by config
        ** When it need to change by using socket communication
        ** It needs to revise
        */
        var done = dashboard.emitState({
            /** time: timestamp
             *  nodeId: unique id of the node
             *  nodeType: type of the node
             *  node: node object
             *  tab: tab of the node
             *  group: group of the node
             *  size: size of the node [height, width]
             *  name: name of the node
             *  color: color of the node
             *  label: label of the node
             *  tooltip: tooltip of the node
             *  range: range of the slider [min, max, step]
             *  when: option for when to send data at dashboard side (always/release)
             *  invert: Boolean value for whether slider (min, max) is inverted or not
             *  payload: Number value of slider
             */
            time: '',
            nodeId: node.id,
            nodeType: "slider",
            node: node,
            tab: tab,
            group: group,
            size: [(config.height || 1), (config.width || group.config.width || 6)],
            name: config.name,

            color: config.colorPicking,
            label: config.label,
            tooltip: config.tooltip,
            range: [min, max, step],
            when: config.send || "always",
            invert: (parseFloat(config.min) > parseFloat(config.max)) ? true : false,
            payload: Math.max(min, Math.min(max, value)),
        });
        
        // Receive msg from upstream node in a flow
        node.on("input", function(msg) {
            if( node.pass ){ // pass input flow to output
                value = msg.payload;
                /* need some logic to update dashboard ui
                *  ex) dashobard.emit(some data)
                */
                node.send(msg); // send output
            }
        });
        
        // if (node.pass) {
        //     node.status({shape:"dot",fill:"grey",text:msg.payload});
        // }
        // else {
        //     node.state[1] = msg.payload;
        //     node.status({shape:"dot",fill:"grey",text:node.state[1] + " | " + node.state[1]});
        // }

        // close node
        node.on("close", done);
    }
    RED.nodes.registerType("soop_slider", SoopSliderNode);
};
