import React, { useEffect, useState } from "react";
import Button from "./Button";
import Text from "./Text";
import { initlaizeSocket, disconnectSocket } from "../utils/socket";
import "./App.css";
import { useDispatch, useSelector } from "react-redux";

const { SOOP_NODE_TYPE } = require("../common/common");
const App = () => {
  const dispatch = useDispatch();
  const nodes = useSelector((state) => state.node.states);
  const [keys, setKeys] = useState([]);
  useEffect(() => {
    initlaizeSocket(dispatch);

    return () => {
      disconnectSocket();
    };
  }, []);

  useEffect(() => {
    if (nodes) setKeys(nodes.keys());
  }, [nodes]);

  const drawNode = (node) => {
    switch (node.type) {
      case SOOP_NODE_TYPE.LOWER_CASE:
        break;
      case SOOP_NODE_TYPE.SWITCH:
        break;
    }
  };

  return <>{keys.map((key) => drawNode(nodes[key]))}</>;
};

export default App;
