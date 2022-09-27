import React from "react";
import SoopLiquidGauge from "./SoopGauge/SoopLiquidGauge";
import SoopDonutGauge from "./SoopGauge/SoopDonutGauge";
import SoopNormalGauge from "./SoopGauge/SoopNormalGauge";
import Sssss from "./SoopGauge/sssss";

const SoopGauge = () => {
  // FIXME: 넘겨받은 데이터에 따라서 return되는 component가 다르다
  const type = "donut";

  switch (type) {
    case "gauge":
      return <SoopNormalGauge />;
    case "donut":
      return <SoopDonutGauge />;
    case "liquid":
      return <SoopLiquidGauge />;
    // case "compass":
    //   return <GaugeCompass />;
    case "ssss":
      return <Sssss />;
  }
};

export default SoopGauge;
