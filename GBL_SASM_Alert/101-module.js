const { name } = require("mustache");

module.exports = function (RED) {
  let MappingNodes = {};
  /**
   * Initialize the mapping functionality.
   *
   * This function initializes a mapping feature in a Node-RED flow. It sets up a global MappingNodes object that allows for getting and setting properties within the mapping.
   * If a store object is provided, it is used to initialize MappingNodes. Otherwise, a new MappingNodes object is created in the global context.
   *
   * @param {Object} store - Optional. An object containing initial mapping data.
   */
  function initMapping(store) {
    // If initMapping has already been run, do nothing.
    if (initMapping.isruned) return;

    if (store) {
      MappingNodes = store;
    } else {
      MappingNodes = {
        get(name) {
          return RED.util.getObjectProperty(MappingNodes, name);
        },
        set(name, arg) {
          RED.util.setObjectProperty(MappingNodes, name, arg, true);
        }
      };
    }
    RED.events.on("flows:started", Mapping);

    initMapping.isruned = true;
  }

  /**
   * Perform mapping when the flow starts.
   *
   * This function is executed every time the Node-RED flow starts. It collects metadata and instances of various node types, such as moduleflows, module_in, and module_out nodes. It also identifies workspaces and subflows within the flow.
   *
   */
  function Mapping() {
    const moduleflowNode = {};
    const moduleinNode = {};
    const moduleoutNode = {};
    const submoduleNode = {};
    const myNodeinFlow = {};

    const namekeyNode = {};

    const allNode = {};
    const workspaces = {};
    const subflows = {};

    var count = 0;
    // Iterate through all nodes in the flow.
    RED.nodes.eachNode(node => {
      count++;
      allNode[node.id] = Object.assign({}, node);
      if (node.type === "tab") {
        workspaces[node.id] = node;
      } else if (node.type === "subflow") {
        subflows[node.id] = node;
      } else if (node.type === "moduleflows") {
        moduleflowNode[node.id] = node;
      } else if (node.type === "GBL_module_in") {
        moduleinNode[node.id] = node;
        if (typeof namekeyNode[node.z] === "undefined")
          namekeyNode[node.z] = {};
        if (typeof namekeyNode[node.z][node.name] === "undefined")
          namekeyNode[node.z][node.name] = [];
        namekeyNode[node.z][node.name].push(node.id);
      } else if (node.type === "module_out") {
        moduleoutNode[node.id] = node;
      } else if (node.type == "submodule") {
        submoduleNode[node.id] = node;
      } else if (node.type.startsWith("subflow:")) {
      }
    });

    // check module in node name duplication
    for (const tabflow in namekeyNode)
      for (const nodename in namekeyNode[tabflow]) {
        if (namekeyNode[tabflow][nodename].length != 1) {
          namekeyNode[tabflow][nodename].forEach(nodeID => {
            RED.events.emit("GBLtext:" + nodeID, {
              fill: "red",
              shape: "dot",
              text: `name '${nodename}' is duplication`
            });
          });
        } else {
          RED.events.emit("GBLtext:" + namekeyNode[tabflow][nodename][0], {});
        }
      }

    // check wirednode about submodule
    for (const nodeID in moduleinNode) {
      const moduleInNode = moduleinNode[nodeID];
      let count = 0;
      let submodule = 0;
      const subflownamekey = {};
      for (const wiredID of moduleInNode.wires[0]) {
        const wiredNode = allNode[wiredID];

        count += 1;
        if (wiredNode.type === "submodule") {
          if (typeof subflownamekey[wiredNode.name] === "undefined")
            subflownamekey[wiredNode.name] = [];
          subflownamekey[wiredNode.name].push(wiredNode.id);
          submodule += 1;
        }
      }

      if (submodule != 0 && submodule != count)
        RED.events.emit("GBLtext:" + nodeID, {
          fill: "red",
          shape: "dot",
          text: `wired node error`
        });

      for (const subnodename in subflownamekey) {
        if (subflownamekey[subnodename].length != 1) {
          subflownamekey[subnodename].forEach(nodeID => {
            RED.events.emit("GBLtext:" + nodeID, {
              fill: "red",
              shape: "dot",
              text: `name '${subnodename}' is duplication`
            });
          });
        } else {
          RED.events.emit("GBLtext:" + subflownamekey[subnodename][0], {});
        }

      }
    }

    Object.assign(myNodeinFlow, {
      ...moduleflowNode,
      ...moduleinNode,
      ...moduleoutNode,
      ...submoduleNode
    });

    MappingNodes.set("myModuleflows", myNodeinFlow);
  }

  RED.nodes.registerType("moduleflows", moduleflows);
  function moduleflows(config) {
    RED.nodes.createNode(this, config);
    const node = this;

    initMapping(node.context().global);

    var event = "GBLmodule:" + node.id;
    var event_fun = function (msg) {
      node.send(msg);
    };
    RED.events.on(event, event_fun);

    this.on("close", function () {
      RED.events.removeListener(event, event_fun);
      node.status({});
    });

    const target_error = function () {
      node.status({
        fill: "red",
        shape: "dot",
        text: "target missed"
      });
    };

    this.on("input", function (msg) {
      const mynodes = MappingNodes.get("myModuleflows");
      if (config.moduleId === null) {
        console.log("1");
        target_error();
        return;
      } else if (
        typeof mynodes[config.moduleId] === "undefined" ||
        mynodes[config.moduleId].type != "GBL_module_in"
      ) {
        console.log("2");

        target_error();
        return;
      } else if (
        config.submoduleId != null &&
        (typeof mynodes[config.submoduleId] === "undefined" ||
          mynodes[config.submoduleId].type != "submodule")
      ) {
        console.log("3");

        target_error();
        return;
      }

      // To return to this node, stack is used.
      if (typeof msg.__GBLstack == "undefined") {
        msg.__GBLstack = [];
      }

      msg.__GBLstack.push(event);

      //start linked module in
      if (config.submoduleId === null) {
        if (typeof mynodes[config.moduleId] === "undefind") {
          console.log("4");

          target_error();
          return;
        }

        RED.events.emit("GBLmodule:" + config.moduleId, msg);
      } else {
        if (typeof mynodes[config.submoduleId] === "undefind") {
          console.log("5");

          target_error();
          return;
        }
        RED.events.emit("GBLmodule:" + config.submoduleId, msg);
      }
    });
  }
  RED.nodes.registerType("GBL_module_in", module_in);
  function module_in(config) {
    RED.nodes.createNode(this, config);
    const node = this;

    initMapping(node.context().global);


    var event = "GBLmodule:" + node.id;
    var event_fun = function (msg) {
      node.receive(msg);
    };
    RED.events.on(event, event_fun);

    var node_text_event = "GBLtext:" + node.id;
    var node_text_event_fun = function (status) {
      // node.receive({ GBL__: status });
      node.status(status);
    };
    RED.events.on(node_text_event, node_text_event_fun);

    this.on("close", function () {
      RED.events.removeListener(event, event_fun);
      RED.events.removeListener(node_text_event, node_text_event_fun);
    });

    this.on("input", function (msg) {
      if (typeof msg["GBL__"] != "undefined") {
        console.log(node.id);
        console.log(msg["GBL__"]);
        node.status(msg["GBL__"]);
        return;
      }

      node.send(msg);
    });
  }

  RED.nodes.registerType("module_out", module_out);
  function module_out(config) {
    RED.nodes.createNode(this, config);
    const node = this;

    initMapping(node.context().global);

    this.on("input", function (msg) {
      if (typeof msg.__GBLstack != "undefined") {
        RED.events.emit(msg.__GBLstack.pop(), msg);
      }
    });
  }
};
