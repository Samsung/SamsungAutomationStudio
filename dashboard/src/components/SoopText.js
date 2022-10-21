import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { fontColor } from "../assets/DesignOption";
import { calculateHeight, calculateWidth, calculateLeft, calculateTop } from "../assets/DesignOption";

const flexOption = [
  { direction: "row", justifyContent: "flex-start" },
  { direction: "row", justifyContent: "space-between" },
  { direction: "row", justifyContent: "space-evenly" },
  { direction: "row", justifyContent: "flex-end" },
  { direction: "column", justifyContent: "center" },
];

const BoardTextContainer = styled.div`
  position: absolute;
  left: ${({ layout }) => `${layout.LEFT}px;`}
  top: ${({ layout }) => `${layout.TOP}px;`}
  width: ${({ layout }) => `${layout.WIDTH}px;`}
  height:${({ layout }) => `${layout.HEIGHT}px;`}
  display: flex;
  flex-direction: ${({ textLayout }) => flexOption[textLayout].direction};
  justify-content: ${({ textLayout }) => flexOption[textLayout].justifyContent};
  align-items: center;
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

  const layout = {
    LEFT: calculateLeft(parseInt(node?.widgetX), currentGroupWidth, currentGroupW),
    TOP: calculateTop(parseInt(node?.widgetY), currentGroupH, nameVisible),
    WIDTH: calculateWidth(parseInt(node?.width), currentGroupWidth, currentGroupW),
    HEIGHT: calculateHeight(parseInt(node?.height), currentGroupH, nameVisible),
  };

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
