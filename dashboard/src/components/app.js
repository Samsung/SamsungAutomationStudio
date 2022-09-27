import React, { useEffect, useState } from "react";
import Button from "./Button";
import Text from "./Text";
import Switch from "./Switch";
import { initlaizeSocket, disconnectSocket } from "../utils/socket";
import "./App.css";
import { useDispatch, useSelector } from "react-redux";

const { SOOP_NODE_TYPE } = require("../../common/common");

const App = () => {
  const dispatch = useDispatch();
  const nodes = useSelector(state => state.node.nodes);

  useEffect(() => {
    initlaizeSocket(dispatch);

    return () => {
      disconnectSocket();
    };
  }, []);

  const drawNode = node => {
    switch (node?.editor?.type) {
      case SOOP_NODE_TYPE.SWITCH:
        return <Switch key={node.editor.id} id={node.editor.id} />;
    }

    if (node && node.editor) {
      return (
        <div key={node.editor.id}>
          {node.editor.type}({node.editor.id})
        </div>
      );
    }
  };

  return <>{Object.keys(nodes).map(key => drawNode(nodes[key]))}</>;
};

export default App;
