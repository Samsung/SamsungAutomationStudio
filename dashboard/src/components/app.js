import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import SoopGrid from "./SoopGrid";
import SoopGroup from "./SoopGroup";
import SoopNavbar from "./SoopNavbar";
import SoopButton from "./SoopButton";
import SoopText from "./SoopText";
import SoopSlider from "./SoopSlider";
import SoopGauge from "./SoopGauge";
import SoopChart from "./SoopChart";
import SoopDropdown from "./SoopDropdown";
import SoopList from "./SoopList";
import SoopImage from "./SoopImage";
import { initlaizeSocket, disconnectSocket } from "../utils/socket";
import "./App.css";
import { useDispatch, useSelector } from "react-redux";

const { SOOP_NODE_TYPE } = require("../../common/common");

const App = () => {
  const dispatch = useDispatch();
  const nodes = useSelector(state => state.node.nodes);

  const exampleTab = ["우리집", "너네집", "으하"];
  const [isEditing, setIsEditing] = useState(false);
  const handleIsEditing = data => {
    setIsEditing(data);
  };

  useEffect(() => {
    initlaizeSocket(dispatch);

    return () => {
      disconnectSocket();
    };
  }, []);

  const drawNode = node => {
    // switch (node?.editor?.type) {
    //   case SOOP_NODE_TYPE.LOWER_CASE:
    //     return <div key={node.editor.id}>lowercase {node.editor.id}</div>;
    //   case SOOP_NODE_TYPE.SWITCH:
    //     return <div key={node.editor.id}>switch {node.editor.id}</div>;
    // }

    if (node && node.editor) {
      return (
        <div key={node.editor.id}>
          {node.editor.type}({node.editor.id})
        </div>
      );
    }
  };

  //return <>{Object.keys(nodes).map(key => drawNode(nodes[key]))}</>;

  return (
    <>
      <Router>
        <SoopNavbar isEditing={isEditing} handleIsEditing={handleIsEditing} exampleTab={exampleTab} />
        <Routes>
          <Route path="/" element={<Navigate to="/0" />} />
          <Route path=":tabId" element={<SoopGrid isEditing={isEditing} />} />
        </Routes>
        {/* <SoopGroup />
      
      <SoopList />
      <SoopButton />
      <SoopText />
      <SoopSlider />
      <SoopGauge />
      <SoopChart />
      <SoopDropdown /> */}
      </Router>
    </>
  );
};

export default App;
