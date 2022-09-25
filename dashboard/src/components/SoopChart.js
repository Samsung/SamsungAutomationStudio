import React from "react";
import SoopLineChart from "./SoopChart/SoopLineChart";
import SoopBarChart from "./SoopChart/SoopBarChart";
import SoopPieChart from "./SoopChart/SoopPieChart";

const SoopChart = () => {
  // FIXME: 넘겨받은 데이터에 따라서 return되는 component가 다르다
  const type = "pie";

  switch (type) {
    case "line":
      return <SoopLineChart />;
    case "bar":
      return <SoopBarChart />;
    case "pie":
      return <SoopPieChart />;
  }
};

export default SoopChart;
