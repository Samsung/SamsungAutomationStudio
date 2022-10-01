import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { fontSize, fontColor } from "../assets/DesignOption";

// FIXME: mode에 따른 색상변경 있음
// FIXME: Layout에 따른 배치 변경 있음
const flexOption = [
  ["row", "flex-start"],
  ["row", "flex-end"],
  ["row", "space-between"],
  ["row", "space-evenly"],
  ["column", "center"],
];

const height = 48; // FIXME: 추후 그리드 사이즈에 맞게 바뀔것, width도 마찬가지

const BoardTextContainer = styled.div`
  position: absolute;
  top: 30px;
  display: flex;
  flex-direction: ${props => flexOption[props.layout][0]};
  justify-content: ${props => flexOption[props.layout][1]};
  align-items: center;
  width: 100%;
  height: ${height}px;
  font-size: ${props => props.fontSize}px;
  color: ${fontColor.light};
  padding: 5px 10px;
  box-sizing: border-box;
`;

const BoardTextLabel = styled.div`
  margin: 0px;
`;

const BoardTextValue = styled.div`
  margin: 0px;
  font-family: "Pretendard-Bold";
`;

const SoopText = () => {
  const [currentLabel, setCurrentLabel] = useState("");
  const [currentValue, setCurrentValue] = useState("");

  const exampleData = {
    label: "라벨이당",
    format: "{{msg.payload}}",
    layout: 4,
    fontSize: 16,
    value: "보여지는 값입니다.",
    states: [{ value: "payload" }],
  };

  useEffect(() => {
    if (Array.isArray(exampleData.states) && exampleData.states[0]) {
      setCurrentValue(exampleData.states[0].value);
    } else {
      setCurrentValue(exampleData.value);
    }
    setCurrentLabel(exampleData.label);

    // node, states
  }, []);

  return (
    <>
      <BoardTextContainer fontSize={exampleData.fontSize} layout={exampleData.layout}>
        <BoardTextLabel>
          <span>{currentLabel}</span>
        </BoardTextLabel>
        <BoardTextValue>
          <span>{currentValue}</span>
        </BoardTextValue>
      </BoardTextContainer>
    </>
  );
};

export default SoopText;
