import React from "react";
import styled from "styled-components";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { easeQuadInOut } from "d3-ease";
import AnimatedProgressProvider from "./AnimatedProgressProvider";
import {
  mainColor,
  gradientColor,
  fontSize,
  fontColor,
} from "../../assets/DesignOption";

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
  const percentage = 80;
  const unit = "%%";
  const colorOption = "pink";
  const label = "라벨입니당";

  return (
    <>
      <DonutGaugeContainer>
        <DonutGaugeLabel>{label}</DonutGaugeLabel>
        <AnimatedProgressProvider
          valueStart={0}
          valueEnd={percentage}
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
                {unit.length === 1 ? (
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
                      {unit}
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
                    <div style={{ fontSize: fontSize.sm }}>{unit}</div>
                  </div>
                )}
                <CircularProgressbar
                  value={value}
                  styles={buildStyles({
                    pathTransition: "none",
                    // pathTransitionDuration: 1400,
                    // pathColor: mainColor.blue,
                    textColor: `${
                      mainColor[colorOption] + gradientColor[colorOption]
                    }`,
                  })}
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
