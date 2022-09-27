import React, { useState, useEffect } from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie } from "react-chartjs-2";
import styled from "styled-components";
import { fontSize, fontColor } from "../../assets/DesignOption";

ChartJS.register(ArcElement, Tooltip, Legend);

const PieChartContainer = styled.div`
  width: 400px;
  height: 400px;
`;

const SoopPieChart = () => {
  const [chartData, setChartData] = useState({
    datasets: [],
  });
  const [chartOptions, setChartOptions] = useState({});

  useEffect(() => {
    setChartData({
      labels: ["January", "February", "March", "April", "May", "June", "July"],
      datasets: [
        {
          label: "# of Votes",
          data: [12, 19, 3, 5, 2, 3],
          backgroundColor: [
            "rgba(255, 99, 132, 0.2)",
            "rgba(54, 162, 235, 0.2)",
            "rgba(255, 206, 86, 0.2)",
            "rgba(75, 192, 192, 0.2)",
            "rgba(153, 102, 255, 0.2)",
            "rgba(255, 159, 64, 0.2)",
          ],
          borderColor: [
            "rgba(255, 99, 132, 1)",
            "rgba(54, 162, 235, 1)",
            "rgba(255, 206, 86, 1)",
            "rgba(75, 192, 192, 1)",
            "rgba(153, 102, 255, 1)",
            "rgba(255, 159, 64, 1)",
          ],
          borderWidth: 1,
        },
      ],
    });
    setChartOptions({
      responsive: true,
      plugins: {
        // 제목 변경
        title: {
          display: true,
          text: "SoopDashboard Pie Chart",
          color: fontColor.light,
          font: {
            family: "Pretendard-Bold",
            size: fontSize.lg,
          },
        },
        //범례 변경
        legend: {
          display: false,
          // position: "top",
          // labels: {
          //   font: {
          //     family: "Pretendard-Regular",
          //     size: fontSize.sm,
          //   },
          //   color: fontColor.light,
          // },
        },
      },
    });
  }, []);

  return (
    <>
      <PieChartContainer>
        <Pie options={chartOptions} data={chartData} />
      </PieChartContainer>
    </>
  );
};

export default SoopPieChart;
