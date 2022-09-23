import React from "react";
import { color } from "d3-color";
import { interpolateRgb } from "d3-interpolate";
import LiquidFillGauge from "react-liquid-gauge";
import { mainColor, gradientColor, fontColor } from "../../assets/DesignOption";

const SoopLiquidGauge = () => {
  const unit = "%";
  const value = 60;
  const startColor = mainColor.blue;
  const endColor = gradientColor.blue;

  const radius = 100;
  const interpolate = interpolateRgb(startColor, endColor);
  const fillColor = interpolate(value / 100);
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
      <LiquidFillGauge
        style={{ margin: "0 0" }}
        width={radius * 2}
        height={radius * 2}
        value={value}
        unit={unit} // percent는 단위로
        textSize={1}
        textOffsetX={0}
        textOffsetY={15}
        textRenderer={(props) => {
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
          fontFamily: "Arial",
        }}
        waveTextStyle={{
          fill: color("#fff").toString(),
          fontFamily: "Arial",
        }}
        onClick={() => {
          this.setState({ value: Math.random() * 100 });
        }}
      />
      <div
        style={{
          margin: "20px auto",
          width: 120,
        }}
      ></div>
    </>
  );
};

export default SoopLiquidGauge;
