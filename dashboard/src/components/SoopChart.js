import React from "react";
import styled from "styled-components";
import SoopLineChart from "./SoopChart/SoopLineChart";
import SoopBarChart from "./SoopChart/SoopBarChart";
import SoopPieChart from "./SoopChart/SoopPieChart";

// TODO: exampleData -> props
// TODO: x, y, w, h에서 받아오면 계산하기
// TODO: top, left 옵션줘서 위치 배정하기, 그룹제목이 기본 30px
const ChartContainer = styled.div`
  position: absolute;
  top: 30px;

  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 240px;
  padding: 5px 10px;
  box-sizing: border-box;
`;

const SoopChart = () => {
  // FIXME: 넘겨받은 데이터에 따라서 return되는 component가 다르다
  const type = "pie";

  switch (type) {
    case "line":
      return (
        <ChartContainer>
          <SoopLineChart />
        </ChartContainer>
      );
    case "bar":
      return (
        <ChartContainer>
          <SoopBarChart />
        </ChartContainer>
      );
    case "pie":
      return (
        <ChartContainer>
          <SoopPieChart />
        </ChartContainer>
      );
  }
};

export default SoopChart;
