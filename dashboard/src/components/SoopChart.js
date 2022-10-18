import React from "react";
import styled from "styled-components";
import SoopLineChart from "./SoopChart/SoopLineChart";
import SoopBarChart from "./SoopChart/SoopBarChart";
import SoopPieChart from "./SoopChart/SoopPieChart";
import { calculateHeight, calculateWidth, calculateLeft, calculateTop } from "../assets/DesignOption";

const ChartContainer = styled.div`
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

const SoopChart = ({ currentGroupW, currentGroupWidth, currentGroupH, node, nameVisible }) => {
  const layout = [
    calculateLeft(parseInt(node?.widgetX), currentGroupWidth, currentGroupW),
    calculateTop(parseInt(node?.widgetY), currentGroupH, nameVisible),
    calculateWidth(parseInt(node?.width), currentGroupWidth, currentGroupW),
    calculateHeight(parseInt(node?.height), currentGroupH, nameVisible),
  ];

  switch (node?.chartType) {
    case "line":
      return (
        <ChartContainer layout={layout}>
          <SoopLineChart node={node} />
        </ChartContainer>
      );
    case "bar":
      return (
        <ChartContainer layout={layout}>
          <SoopBarChart node={node} />
        </ChartContainer>
      );
    case "pie":
      return (
        <ChartContainer layout={layout}>
          <SoopPieChart node={node} />
        </ChartContainer>
      );
  }
};

export default SoopChart;
