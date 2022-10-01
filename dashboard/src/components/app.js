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
  const node = useSelector(state => state.node);
  const [nodes, setNodes] = useState({});

  useEffect(() => {
    if (node && node.nodes) setNodes(node.nodes);
  }, [node]);

  const [isEditing, setIsEditing] = useState(false);
  const [currentTab, setCurrentTab] = useState(0);

  /**FIXME: 추후 state에서 받아오는 정보로 수정필요 */
  const tmpData = {
    tabs: [
      {
        tabId: "탭ID 1 (숫자)",
        tabName: "탭이름 1",
        groups: [
          {
            groupId: "그룹ID 1 (숫자)",
            groupName: "그룹이름 1",
            x: 0,
            y: 0,
            w: 2,
            h: 4,
            nodes: [{}, {}],
          },
          {
            groupId: "그룹ID 2 (숫자)",
            groupName: "그룹이름 2",
            x: 0,
            y: 0,
            w: 2,
            h: 4,
            nodes: [{}, {}],
          },
        ],
      },
      {
        tabId: "탭ID 2 (숫자)",
        tabName: "탭이름 2",
        groups: [
          {
            groupId: "그룹ID 3 (숫자)",
            groupName: "그룹이름 3",
            x: 0,
            y: 0,
            w: 2,
            h: 4,
            nodes: [{}, {}],
          },
          {
            groupId: "그룹ID 4 (숫자)",
            groupName: "그룹이름 4",
            x: 0,
            y: 0,
            w: 2,
            h: 4,
            nodes: [{}, {}],
          },
        ],
      },
      {
        tabId: "탭ID 3 (숫자)",
        tabName: "탭이름 3",
        groups: [
          {
            groupId: "그룹ID 5 (숫자)",
            groupName: "그룹이름 5",
            x: 0,
            y: 0,
            w: 2,
            h: 4,
            nodes: [{}, {}],
          },
          {
            groupId: "그룹ID 6 (숫자)",
            groupName: "그룹이름 6",
            x: 0,
            y: 0,
            w: 2,
            h: 4,
            nodes: [{}, {}],
          },
        ],
      },
    ],
  };
  // const asdlkfjsadkfj;

  // useEffect(() => {
  //   asdlkfjsadkfj = currentTab'

  // }, [currentTab])

  // const exampleTab = ["우리집", "너네집", "으하"];
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

  const drawNode = node => {
    switch (node?.editor?.type) {
      case SOOP_NODE_TYPE.SWITCH:
        return <SoopSwitch key={node.editor.id} node={node.editor} />;
      case SOOP_NODE_TYPE.SLIDER:
        return <SoopSlider key={node.editor.id} node={node.editor} states={node.states} />;
      case SOOP_NODE_TYPE.GAUGE:
        return <SoopGauge key={node.editor.id} node={node.editor} states={node.states} />;
    }
  };

  return <>{Object.keys(nodes).map(key => drawNode(nodes[key]))}</>;

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
