import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { easeQuadInOut } from "d3-ease";
import AnimatedProgressProvider from "./AnimatedProgressProvider";
import GradientSVG from "./GradientSVG";
import { fontSize, fontColor } from "../../assets/DesignOption";

const DonutGaugeWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 0 15px;
  box-sizing: border-box;
`;

const DonutGaugeLabel = styled.div`
  color: ${fontColor.light};
  font-size: ${fontSize.md};
  font-family: "Pretendard-Bold";
  margin-bottom: 3px;
`;

const DonutSizeWrapper = styled.div`
  width: ${({ radius }) => `${radius - 25}px;`};
`;

const SoopDonutGauge = ({ radius, node }) => {
  const [currentValue, setCurrentValue] = useState(1);
  const [currentLabel, setCurrentLabel] = useState("");
  const [range, setRange] = useState("");

  useEffect(() => {
    if (!node) return;
    if (Array.isArray(node?.states) && node?.states[0]) {
      setCurrentValue(node?.states[0].value);
    } else {
      setCurrentValue(node?.value);
    }
    setCurrentLabel(node?.label);
    setRange([parseInt(node?.min), parseInt(node?.max)]);
  }, [node]);

  return (
    <>
      <DonutGaugeWrapper>
        <DonutGaugeLabel>{currentLabel}</DonutGaugeLabel>
        <DonutSizeWrapper radius={radius}>
          <AnimatedProgressProvider
            valueStart={range[0]}
            valueEnd={currentValue}
            duration={1.4}
            easingFunction={easeQuadInOut}
          >
            {currentValue => {
              const roundedValue = Math.round(currentValue);
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
                  {node?.units.length === 1 ? (
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
                        {node?.units}
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
                      <div style={{ fontSize: fontSize.sm }}>{node?.units}</div>
                    </div>
                  )}
                  <CircularProgressbar
                    value={currentValue}
                    minValue={range[0]}
                    maxValue={range[1]}
                    strokeWidth="12"
                    styles={{
                      path: {
                        stroke: `url(#${node?.id})`,
                        height: "100%",
                      },
                    }}
                  ></CircularProgressbar>
                  <GradientSVG colorOption={node?.color} rotation={0} idCSS={node?.id} />
                </div>
              );
            }}
          </AnimatedProgressProvider>
        </DonutSizeWrapper>
      </DonutGaugeWrapper>
    </>
  );
};

export default SoopDonutGauge;
