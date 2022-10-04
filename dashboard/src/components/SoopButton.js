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
      return mainColor[props?.node?.background];
    }}
      0%,
    ${props => {
      return gradientColor[props?.node?.background];
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
    switch (props?.node?.shape) {
      case "rectangle":
        return "0px;";
      case "rounded-rectangle":
        return "5px;";
      case "pill":
        return `${props?.layout[3] / 2}px;`;
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
      return mainColor[props?.node?.background];
    }}
      0%,
    ${props => {
      return gradientColor[props?.node?.background];
    }}
      100%
  );
  width: ${({ radius }) => `${radius - 5}px;`}
  height: ${({ radius }) => `${radius - 5}px;`}
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

const SoopButton = ({ currentGroupW, currentGroupWidth, currentGroupH, node, nameVisible }) => {
  const layout = [
    calculateLeft(parseInt(node?.widgetX), currentGroupWidth, currentGroupW),
    calculateTop(parseInt(node?.widgetY), currentGroupH, nameVisible),
    calculateWidth(parseInt(node?.width), currentGroupWidth, currentGroupW),
    calculateHeight(parseInt(node?.height), currentGroupH, nameVisible),
  ];

  return (
    <>
      <ButtonContainer layout={layout}>
        {node?.shape === "circle" ? (
          <ButtonCircle onClick={sendMessage(node?.id)} node={node} radius={Math.min(layout[2], layout[3])}>
            {node?.label}
          </ButtonCircle>
        ) : (
          <Button onClick={sendMessage(node?.id)} node={node} layout={layout}>
            {node?.label}
          </Button>
        )}
      </ButtonContainer>
    </>
  );
};

export default SoopButton;
