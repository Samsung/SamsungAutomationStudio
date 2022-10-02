import React from "react";
import styled from "styled-components";
import { sendMessage } from "../utils/socket";
import { mainColor, gradientColor, fontSize } from "../assets/DesignOption";
import { calculateHeight, calculateWidth, calculateLeft, calculateTop } from "../assets/DesignOption";

const ButtonContainer = styled.div`
  position: absolute;
  left: ${({ layout }) => `${layout[0]}px;`}
  top: ${({ layout }) => `${layout[1]}px;`}
  width: ${({ layout }) => `${layout[2]}px;`}
  height:${({ layout }) => `${layout[3]}px;`}
  padding: 5px 10px;
  box-sizing: border-box;
  display: flex;
  justify-content: center;
  align-items: center;
  `;

const Button = styled.button`
  background: linear-gradient(
    91.29deg,
    ${props => {
      return mainColor[props.exampleData.background];
    }}
      0%,
    ${props => {
      return gradientColor[props.exampleData.background];
    }}
      100%
  );
  width: 100%;
  height: 100%;
  font-size: ${fontSize.md};
  font-family: "Pretendard-Medium";
  color: white;
  border: 0px;

  border-radius: ${props => {
    switch (props.exampleData.shape) {
      case "rectangle":
        return "0px;";
      case "rounded-rectangle":
        return "5px;";
      case "pill":
        return `${height / 2}px;`;
      case "circle":
        return "100%;";
    }
  }}

  &:hover {
    cursor: pointer;
    box-shadow: 0px 15px 25px -5px rgba(darken(dodgerblue, 40%));
    transform: scale(1.01);
  }

  &:active {
    box-shadow: 0px 4px 8px rgba(darken(dodgerblue, 30%));
    transform: scale(0.99);
  }
`;

const ButtonCircle = styled.button`
  background: linear-gradient(
    91.29deg,
    ${props => {
      return mainColor[props.exampleData.background];
    }}
      0%,
    ${props => {
      return gradientColor[props.exampleData.background];
    }}
      100%
  );
  width: ${({ radius }) => `${radius - 1}px;`}
  height: ${({ radius }) => `${radius - 1}px;`}
  font-size: ${fontSize.md};
  font-family: "Pretendard-Medium";
  color: white;
  border: 0px;
  border-radius: 100%;

  &:hover {
    cursor: pointer;
    box-shadow: 0px 15px 25px -5px rgba(darken(dodgerblue, 40%));
    transform: scale(1.01);
  }

  &:active {
    box-shadow: 0px 4px 8px rgba(darken(dodgerblue, 30%));
    transform: scale(0.99);
  }
`;

const SoopButton = props => {
  const { currentGroupW, currentGroupWidth, currentGroupH } = props;
  const exampleData = {
    nodeId: "abcde",
    widgetX: 0,
    widgetY: 0,
    width: 1,
    height: 1,
    label: "SAM",
    background: "green",
    shape: "circle",
    tooltip: "button node",
  };

  const layout = [
    calculateLeft(exampleData.widgetX, currentGroupWidth, currentGroupW),
    calculateTop(exampleData.widgetY),
    calculateWidth(exampleData.width, currentGroupWidth, currentGroupW),
    calculateHeight(exampleData.height, currentGroupH),
  ];

  return (
    <>
      <ButtonContainer layout={layout}>
        {exampleData.shape === "circle" ? (
          <ButtonCircle
            onClick={sendMessage(exampleData.nodeId)}
            exampleData={exampleData}
            radius={Math.min(layout[2], layout[3])}
          >
            {exampleData.label}
          </ButtonCircle>
        ) : (
          <Button onClick={sendMessage(exampleData.nodeId)} exampleData={exampleData}>
            {exampleData.label}
          </Button>
        )}
      </ButtonContainer>
    </>
  );
};

export default SoopButton;
