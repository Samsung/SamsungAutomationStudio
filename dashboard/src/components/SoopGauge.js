import React from "react";
import styled from "styled-components";
import SoopLiquidGauge from "./SoopGauge/SoopLiquidGauge";
import SoopDonutGauge from "./SoopGauge/SoopDonutGauge";
import SoopNormalGauge from "./SoopGauge/SoopNormalGauge";

// TODO: exampleData -> props
// TODO: x, y, w, h에서 받아오면 계산하기
// TODO: top, left 옵션줘서 위치 배정하기, 그룹제목이 기본 30px
const GaugeContainer = styled.div`
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

const SoopGauge = () => {
  // FIXME: 넘겨받은 데이터에 따라서 return되는 component가 다르다
  const type = "gauge";

  switch (type) {
    case "gauge":
      return (
        <GaugeContainer>
          <SoopNormalGauge />
        </GaugeContainer>
      );
    case "donut":
      return (
        <GaugeContainer>
          <SoopDonutGauge />
        </GaugeContainer>
      );
    case "liquid":
      return (
        <GaugeContainer>
          <SoopLiquidGauge />
        </GaugeContainer>
      );
  }
};

export default SoopGauge;
