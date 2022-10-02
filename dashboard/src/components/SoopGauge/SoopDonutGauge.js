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
    nodeId: "dfg124w4",
    gType: "donut",
    label: "라벨입니당",
    range: [10, 20],
    units: "",
    color: "blue",
    states: [{ value: 13 }],
  };

  const [currentValue, setCurrentValue] = useState(1);
  const [currentLabel, setCurrentLabel] = useState("");
  const [range, setRange] = useState("");
  const [endValue, setEndValue] = useState("");

  useEffect(() => {
    if (Array.isArray(exampleData.states) && exampleData.states[0]) {
      setCurrentValue(exampleData.states[0].value);
    }
    setCurrentLabel(exampleData.label);
    setRange([exampleData.range[0], exampleData.range[1]]);
  }, []);

  return (
    <>
      <DonutGaugeWrapper>
        <DonutGaugeLabel>{currentLabel}</DonutGaugeLabel>
        <AnimatedProgressProvider
          valueStart={range[0]}
          valueEnd={currentValue}
          duration={1.4}
          easingFunction={easeQuadInOut}
        >
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
                {exampleData.units.length === 1 ? (
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
                      {exampleData.units}
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
                    <div style={{ fontSize: fontSize.sm }}>{exampleData.units}</div>
                  </div>
                )}
                <CircularProgressbar
                  value={currentValue}
                  minValue={range[0]}
                  maxValue={range[1]}
                  strokeWidth="12"
                  styles={{
                    path: {
                      stroke: `url(#${exampleData.nodeId})`,
                      height: "100%",
                    },
                  }}
                ></CircularProgressbar>
                <GradientSVG colorOption={exampleData.color} rotation={0} idCSS={exampleData.nodeId} />
              </div>
            );
          }}
        </AnimatedProgressProvider>
      </DonutGaugeWrapper>
    </>
  );
};

export default SoopDonutGauge;
