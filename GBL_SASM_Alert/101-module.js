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
    const myNodeinFlow = {};

    const moduleflowNodeInstance = {};
    const moduleinNodeInstance = {};
    const moduleoutNodeInstance = {};
    const myNodeInstanceinFlow = {};
    const myNodeInstanceInSubflow = {};

    const allNode = {};
    const workspaces = {};
    const subflows = {};

    // Iterate through all nodes in the flow.
    RED.nodes.eachNode(node => {
      allNode[node.id] = Object.assign({}, node);
      if (node.type === "tab") {
        workspaces[node.id] = node;
      } else if (node.type === "subflow") {
        subflows[node.id] = node;
      } else if (node.type === "moduleflows") {
        moduleflowNode[node.id] = node;

        const nodeInstance = RED.nodes.getNode(node.id);
        if (nodeInstance) {
          moduleflowNodeInstance[node.id] = nodeInstance;
        }
      } else if (node.type === "module_in") {
        moduleinNode[node.id] = node;
        const nodeInstance = RED.nodes.getNode(node.id);
        if (nodeInstance) {
          moduleinNodeInstance[node.id] = nodeInstance;
        }
      } else if (node.type === "module_out") {
        moduleoutNode[node.id] = node;
        const nodeInstance = RED.nodes.getNode(node.id);
        if (nodeInstance) {
          moduleoutNodeInstance[node.id] = nodeInstance;
        }
      } else if (node.type.startsWith("subflow:")) {
      }
    });

    Object.assign(myNodeInstanceinFlow, {
      ...moduleflowNodeInstance,
      ...moduleinNodeInstance,
      ...moduleoutNodeInstance,
      ...myNodeInstanceInSubflow
    });

    Object.assign(myNodeinFlow, {
      ...moduleflowNode,
      ...moduleinNode,
      ...moduleoutNode
    });

    MappingNodes.set("myModuleflows", moduleinNode);
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

    this.on("input", function (msg) {
      // To return to this node, stack is used.
      if (typeof msg.__GBLstack == "undefined") {
        msg.__GBLstack = [];
      }

      msg.__GBLstack.push(event);

      //start linked module in
      RED.events.emit("GBLmodule:" + config.moduleId, msg);
    });
  }
  RED.nodes.registerType("module_in", module_in);
  function module_in(config) {
    RED.nodes.createNode(this, config);
    const node = this;

    initMapping(node.context().global);

    var event = "GBLmodule:" + node.id;
    var event_fun = function (msg) {
      node.receive(msg);
    };

    RED.events.on(event, event_fun);
    this.on("close", function () {
      RED.events.removeListener(event, event_fun);
      node.status({});
    });
    this.on("input", function (msg) {
      let node_count = 0;
      let submodule_count = 0;
      config.wires[0].forEach(wiredID => {
        node_count += 1;
        if (RED.nodes.getNode(wiredID).type === "submodule")
          submodule_count += 1;
      });

      if (submodule_count === 0) node.send(msg);
      else {
        if (submodule_count === node_count)
          this.status({
            fill: "red",
            shape: "dot",
            text: "this node cant start"
          });
        else
          this.status({ fill: "red", shape: "dot", text: "wired node error" });
        if (typeof msg.__GBLstack != "undefined") {
          RED.events.emit(msg.__GBLstack.pop(), msg);
        }
        return;
      }
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
