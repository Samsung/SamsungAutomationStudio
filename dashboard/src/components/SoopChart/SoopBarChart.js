import React, { useState, useEffect } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import styled from "styled-components";
import {
  mainColor,
  fontSize,
  fontColor,
  gradientColor,
} from "../../assets/DesignOption";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const BarChartContainer = styled.div`
  width: 500px;
  height: 400px;
`;

const SoopBarChart = () => {
  const [chartData, setChartData] = useState({
    datasets: [],
  });
  const [chartOptions, setChartOptions] = useState({});

  useEffect(() => {
    setChartData({
      labels: ["January", "February", "March", "April", "May", "June", "July"],
      datasets: [
        {
          label: "data 1",
          data: [21, 55, 43, 21, 270, 111, 54],
          borderColor: mainColor.blue,
          backgroundColor: mainColor.blue,
        },
        {
          label: "data 2",
          data: [132, 55, 34, 120, 720, 111, 454],
          borderColor: mainColor.pink,
          backgroundColor: mainColor.pink,
        },
      ],
    });
    setChartOptions({
      responsive: true,
      plugins: {
        // 제목 변경
        title: {
          display: true,
          text: "SoopDashboard Bar Chart",
          color: fontColor.light,
          font: {
            family: "Pretendard-Bold",
            size: fontSize.lg,
          },
        },
        // 범례 변경
        legend: {
          position: "top",
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
    });
  }, []);

  return (
    <>
      <BarChartContainer>
        <Bar options={chartOptions} data={chartData} />
      </BarChartContainer>
    </>
  );
};

export default SoopBarChart;
