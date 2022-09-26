import React, { useEffect, useState } from "react";
import Button from "./Button";
import Text from "./Text";
import { initlaizeSocket, disconnectSocket } from "../utils/socket";
import "./App.css";
import { useDispatch, useSelector } from "react-redux";

const { SOOP_NODE_TYPE } = require("../../common/common");

const App = () => {
  const dispatch = useDispatch();
  const nodes = useSelector(state => state.node.nodes);
  const [keys, setKeys] = useState([]);
  useEffect(() => {
    initlaizeSocket(dispatch);

    return () => {
      disconnectSocket();
    };
  }, []);

  useEffect(() => {
    if (nodes) setKeys(Object.keys(nodes));
  }, [nodes]);

  const drawNode = node => {
    console.log(node);
    switch (node.editor.type) {
      case SOOP_NODE_TYPE.LOWER_CASE:
        return <div key={node.editor.id}>lowercase</div>;
      case SOOP_NODE_TYPE.SWITCH:
        return <div key={node.editor.id}>switch</div>;
    }
  };

  return <>{keys.map(key => drawNode(nodes[key]))}</>;
};

export default App;
