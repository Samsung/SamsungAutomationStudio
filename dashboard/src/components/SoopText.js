import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { fontColor } from "../assets/DesignOption";
import { calculateHeight, calculateWidth, calculateLeft, calculateTop } from "../assets/DesignOption";

const flexOption = [
  ["row", "flex-start"],
  ["row", "space-between"],
  ["row", "space-evenly"],
  ["row", "flex-end"],
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

const SoopText = ({ currentGroupW, currentGroupWidth, currentGroupH, node, nameVisible }) => {
  const [currentLabel, setCurrentLabel] = useState("");
  const [currentValue, setCurrentValue] = useState("");

  const layout = [
    calculateLeft(parseInt(node?.widgetX), currentGroupWidth, currentGroupW),
    calculateTop(parseInt(node?.widgetY), currentGroupH, nameVisible),
    calculateWidth(parseInt(node?.width), currentGroupWidth, currentGroupW),
    calculateHeight(parseInt(node?.height), currentGroupH, nameVisible),
  ];

  useEffect(() => {
    if (Array.isArray(node?.states) && node?.states[0]) {
      const state = node.states[0];
      if (state.label) setCurrentLabel(state.label);
      else setCurrentLabel(node.label);
      if (state.value) setCurrentValue(state.value);
      else setCurrentValue(node.value);
    } else {
      setCurrentValue(node?.value);
      setCurrentLabel(node?.label);
    }
  }, [node]);

  return (
    <>
      <BoardTextContainer fontSize={node?.fontSize} textLayout={node?.layout} layout={layout}>
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
