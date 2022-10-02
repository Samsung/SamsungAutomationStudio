import React from "react";
import styled from "styled-components";
import SoopLiquidGauge from "./SoopGauge/SoopLiquidGauge";
import SoopDonutGauge from "./SoopGauge/SoopDonutGauge";
import SoopNormalGauge from "./SoopGauge/SoopNormalGauge";
import { calculateHeight, calculateWidth, calculateLeft, calculateTop } from "../assets/DesignOption";

const GaugeContainer = styled.div`
  position: absolute;
  left: ${({ layout }) => `${layout[0]}px;`}
  top: ${({ layout }) => `${layout[1]}px;`}
  width: ${({ layout }) => `${layout[2]}px;`}
  height:${({ layout }) => `${layout[3]}px;`}
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 5px 10px;
  box-sizing: border-box;
`;

const GaugeNormalContainer = styled.div`
  position: absolute;
  left: ${({ layout }) => `${layout[0]}px;`}
  top: ${({ layout }) => `${layout[1]}px;`}
  width: ${({ layout }) => `${layout[2]}px;`}
  height:${({ layout }) => `${layout[3]}px;`}
  display: flex;
  justify-content: center;
  align-items: center;
  box-sizing: border-box;
`;

const SoopGauge = props => {
  const { currentGroupW, currentGroupWidth, currentGroupH } = props;

  const exampleData = {
    nodeId: "abcde",
    widgetX: 0,
    widgetY: 0,
    width: 2,
    height: 2,
  };

  const layout = [
    calculateLeft(exampleData.widgetX, currentGroupWidth, currentGroupW),
    calculateTop(exampleData.widgetY),
    calculateWidth(exampleData.width, currentGroupWidth, currentGroupW),
    calculateHeight(exampleData.height, currentGroupH),
  ];

  const type = "gauge";

  switch (type) {
    case "gauge":
      return (
        <GaugeNormalContainer layout={layout}>
          <SoopNormalGauge layout={layout} />
        </GaugeNormalContainer>
      );
    case "donut":
      return (
        <GaugeContainer layout={layout}>
          <SoopDonutGauge radius={Math.min(layout[2], layout[3])} />
        </GaugeContainer>
      );
    case "liquid":
      return (
        <GaugeContainer layout={layout}>
          <SoopLiquidGauge radius={Math.min(layout[2], layout[3])} />
        </GaugeContainer>
      );
  }
};

export default SoopGauge;
