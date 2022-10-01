import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { easeQuadInOut } from "d3-ease";
import AnimatedProgressProvider from "./AnimatedProgressProvider";
import GradientSVG from "./GradientSVG";
import { fontSize, fontColor } from "../../assets/DesignOption";

// FIXME: wh, 중 작은 사이즈에 맞추기!!
const DonutGaugeWrapper = styled.div`
  width: 180px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 0 15px;
  box-sizing: border-box;
`;

const DonutGaugeLabel = styled.div`
  color: ${fontColor.light};
  font-size: ${fontSize.md};
  font-family: "Pretendard-Bold";
  margin: 0 auto 15px;
`;

const SoopDonutGauge = () => {
  // FIXME: card 크기로 수정
  const exampleData = {
    node: {
      nodeId: "dfg124w4",
      gType: "donut",
      label: "라벨입니당",
      range: [0, 100],
      units: "%%%",
      color: "blue",
    },
    states: {
      value: 100,
    },
  };

  const [currentValue, setCurrentValue] = useState(1);
  const [currentLabel, setCurrentLabel] = useState("");

  useEffect(() => {
    setCurrentValue(exampleData.states.value);
    setCurrentLabel(exampleData.node.label);
  }, []);

  return (
    <>
      <DonutGaugeWrapper>
        <DonutGaugeLabel>{currentLabel}</DonutGaugeLabel>
        <AnimatedProgressProvider valueStart={0} valueEnd={currentValue} duration={1.4} easingFunction={easeQuadInOut}>
          {currentValue => {
            const roundedValue = Math.round(currentValue);
            return (
              <div
                style={{
                  position: "relative",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                {exampleData.node.units.length === 1 ? (
                  <div
                    style={{
                      color: fontColor.light,
                      position: "absolute",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      alignItems: "center",
                      fontSize: fontSize.xl,
                      marginTop: -5,
                    }}
                  >
                    <strong>
                      {roundedValue}
                      {exampleData.node.units}
                    </strong>
                  </div>
                ) : (
                  <div
                    style={{
                      color: fontColor.light,
                      position: "absolute",
                      marginTop: -5,
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <div
                      style={{
                        color: fontColor.light,
                        fontSize: fontSize.xl,
                        fontFamily: "Pretendard-Bold",
                      }}
                    >
                      {roundedValue}
                    </div>
                    <div style={{ fontSize: fontSize.sm }}>{exampleData.node.units}</div>
                  </div>
                )}
                <CircularProgressbar
                  value={currentValue}
                  strokeWidth="12"
                  styles={{
                    path: {
                      stroke: `url(#${exampleData.node.nodeId})`,
                      height: "100%",
                    },
                  }}
                ></CircularProgressbar>
                <GradientSVG colorOption={exampleData.node.color} rotation={0} idCSS={exampleData.node.nodeId} />
              </div>
            );
          }}
        </AnimatedProgressProvider>
      </DonutGaugeWrapper>
    </>
  );
};

export default SoopDonutGauge;
