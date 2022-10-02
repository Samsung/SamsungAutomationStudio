import React, { useState, useEffect } from "react";
import Gauge from "react-svg-gauge";
import { mainColor, fontColor, fontSize } from "../../assets/DesignOption";

const SoopNormalGauge = props => {
  const { layout } = props;
  const exampleData = {
    nodeId: "dfg124w4",
    gType: "gauge",
    label: "라벨입니당",
    range: [10, 20],
    units: "",
    color: "purple",
    states: [{ value: 13 }],
  };

  const [currentValue, setCurrentValue] = useState(1);
  const [currentLabel, setCurrentLabel] = useState("");
  const [range, setRange] = useState("");

  useEffect(() => {
    if (Array.isArray(exampleData.states) && exampleData.states[0]) {
      setCurrentValue(exampleData.states[0].value);
    }
    setCurrentLabel(exampleData.label);
    setRange([exampleData.range[0], exampleData.range[1]]);
  }, []);

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
        color={mainColor[exampleData.color]}
        topLabelStyle={{
          fontSize: fontSize.md,
          fontFamily: "Pretendard-Bold",
          fill: fontColor.light,
        }}
        valueLabelStyle={{ fontSize: fontSize.xl, fontFamily: "Pretendard-Regular", fill: fontColor.light }}
        minMaxLabelStyle={{ fontSize: fontSize.sm, fontFamily: "Pretendard-Regular", fill: fontColor.light }}
        valueFormatter={value => `${value}${exampleData.units}`}
      />
    </>
  );
};

export default SoopNormalGauge;
