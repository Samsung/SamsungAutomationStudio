import React, { useEffect, useState } from "react";
import SoopGrid from "./SoopGrid";
import SoopNavbar from "./SoopNavbar";
import SoopGroup from "./SoopGroup";
import SoopButton from "./SoopButton";
import SoopText from "./SoopText";
import SoopSlider from "./SoopSlider";
import SoopGauge from "./SoopGauge";
import SoopChart from "./SoopChart";
import SoopDropdown from "./SoopDropdown";
import SoopList from "./SoopList";
import SoopImage from "./SoopImage";
import SoopSwitch from "./SoopSwitch";
import { initlaizeSocket, disconnectSocket } from "../utils/socket";
import "./App.css";
import { useDispatch, useSelector } from "react-redux";

const { SOOP_NODE_TYPE } = require("../../common/common");

const App = () => {
  const dispatch = useDispatch();
  const dashboard = useSelector(state => state.dashboard);
  const [isEditing, setIsEditing] = useState(false);
  const [currentTab, setCurrentTab] = useState(0);

  useEffect(() => {
    console.log(dashboard);
  }, [dashboard]);

  const handleIsEditing = data => {
    setIsEditing(data);
  };
  const handleCurrentTab = tabIdx => {
    setCurrentTab(tabIdx);
  };

  useEffect(() => {
    initlaizeSocket(dispatch);

    return () => {
      disconnectSocket();
    };
  }, []);

  // const drawNode = node => {
  //   switch (node?.editor?.type) {
  //     case SOOP_NODE_TYPE.SWITCH:
  //       return <SoopSwitch key={node.editor.id} node={node.editor} />;
  //     case SOOP_NODE_TYPE.SLIDER:
  //       return <SoopSlider key={node.editor.id} node={node.editor} states={node.states} />;
  //     case SOOP_NODE_TYPE.GAUGE:
  //       return <SoopGauge key={node.editor.id} node={node.editor} states={node.states} />;
  //   }
  // };
  // return <>{Object.keys(nodes).map(key => drawNode(nodes[key]))}</>;

  return <>dashboard</>;

  // return (
  //   <>
  //     <SoopNavbar
  //       isEditing={isEditing}
  //       handleIsEditing={handleIsEditing}
  //       currentTab={currentTab}
  //       handleCurrentTab={handleCurrentTab}
  //       tmpData={tmpData}
  //     />

  //     {tmpData.tabs.map((tab, idx) => {
  //       if (currentTab === idx) {
  //         console.log(tab);
  //         return <SoopGrid key={tab.tabId} isEditing={isEditing} currentTab={currentTab} tmpData={tmpData} tab={tab} />;
  //       }
  //     })}
  //     {/* <SoopGroup />
  //     <SoopList />
  //     <SoopButton />
  //     <SoopText />
  //     <SoopSlider />
  //     <SoopGauge />
  //     <SoopChart />
  //     <SoopDropdown /> */}
  //   </>
  // );
};

export default App;
