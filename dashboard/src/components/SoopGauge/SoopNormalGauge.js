import React, { useState, useEffect } from "react";
import Gauge from "react-svg-gauge";
import { mainColor, fontColor, fontSize } from "../../assets/DesignOption";

const SoopNormalGauge = ({ layout, node }) => {
  const [currentValue, setCurrentValue] = useState(1);
  const [currentLabel, setCurrentLabel] = useState("");
  const [range, setRange] = useState("");

  useEffect(() => {
    if (Array.isArray(node.states) && node.states[0]) {
      setCurrentValue(node.states[0].value);
    }
    setCurrentLabel(node.label);
    setRange([node.range[0], node.range[1]]);
  }, [node]);

  // TODO: width, height 전달

  return (
    <>
      <Gauge
        value={currentValue}
        width={layout[2]}
        height={layout[3]}
        min={range[0]}
        max={range[1]}
        label={currentLabel}
        color={mainColor[node.color]}
        topLabelStyle={{
          fontSize: fontSize.md,
          fontFamily: "Pretendard-Bold",
          fill: fontColor.light,
        }}
        valueLabelStyle={{ fontSize: fontSize.xl, fontFamily: "Pretendard-Regular", fill: fontColor.light }}
        minMaxLabelStyle={{ fontSize: fontSize.sm, fontFamily: "Pretendard-Regular", fill: fontColor.light }}
        valueFormatter={value => `${value}${node.units}`}
      />
    </>
  );
};

export default SoopNormalGauge;
