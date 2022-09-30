import React, { useState, useEffect } from "react";
import Gauge from "react-svg-gauge";
import { mainColor, fontColor, fontSize } from "../../assets/DesignOption";

const SoopNormalGauge = () => {
  const exampleData = {
    node: {
      nodeId: "dfg124w4",
      gType: "gauge",
      label: "라벨입니당",
      range: [0, 100],
      units: "%",
      color: "purple",
    },
    states: {
      value: 34,
    },
  };

  const [currentValue, setCurrentValue] = useState(1);
  const [currentLabel, setCurrentLabel] = useState("");

  useEffect(() => {
    setCurrentValue(exampleData.states.value);
    setCurrentLabel(exampleData.node.label);
  }, []);

  // TODO: width, height 전달

  return (
    <>
      <Gauge
        value={currentValue}
        width={200}
        height={160}
        label={currentLabel}
        color={mainColor[exampleData.node.color]}
        topLabelStyle={{ fontSize: fontSize.md, fontFamily: "Pretendard-Bold", fill: fontColor.light }}
        valueLabelStyle={{ fontSize: fontSize.xl, fontFamily: "Pretendard-Regular", fill: fontColor.light }}
        minMaxLabelStyle={{ fontSize: fontSize.sm, fontFamily: "Pretendard-Regular", fill: fontColor.light }}
        valueFormatter={value => `${value}${exampleData.node.units}`}
      />
    </>
  );
};

export default SoopNormalGauge;
