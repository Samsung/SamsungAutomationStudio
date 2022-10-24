import React from "react";
import styled from "styled-components";
import SoopLiquidGauge from "./SoopGauge/SoopLiquidGauge";
import SoopDonutGauge from "./SoopGauge/SoopDonutGauge";
import SoopNormalGauge from "./SoopGauge/SoopNormalGauge";
import { calculateHeight, calculateWidth, calculateLeft, calculateTop } from "../assets/DesignOption";

const GaugeContainer = styled.div`
  position: absolute;
  left: ${({ layout }) => `${layout.LEFT}px;`}
  top: ${({ layout }) => `${layout.TOP}px;`}
  width: ${({ layout }) => `${layout.WIDTH}px;`}
  height:${({ layout }) => `${layout.HEIGHT}px;`}
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 5px 10px;
  box-sizing: border-box;
`;

const GaugeNormalContainer = styled.div`
  position: absolute;
  left: ${({ layout }) => `${layout.LEFT}px;`}
  top: ${({ layout }) => `${layout.TOP}px;`}
  width: ${({ layout }) => `${layout.WIDTH}px;`}
  height:${({ layout }) => `${layout.HEIGHT}px;`}
  display: flex;
  justify-content: center;
  align-items: center;
  box-sizing: border-box;
`;

const SoopGauge = ({ currentGroupW, currentGroupWidth, currentGroupH, node, nameVisible }) => {
  const layout = {
    LEFT: calculateLeft(parseInt(node?.widgetX), currentGroupWidth, currentGroupW),
    TOP: calculateTop(parseInt(node?.widgetY), currentGroupH, nameVisible),
    WIDTH: calculateWidth(parseInt(node?.width), currentGroupWidth, currentGroupW),
    HEIGHT: calculateHeight(parseInt(node?.height), currentGroupH, nameVisible),
  };

  switch (node?.gType) {
    case "gauge":
      return (
        <GaugeNormalContainer layout={layout}>
          <SoopNormalGauge layout={layout} node={node} />
        </GaugeNormalContainer>
      );
    case "donut":
      return (
        <GaugeContainer layout={layout}>
          <SoopDonutGauge radius={Math.min(layout.WIDTH, layout.HEIGHT)} node={node} />
        </GaugeContainer>
      );
    case "liquid":
      return (
        <GaugeContainer layout={layout}>
          <SoopLiquidGauge radius={Math.min(layout.WIDTH, layout.HEIGHT)} node={node} />
        </GaugeContainer>
      );
  }
};

export default SoopGauge;
