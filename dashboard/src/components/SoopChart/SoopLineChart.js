import React, { useState, useEffect } from "react";
import moment from "moment";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale, // 1. import를 한다.
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { fontSize, fontColor } from "../../assets/DesignOption";

// 2. 등록을 한다.
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const SoopLineChart = () => {
  const bdColor = [
    "rgba(17, 83, 252, 0.8)",
    "rgba(245, 182, 48, 0.8)",
    "rgba(253, 89, 136, 0.8)",
    "rgba(132, 67, 246, 0.8)",
    "rgba(9, 194, 141, 0.8)",
    "rgba(255, 135, 66, 0.8)",
  ];
  const exampleData = {
    node: {
      title: "bar timeseries chart",
      chartType: "bar",
      legend: true,
      blankLabel: "no data",
      xAxisFormat: "HH:mm:ss",
      yMin: 0,
      yMax: 10,
      isTimeSeriesData: true,
    },
    id: "노드의 id",
    states: {
      냉장고: [
        { value: 1, time: 1664544739836 },
        { value: 2, time: 1664545142444 },
        { value: 3, time: 1664545186484 },
        { value: 6, time: 1664545206079 },
        { value: 8, time: 1664545216475 },
      ],
      에어컨: [
        { value: 1, time: 1664544739836 },
        { value: 3, time: 1664545142444 },
        { value: 4, time: 1664545186484 },
        { value: 5, time: 1664545206079 },
        { value: 3, time: 1664545216475 },
      ],
      TV: [
        { value: 4, time: 1664544739836 },
        { value: 2, time: 1664545142444 },
        { value: 2, time: 1664545186484 },
        { value: 8, time: 1664545206079 },
        { value: 1, time: 1664545216475 },
      ],
      사과: [
        { value: 3, time: 1664544739836 },
        { value: 1, time: 1664545142444 },
        { value: 1, time: 1664545186484 },
        { value: 5, time: 1664545206079 },
        { value: 1, time: 1664545216475 },
      ],
      바나나: [
        { value: 0, time: 1664544739836 },
        { value: 1, time: 1664545142444 },
        { value: 1, time: 1664545186484 },
        { value: 2, time: 1664545206079 },
        { value: 1, time: 1664545216475 },
      ],
      키위: [
        { value: 1, time: 1664544739836 },
        { value: 2, time: 1664545142444 },
        { value: 3, time: 1664545186484 },
        { value: 4, time: 1664545206079 },
        { value: 5, time: 1664545216475 },
      ],
    },
  };
  const [chartData, setChartData] = useState({ datasets: [] });
  const [chartOptions, setChartOptions] = useState({});

  useEffect(() => {
    const currentDatasetsLabel = Object.keys(exampleData.states);
    const currentLabels = exampleData.states[currentDatasetsLabel[0]].map(data =>
      moment(data.time).format(exampleData.node.xAxisFormat),
    );
    const currentDatasets = Object.keys(exampleData.states).map((key, idx) => {
      return {
        label: key,
        data: exampleData.states[key].map(d => d.value),
        backgroundColor: bdColor[idx % 6],
        borderColor: bdColor[idx % 6],
        borderWidth: 1,
      };
    });
    console.log("지금저장된 datasets", currentDatasets);
    const currentChartData = {
      labels: currentLabels,
      datasets: currentDatasets,
    };
    const currentChartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        // 제목 변경
        title: {
          display: true,
          text: exampleData.node.title,
          color: fontColor.light,
          font: {
            family: "Pretendard-Bold",
            size: fontSize.md,
          },
        },
        // 범례 변경
        legend: {
          display: exampleData.node.legend,
          labels: {
            font: {
              family: "Pretendard-Regular",
              size: fontSize.sm,
            },
            color: fontColor.light,
          },
        },
      },
      // 축 변경
      scales: {
        y: {
          min: exampleData.node.yMin,
          max: exampleData.node.yMax,
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
  }, []);

  return (
    <>
      <Line options={chartOptions} data={chartData} />
    </>
  );
};

export default SoopLineChart;
