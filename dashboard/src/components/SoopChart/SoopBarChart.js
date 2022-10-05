import React, { useState, useEffect } from "react";
import moment from "moment";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";
import { Bar } from "react-chartjs-2";
import { fontSize, fontColor } from "../../assets/DesignOption";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const SoopBarChart = ({ node }) => {
  const bgColor = [
    "rgba(17, 83, 252, 0.4)",
    "rgba(245, 182, 48, 0.4)",
    "rgba(253, 89, 136, 0.4)",
    "rgba(132, 67, 246, 0.4)",
    "rgba(9, 194, 141, 0.4)",
    "rgba(255, 135, 66, 0.4)",
  ];
  const bdColor = [
    "rgba(17, 83, 252, 1)",
    "rgba(245, 182, 48, 1)",
    "rgba(253, 89, 136, 1)",
    "rgba(132, 67, 246, 1)",
    "rgba(9, 194, 141, 1)",
    "rgba(255, 135, 66, 1)",
  ];

  const [chartData, setChartData] = useState({ datasets: [] });
  const [chartOptions, setChartOptions] = useState({});

  useEffect(() => {
    if (node?.isTimeSeries === "false") {
      const currentChartData = {
        labels: Object.keys(node?.states),
        datasets: [
          {
            label: "비중",
            data: Object.keys(node?.states)?.map(key => node?.states[key][0]?.value),
            backgroundColor: [
              "rgba(17, 83, 252, 0.4)",
              "rgba(245, 182, 48, 0.4)",
              "rgba(253, 89, 136, 0.4)",
              "rgba(132, 67, 246, 0.4)",
              "rgba(9, 194, 141, 0.4)",
              "rgba(255, 135, 66, 0.4)",
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
              size: fontSize.lg,
            },
          },
          legend: {
            display: node?.legend === "true" ? true : false,
            labels: {
              font: {
                family: "Pretendard-Regular",
                size: fontSize.md,
              },
              color: fontColor.light,
            },
          },
        },
        scales: {
          y: {
            min: node?.yMin,
            max: node?.yMax,
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
    } else {
      const currentDatasetsLabel = Object.keys(node?.states);
      const currentLabels = node?.states[currentDatasetsLabel[0]]?.map(data =>
        moment(data.time).format(node?.xAxisFormat),
      );
      const currentDatasets = Object.keys(node?.states)?.map((key, idx) => {
        return {
          label: key,
          data: node?.states[key]?.map(d => d.value),
          backgroundColor: bgColor[idx % 6],
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
                size: fontSize.md,
              },
              color: fontColor.light,
            },
          },
        },
        scales: {
          y: {
            min: node?.yMin,
            max: node?.yMax,
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
    }
  }, [node]);

  return (
    <>
      <Bar options={chartOptions} data={chartData} />
    </>
  );
};

export default SoopBarChart;
