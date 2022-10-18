import React, { useState, useEffect } from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie } from "react-chartjs-2";
import { fontSize, fontColor } from "../../assets/DesignOption";

ChartJS.register(ArcElement, Tooltip, Legend);

const SoopPieChart = ({ node }) => {
  const [chartData, setChartData] = useState({ datasets: [] });
  const [chartOptions, setChartOptions] = useState({});

  useEffect(() => {
    const currentChartData = {
      labels: Object.keys(node?.states),
      datasets: [
        {
          label: "# of Votes",
          data: Object.keys(node?.states)?.map(key => node?.states[key][0].value),
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
        title: {
          display: true,
          text: node?.title,
          color: fontColor.light,
          font: {
            family: "Pretendard-Bold",
            size: fontSize.md,
          },
        },
        legend: {
          display: node?.legend === "true" ? true : false,
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
  }, [node]);

  return (
    <>
      <Pie options={chartOptions} data={chartData} />
    </>
  );
};

export default SoopPieChart;
