import React, { useState, useEffect } from "react";
import Gauge from "react-svg-gauge";
import { mainColor, fontColor, fontSize } from "../../assets/DesignOption";

const SoopNormalGauge = ({ layout, node }) => {
  const [currentValue, setCurrentValue] = useState(1);
  const [currentLabel, setCurrentLabel] = useState("");
  const [range, setRange] = useState("");

  useEffect(() => {
    if (!node) return;
    if (Array.isArray(node?.states) && node?.states[0]) {
      setCurrentValue(node?.states[0].value);
    } else {
      setCurrentValue(node?.value);
    }
    setCurrentLabel(node?.label);
    setRange([parseInt(node?.min), parseInt(node?.max)]);
  }, [node]);

  return (
    <>
      <Gauge
        value={currentValue}
        width={layout[2]}
        height={layout[3]}
        min={range[0]}
        max={range[1]}
        label={currentLabel}
        color={mainColor[node?.color]}
        topLabelStyle={{
          fontSize: fontSize.md,
          fontFamily: "Pretendard-Bold",
          fill: fontColor.light,
        }}
        valueLabelStyle={{ fontSize: fontSize.xl, fontFamily: "Pretendard-Regular", fill: fontColor.light }}
        minMaxLabelStyle={{ fontSize: fontSize.sm, fontFamily: "Pretendard-Regular", fill: fontColor.light }}
        valueFormatter={value => `${value}${node?.units}`}
      />
    </>
  );
};

export default SoopNormalGauge;
