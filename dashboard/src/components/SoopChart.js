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

const SoopChart = props => {
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

  const type = "pie";

  switch (type) {
    case "line":
      return (
        <ChartContainer layout={layout}>
          <SoopLineChart />
        </ChartContainer>
      );
    case "bar":
      return (
        <ChartContainer layout={layout}>
          <SoopBarChart />
        </ChartContainer>
      );
    case "pie":
      return (
        <ChartContainer layout={layout}>
          <SoopPieChart />
        </ChartContainer>
      );
  }
};

export default SoopChart;
