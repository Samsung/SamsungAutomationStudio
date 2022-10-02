import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { fontSize, fontColor } from "../assets/DesignOption";
import { calculateHeight, calculateWidth, calculateLeft, calculateTop } from "../assets/DesignOption";

const flexOption = [
  ["row", "flex-start"],
  ["row", "flex-end"],
  ["row", "space-between"],
  ["row", "space-evenly"],
  ["column", "center"],
];

const BoardTextContainer = styled.div`
  position: absolute;
  left: ${({ layout }) => `${layout[0]}px;`}
  top: ${({ layout }) => `${layout[1]}px;`}
  display: flex;
  flex-direction: ${({ textLayout }) => flexOption[textLayout][0]};
  justify-content: ${({ textLayout }) => flexOption[textLayout][1]};
  align-items: center;
  width: ${({ layout }) => `${layout[2]}px;`}
  height:${({ layout }) => `${layout[3]}px;`}
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

const SoopText = props => {
  const { currentGroupW, currentGroupWidth, currentGroupH } = props;

  const [currentLabel, setCurrentLabel] = useState("");
  const [currentValue, setCurrentValue] = useState("");

  const exampleData = {
    label: "라벨이당",
    format: "{{msg.payload}}",
    widgetX: 0,
    widgetY: 0,
    width: 2,
    height: 1,
    layout: 4,
    fontSize: 16,
    value: "보여지는 값입니다.",
    states: [{ value: "payload" }],
  };

  const layout = [
    calculateLeft(exampleData.widgetX, currentGroupWidth, currentGroupW),
    calculateTop(exampleData.widgetY),
    calculateWidth(exampleData.width, currentGroupWidth, currentGroupW),
    calculateHeight(exampleData.height, currentGroupH),
  ];

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
      <BoardTextContainer fontSize={exampleData.fontSize} textLayout={exampleData.layout} layout={layout}>
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
