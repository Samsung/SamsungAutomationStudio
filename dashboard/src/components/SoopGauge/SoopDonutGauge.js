import React from "react";
import styled from "styled-components";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { easeQuadInOut } from "d3-ease";
import AnimatedProgressProvider from "./AnimatedProgressProvider";
import GradientSVG from "./GradientSVG";
import { fontSize, fontColor } from "../../assets/DesignOption";

const DonutGaugeContainer = styled("div")({
  width: "160px",
  height: "200px",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  margin: 0,
});

const DonutGaugeLabel = styled.div`
  color: ${fontColor.light};
  font-size: ${fontSize.md};
  font-family: "Pretendard-Bold";
  margin: 15px auto;
`;

const SoopDonutGauge = () => {
  // FIXME: card 크기로 수정
  const exampleData = {
    nodeId: "dfg124w4",
    gType: "donut",
    label: "라벨입니당",
    // format : {{value}}, TODO: 이미 노드의 JS영역에서 처리되어 value로 올것
    range: [0, 100],
    value: 100,
    units: "%%%",
    color: "blue",
  };

  return (
    <>
      <DonutGaugeContainer>
        <DonutGaugeLabel>{exampleData.label}</DonutGaugeLabel>
        <AnimatedProgressProvider
          valueStart={0}
          valueEnd={exampleData.value}
          duration={1.4}
          easingFunction={easeQuadInOut}
        >
          {(value) => {
            const roundedValue = Math.round(value);
            return (
              <div
                style={{
                  position: "relative",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                {exampleData.units.length === 1 ? (
                  <div
                    style={{
                      color: fontColor.light,
                      position: "absolute",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      alignItems: "center",
                      fontSize: fontSize.xl,
                      marginTop: -5,
                    }}
                  >
                    <strong>
                      {roundedValue}
                      {exampleData.units}
                    </strong>
                  </div>
                ) : (
                  <div
                    style={{
                      color: fontColor.light,
                      position: "absolute",
                      marginTop: -5,
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <div
                      style={{
                        color: fontColor.light,
                        fontSize: fontSize.xl,
                        fontFamily: "Pretendard-Bold",
                      }}
                    >
                      {roundedValue}
                    </div>
                    <div style={{ fontSize: fontSize.sm }}>
                      {exampleData.units}
                    </div>
                  </div>
                )}
                <CircularProgressbar
                  value={value}
                  strokeWidth="12"
                  styles={
                    // buildStyles({
                    // pathTransition: "none",
                    // pathTransitionDuration: 1400,
                    // pathColor: mainColor.blue,
                    // textColor: `${
                    //   mainColor[colorOption] + gradientColor[colorOption]
                    // }`,

                    // }),
                    {
                      path: {
                        stroke: `url(#${exampleData.nodeId})`,
                        height: "100%",
                      },
                    }
                  }
                ></CircularProgressbar>
                <GradientSVG
                  colorOption={exampleData.color}
                  rotation={0}
                  idCSS={exampleData.nodeId}
                />
              </div>
            );
          }}
        </AnimatedProgressProvider>
      </DonutGaugeContainer>
    </>
  );
};

export default SoopDonutGauge;
