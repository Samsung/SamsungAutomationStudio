// 주석 자체는 한글로 일단 작성,
// 추후 영어로 주석 변경

module.exports = function (RED) {
  let MappingNodes = {};

  function initMapping(store) {
    //최초 1회 시행을 위한 리턴
    if (initMapping.isruned) return;

    //인자가 있으면 해당값에 저장
    //코드 내에서 노드레드 전역컨텍스트를 사용할 예정
    if (store) {
      MappingNodes = store;
    }
    // 전역컨텍스트에 이상이 있으면 해당 코드 내부에 저장소 생성
    else {
      MappingNodes = {
        get(name) {
          return RED.util.getObjectProperty(MappingNodes, name);
        },
        set(name, arg) {
          RED.util.setObjectProperty(MappingNodes, name, arg, true);
        }
      };
    }

    // 플로우 시작 시 매핑을 하도록 이벤트 생성
    RED.events.on("flows:started", Mapping);
    // RED.events.on("nodes:add", function (node) {
    //   console.log("노드 추가됨!");
    //   if (node.type != "module in") return;
    //   Mapping();
    // });

    // 이후 호출 시 실행되지 않도록 ture설정
    initMapping.isruned = true;
  }

  //실제 매핑을 하는 함수 플로우 시작할 때마다 실행
  function Mapping() {
    // module, in, out 노드 메타데이터 저장할 객체
    const moduleflowNode = {};
    const moduleinNode = {};
    const moduleoutNode = {};
    const myNodeinFlow = {};

    // 노드 인스턴스가 저장될 객체
    const moduleflowNodeInstance = {};
    const moduleinNodeInstance = {};
    const moduleoutNodeInstance = {};
    const myNodeInstanceinFlow = {};
    const myNodeInstanceInSubflow = {};

    // 모든 노드와, 작업공간, 서브 플로우 저장될 객체
    const allNode = {};
    const workspaces = {};
    const subflows = {};

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
        // 서브플로우는 다음에 처리
        // const subflowInstance = RED.nodes.getNode(node.id);
        // console.log(subflowInstance);
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
    // console.log(moduleinNode);

    // console.log(allNode);
  }
  RED.nodes.registerType("moduleflows", moduleflows);
  function moduleflows(config) {
    //노드 생성 - node-red 기본사항
    RED.nodes.createNode(this, config);
    const node = this;

    // module, module in, module out무슨 노드든 생성되면 매핑이벤트를 생성하고, 저장소 선택
    initMapping(node.context().global);

    var event = "GBLmodule:" + node.id;
    var event_fun = function (msg) {
      // this.receive(msg);
      node.send(msg);
    };
    RED.events.on(event, event_fun);

    this.on("close", function () {
      RED.events.removeListener(event, event_fun);
    });

    this.on("input", function (msg) {
      if (typeof msg.__GBLstack == "undefined") {
        msg.__GBLstack = [];
      }

      msg.__GBLstack.push(event);
      // console.log(config.moduleId);
      RED.events.emit("GBLmodule:" + config.moduleId, msg);
    });
  }
  RED.nodes.registerType("module_in", module_in);
  function module_in(config) {
    RED.nodes.createNode(this, config);
    const node = this;

    // module, module in, module out무슨 노드든 생성되면 매핑이벤트를 생성하고, 저장소 선택
    initMapping(node.context().global);

    //새로운 이벤트를 만듦
    // module에서 해당 id로 이벤트를 발생시키며
    var event = "GBLmodule:" + node.id;
    // 이벤트 발생시 msg를 받아와서 해당 노드를 실행
    var event_fun = function (msg) {
      node.receive(msg);
    };
    RED.events.on(event, event_fun);
    //해당 노드가 삭제될때 이벤트를 없애버림
    this.on("close", function () {
      RED.events.removeListener(event, event_fun);
    });
    //노드 시작시 다음 노드로 msg보냄
    this.on("input", function (msg) {
      console.log(config.name);
      node.send(msg);
    });
  }

  RED.nodes.registerType("module_out", module_out);
  function module_out(config) {
    RED.nodes.createNode(this, config);
    const node = this;

    // module, module in, module out무슨 노드든 생성되면 매핑이벤트를 생성하고, 저장소 선택
    initMapping(node.context().global);

    this.on("input", function (msg) {
      if (typeof msg.__GBLstack != "undefined") {
        RED.events.emit(msg.__GBLstack.pop(), msg); // return to the action orig. flow
      }
    });
  }
};
