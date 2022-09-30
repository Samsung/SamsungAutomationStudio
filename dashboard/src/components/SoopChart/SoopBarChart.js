import React, { useState, useEffect } from "react";
import moment from "moment";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";
import { Bar } from "react-chartjs-2";
import { mainColor, fontSize, fontColor, gradientColor } from "../../assets/DesignOption";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const SoopBarChart = () => {
  const bgColor = [
    "rgba(17, 83, 252, 0.4)",
    "rgba(245, 182, 48, 0.4)",
    "rgba(253, 89, 136, 0.4)",
    "rgba(132, 67, 246, 0.4)",
    "rgba(9, 194, 141, 0.4)",
  ];
  const bdColor = [
    "rgba(17, 83, 252, 1)",
    "rgba(245, 182, 48, 1)",
    "rgba(253, 89, 136, 1)",
    "rgba(132, 67, 246, 1)",
    "rgba(9, 194, 141, 1)",
  ];
  const exampleData = {
    node: {
      title: "bar timeseries chart",
      chartType: "bar",
      legend: true,
      blankLabel: "no data",
      xAxisFormat: "HH:mm:ss",
      yMin: 0,
      yMax: 5,
      isTimeSeriesData: true,
    },
    id: "노드의 id",
    states: {
      // TODO: nontime 버전
      // 냉장고: [{ value: 1 }],
      // 에어컨: [{ value: 3 }],
      // TV: [{ value: 3 }],
      // 사과: [{ value: 1 }],
      // 바나나: [{ value: 3 }],
      // TODO: time 버전
      냉장고: [
        { value: 1, time: 1664544739836 },
        { value: 2, time: 1664545142444 },
        { value: 1, time: 1664545186484 },
        { value: 2, time: 1664545206079 },
        { value: 2, time: 1664545216475 },
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
        { value: 0, time: 1664545206079 },
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

  const timeSeries = Date.now();
  const timeseriesToDateMoment = moment(timeSeries).format(exampleData.node.xAxisFormat);
  console.log("moment 변환", timeseriesToDateMoment);

  // TODO: bar nontime ver.
  // states의 key가 labels가 된다.?

  useEffect(() => {
    if (!exampleData.node.isTimeSeriesData) {
      const currentChartData = {
        labels: Object.keys(exampleData.states),
        datasets: [
          {
            label: "비중",
            data: Object.keys(exampleData.states).map(key => exampleData.states[key][0].value),
            backgroundColor: [
              "rgba(17, 83, 252, 0.4)",
              "rgba(245, 182, 48, 0.4)",
              "rgba(253, 89, 136, 0.4)",
              "rgba(132, 67, 246, 0.4)",
              "rgba(9, 194, 141, 0.4)",
            ],
            borderColor: [
              "rgba(17, 83, 252, 1)",
              "rgba(245, 182, 48, 1)",
              "rgba(253, 89, 136, 1)",
              "rgba(132, 67, 246, 1)",
              "rgba(9, 194, 141, 1)",
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
            text: exampleData.node.title,
            color: fontColor.light,
            font: {
              family: "Pretendard-Bold",
              size: fontSize.lg,
            },
          },
          // 범례 변경
          legend: {
            display: exampleData.node.legend,
            labels: {
              font: {
                family: "Pretendard-Regular",
                size: fontSize.md,
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
    } else {
      const currentDatasetsLabel = Object.keys(exampleData.states);
      const currentLabels = exampleData.states[currentDatasetsLabel[0]].map(data =>
        moment(data.time).format(exampleData.node.xAxisFormat),
      );
      const currentDatasets = Object.keys(exampleData.states).map((key, idx) => {
        return {
          label: key,
          data: exampleData.states[key].map(d => d.value),
          backgroundColor: bgColor[idx % 5],
          borderColor: bdColor[idx % 5],
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
                size: fontSize.md,
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
    }
  }, []);

  return (
    <>
      <Bar options={chartOptions} data={chartData} />
    </>
  );
};

export default SoopBarChart;
