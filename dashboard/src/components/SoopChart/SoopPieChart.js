import React, { useState, useEffect } from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie } from "react-chartjs-2";
import { fontSize, fontColor } from "../../assets/DesignOption";

ChartJS.register(ArcElement, Tooltip, Legend);
// FIXME: width, height 둘 중 작은 것을 기준으로 제작이 되게!!
// FIXME: width, height 둘 중 작은 것을 기준으로 제작이 되게!!

// FIXME: props로 넘어오게 될 것.
// FIXME: 나중에 받을 때 {node, states}로 구조분해할당받기
const SoopPieChart = () => {
  const exampleData = {
    title: "pie chart",
    chartType: "pie",
    cutout: 0,
    legend: true,
    blankLabel: "no data",
    id: "노드의 id",
    states: {
      냉장고: [{ value: 1 }],
      에어컨: [{ value: 3 }],
      TV: [{ value: 3 }],
      사과: [{ value: 1 }],
      바나나: [{ value: 3 }],
      키위: [{ value: 3 }],
    },
  };

  // TODO: props.states로 올때는 종속성 배열에 넣어놓아도 무한루프 안빠질것이다 허허 ㅠㅜ
  const [chartData, setChartData] = useState({ datasets: [] });
  const [chartOptions, setChartOptions] = useState({});

  useEffect(() => {
    const currentChartData = {
      labels: Object.keys(exampleData.states),
      datasets: [
        {
          label: "# of Votes",
          data: Object.keys(exampleData.states).map(key => exampleData.states[key][0].value),
          backgroundColor: [
            "rgba(17, 83, 252, 0.2)",
            "rgba(245, 182, 48, 0.2)",
            "rgba(253, 89, 136, 0.2)",
            "rgba(132, 67, 246, 0.2)",
            "rgba(9, 194, 141, 0.2)",
            "rgba(255, 135, 66, 0.2)",
          ],
          borderColor: [
            "rgba(17, 83, 252, 1)",
            "rgba(245, 182, 48, 1)",
            "rgba(253, 89, 136, 1)",
            "rgba(132, 67, 246, 1)",
            "rgba(9, 194, 141, 1)",
            "rgba(255, 135, 66, 1)",
          ],
          borderWidth: 1,
        },
      ],
    };
    const currentChartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        // 제목 변경
        title: {
          display: true,
          text: exampleData.title,
          color: fontColor.light,
          font: {
            family: "Pretendard-Bold",
            size: fontSize.md,
          },
        },
        //범례 변경
        legend: {
          display: exampleData.legend,
          // position: "top",
          labels: {
            font: {
              family: "Pretendard-Regular",
              size: fontSize.sm,
            },
            color: fontColor.light,
          },
        },
      },
    };
    setChartData(currentChartData);
    setChartOptions(currentChartOptions);
  }, []);

  return (
    <>
      <Pie options={chartOptions} data={chartData} />
    </>
  );
};

export default SoopPieChart;
