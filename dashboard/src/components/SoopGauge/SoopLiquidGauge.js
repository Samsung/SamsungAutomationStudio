import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { color } from "d3-color";
import { interpolateRgb } from "d3-interpolate";
import LiquidFillGauge from "react-liquid-gauge";
import { mainColor, gradientColor, fontColor, fontSize } from "../../assets/DesignOption";

// FIXME: wh, 중 작은 사이즈에 맞추기!!
const LiquidGaugeWrapper = styled.div`
  width: 180px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 0 15px;
  box-sizing: border-box;
`;

const LiquidGaugeLabel = styled.div`
  color: ${fontColor.light};
  font-size: ${fontSize.md};
  font-family: "Pretendard-Bold";
  margin: 0 auto 15px;
`;

const SoopLiquidGauge = () => {
  const exampleData = {
    nodeId: "dfg124w4",
    gType: "donut",
    label: "라벨입니당",
    range: [0, 5],
    units: "mg/l",
    color: "orange",
    states: [{ value: 50 }],
  };

  const [currentValue, setCurrentValue] = useState(1);
  const [currentLabel, setCurrentLabel] = useState("");
  const [convertedValue, setConvertedValue] = useState(1);

  // FIXME: 사이즈 계산 후 변경되어야 한다. w/h 중 작은 크기의 반!
  const radius = 90;

  useEffect(() => {
    if (Array.isArray(exampleData.states) && exampleData.states[0]) {
      setCurrentValue(exampleData.states[0].value);
    }
    setCurrentLabel(exampleData.label);
    const calculation = setConvertedValue();
  }, []);

  const startColor = mainColor[exampleData.color];
  const endColor = gradientColor[exampleData.color];

  const interpolate = interpolateRgb(startColor, endColor);
  const fillColor = interpolate(currentValue / 100);
  const gradientStops = [
    {
      key: "0%",
      stopColor: color(fillColor).darker(0.5).toString(),
      stopOpacity: 1,
      offset: "0%",
    },
    {
      key: "50%",
      stopColor: fillColor,
      stopOpacity: 0.75,
      offset: "50%",
    },
    {
      key: "100%",
      stopColor: color(fillColor).brighter(0.5).toString(),
      stopOpacity: 0.5,
      offset: "100%",
    },
  ];

  return (
    <>
      <LiquidGaugeWrapper>
        <LiquidGaugeLabel>{currentLabel}</LiquidGaugeLabel>
        <LiquidFillGauge
          style={{ margin: "0 0" }}
          width={radius * 2}
          height={radius * 2}
          value={currentValue}
          unit={exampleData.units} // percent는 단위로
          textSize={1}
          textOffsetX={0}
          textOffsetY={15}
          textRenderer={props => {
            const value = Math.round(props.value);
            const radius = props.height / 2;
            const textPixels = (props.textSize * radius) / 2;
            const valueStyle = {
              fontSize: textPixels,
            };
            const unitStyle = {
              fontSize: textPixels * 0.6,
            };

            return (
              <tspan>
                <tspan className="value" style={valueStyle}>
                  {value}
                </tspan>
                <tspan style={unitStyle}>{props.unit}</tspan>
              </tspan>
            );
          }}
          riseAnimation
          waveAnimation
          waveFrequency={2}
          waveAmplitude={1}
          gradient
          gradientStops={gradientStops}
          circleStyle={{
            fill: fillColor,
          }}
          waveStyle={{
            fill: fillColor,
          }}
          textStyle={{
            fill: color(fontColor.light).toString(),
            fontFamily: "Pretendard-Medium",
          }}
          waveTextStyle={{
            fill: color("#fff").toString(),
            fontFamily: "Pretendard-Medium",
          }}
        />
      </LiquidGaugeWrapper>
    </>
  );
};

export default SoopLiquidGauge;
