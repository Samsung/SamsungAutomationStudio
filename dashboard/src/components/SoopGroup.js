import React from "react";
import styled from "styled-components";
import SoopButton from "./SoopButton";
import SoopChart from "./SoopChart";
import SoopDropdown from "./SoopDropdown";
import SoopGauge from "./SoopGauge";
import SoopImage from "./SoopImage";
import SoopList from "./SoopList";
import SoopSlider from "./SoopSlider";
import SoopSwitch from "./SoopSwitch";
import { fontSize, fontColor } from "../assets/DesignOption";

const { SOOP_NODE_TYPE } = require("../../common/common");

const Group = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  border-radius: 10px;
  filter: drop-shadow(0px 0px 20px rgba(0, 0, 0, 0.05));
  background-color: white;
`;

const GroupName = styled.div`
  position: absolute;
  z-index: 99;
  width: 100%;
  height: 30px;
  display: flex;
  align-items: center;
  box-sizing: border-box;
  border-radius: 10px;
  font-family: "Pretendard-Bold";
  font-size: ${fontSize.md};
  color: ${fontColor.light};
  padding: 3px 10px;
`;

const SoopGroup = ({ group, index }) => {
  // TODO: 노드 그룹 정보들을 받아오면 그룹의 설정에 따라서 변경이 가능하다.
  // 그리고 노드의 렌더링도 여기서 해야한다... ㅠㅜㅠㅜ
  const drawNode = node => {
    switch (node?.editor?.type) {
      case SOOP_NODE_TYPE.BUTTON:
        return <SoopButton />;
      case SOOP_NODE_TYPE.CHART:
        return <SoopChart />;
      case SOOP_NODE_TYPE.DROPDOWN:
        return <SoopDropdown />;
      case SOOP_NODE_TYPE.GAUGE:
        return <SoopGauge />;
      case SOOP_NODE_TYPE.IMAGE:
        return <SoopImage />;
      case SOOP_NODE_TYPE.LIST:
        return <SoopList />;
      case SOOP_NODE_TYPE.SLIDER:
        return <SoopSlider />;
      case SOOP_NODE_TYPE.SWITCH:
        return <SoopSwitch key={node.editor.id} nodeId={node.editor.id} />;
      case SOOP_NODE_TYPE.TEXT:
        return <SoopText />;
    }
  };
  const nameHidden = false;
  // const currentGroupWidth = Group.current.offsetWidth;

  return (
    <Group>
      {!nameHidden && <GroupName>{group.groupName}</GroupName>}
      {group.nodes.map(node => {
        drawNode(node);
      })}
      {/* <SoopButton /> */}
      {/* <SoopSwitch nodeId={Math.random()} /> */}
      {/* <SoopSlider /> */}
      {/* <SoopChart /> */}
      {/* <SoopGauge /> */}
      <SoopImage />
    </Group>
  );
};

export default SoopGroup;
