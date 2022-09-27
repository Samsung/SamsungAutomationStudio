import React from "react";
import Gauge from "react-svg-gauge";
import { mainColor } from "../../assets/DesignOption";

const SoopNormalGauge = () => {
  // TODO: props로 value 받기
  const value = 10;
  const label = "Label";

  // TODO: 크기 비율: 5*4

  return (
    <>
      <Gauge
        value={value}
        width={200}
        height={160}
        label={label}
        color={mainColor.blue}
      />
    </>
  );
};

export default SoopNormalGauge;
