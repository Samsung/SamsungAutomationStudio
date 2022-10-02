import React, { useEffect, useState, useRef } from "react";
import styled from "styled-components";
import SoopButton from "./SoopButton";
import SoopChart from "./SoopChart";
import SoopDropdown from "./SoopDropdown";
import SoopGauge from "./SoopGauge";
import SoopImage from "./SoopImage";
import SoopList from "./SoopList";
import SoopSlider from "./SoopSlider";
import SoopSwitch from "./SoopSwitch";
import SoopText from "./SoopText";
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
  const [currentGroupWidth, setCurrentGroupWidth] = useState("");
  const ref = useRef(null);

  const drawNode = node => {
    switch (node?.editor?.type) {
      case SOOP_NODE_TYPE.BUTTON:
        return (
          <SoopButton
            key={node.editor.id}
            nodeId={node.editor.id}
            currentGroupWidth={currentGroupWidth}
            currentGroupW={group.w}
            currentGroupH={group.h}
          />
        );
      case SOOP_NODE_TYPE.CHART:
        return (
          <SoopChart
            key={node.editor.id}
            nodeId={node.editor.id}
            currentGroupWidth={currentGroupWidth}
            currentGroupW={group.w}
            currentGroupH={group.h}
          />
        );
      case SOOP_NODE_TYPE.DROPDOWN:
        return (
          <SoopDropdown
            key={node.editor.id}
            nodeId={node.editor.id}
            currentGroupWidth={currentGroupWidth}
            currentGroupW={group.w}
            currentGroupH={group.h}
          />
        );
      case SOOP_NODE_TYPE.GAUGE:
        return (
          <SoopGauge
            key={node.editor.id}
            nodeId={node.editor.id}
            currentGroupWidth={currentGroupWidth}
            currentGroupW={group.w}
            currentGroupH={group.h}
          />
        );
      case SOOP_NODE_TYPE.IMAGE:
        return (
          <SoopImage
            key={node.editor.id}
            nodeId={node.editor.id}
            currentGroupWidth={currentGroupWidth}
            currentGroupW={group.w}
            currentGroupH={group.h}
          />
        );
      case SOOP_NODE_TYPE.LIST:
        return (
          <SoopList
            key={node.editor.id}
            nodeId={node.editor.id}
            currentGroupWidth={currentGroupWidth}
            currentGroupW={group.w}
            currentGroupH={group.h}
          />
        );
      case SOOP_NODE_TYPE.SLIDER:
        return (
          <SoopSlider
            key={node.editor.id}
            nodeId={node.editor.id}
            currentGroupWidth={currentGroupWidth}
            currentGroupW={group.w}
            currentGroupH={group.h}
          />
        );
      case SOOP_NODE_TYPE.SWITCH:
        return (
          <SoopSwitch
            key={node.editor.id}
            nodeId={node.editor.id}
            currentGroupWidth={currentGroupWidth}
            currentGroupW={group.w}
            currentGroupH={group.h}
          />
        );
      case SOOP_NODE_TYPE.TEXT:
        return (
          <SoopText
            key={node.editor.id}
            nodeId={node.editor.id}
            currentGroupWidth={currentGroupWidth}
            currentGroupW={group.w}
            currentGroupH={group.h}
          />
        );
    }
  };
  const nameHidden = false;

  useEffect(() => {
    setCurrentGroupWidth(ref.current.offsetWidth);
  }, []);

  return (
    <Group ref={ref}>
      {!nameHidden && <GroupName>{group.groupName}</GroupName>}
      {group.nodes.map(node => {
        drawNode(node);
      })}
      <SoopGauge currentGroupWidth={currentGroupWidth} currentGroupW={group.w} currentGroupH={group.h}></SoopGauge>
    </Group>
  );
};

export default SoopGroup;
