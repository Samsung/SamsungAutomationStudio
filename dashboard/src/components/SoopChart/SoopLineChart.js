import React, { useState, useEffect } from "react";
import moment from "moment";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { fontSize, fontColor } from "../../assets/DesignOption";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const SoopLineChart = ({ node }) => {
  const bdColor = [
    "rgba(17, 83, 252, 0.8)",
    "rgba(245, 182, 48, 0.8)",
    "rgba(253, 89, 136, 0.8)",
    "rgba(132, 67, 246, 0.8)",
    "rgba(9, 194, 141, 0.8)",
    "rgba(255, 135, 66, 0.8)",
  ];

  const [chartData, setChartData] = useState({ datasets: [] });
  const [chartOptions, setChartOptions] = useState({});

  useEffect(() => {
    if (node && !node?.states) return;
    const currentDatasetsLabel = Object.keys(node?.states);

    if (!Array.isArray(currentDatasetsLabel) || !Array.isArray(node?.states[currentDatasetsLabel[0]])) return;
    /** currentLabels mean x-axis values */
    const currentLabels = node?.states[currentDatasetsLabel[0]]?.map(data =>
      moment(data?.time).format(node?.xAxisFormat),
    );

    /** currentDatasets mean y-axis values */
    const currentDatasets = Object.keys(node?.states)?.map((key, idx) => {
      return {
        label: key,
        data: node?.states[key]?.map(d => d.value),
        backgroundColor: bdColor[idx % 6],
        borderColor: bdColor[idx % 6],
        borderWidth: 1,
      };
    });

    const currentChartData = {
      labels: currentLabels,
      datasets: currentDatasets,
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
      scales: {
        y: {
          min: parseInt(node?.yMin),
          max: parseInt(node?.yMax),
          ticks: {
            font: {
              family: "Pretendard-Light",
              size: fontSize.sm,
              color: fontColor.light,
            },
          },
        },
        x: {
          ticks: {
            font: {
              family: "Pretendard-Light",
              size: fontSize.sm,
              color: fontColor.light,
            },
          },
        },
      },
    };
    setChartData(currentChartData);
    setChartOptions(currentChartOptions);
  }, [node]);

  return (
    <>
      <Line options={chartOptions} data={chartData} />
    </>
  );
};

export default SoopLineChart;
