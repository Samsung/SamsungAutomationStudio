import React, { useState } from "react";
import styled from "styled-components";
import { sendMessage } from "../utils/socket";
import { mainColor, gradientColor, fontSize } from "../assets/DesignOption";

// TODO: exampleData -> props
// TODO: x, y, w, h에서 받아오면 계산하기
// TODO: top, left 옵션줘서 위치 배정하기
const height = 48; // FIXME: 추후 그리드 사이즈에 맞게 바뀔것, width도 마찬가지

const ButtonContainer = styled.div`
  position: absolute;
  top: 100px;

  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  padding: 5px 10px;
  box-sizing: border-box;
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
  height: ${height}px;
  font-size: ${fontSize.md};
  font-family: "Pretendard-Medium";
  color: white;
  padding: 0.25em 1em;
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
  width: 100px;
  height: 100px;
  font-size: ${fontSize.md};
  font-family: "Pretendard-Medium";
  color: white;
  padding: 0.25em;
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
  const exampleData = {
    nodeId: "abcde",
    w: 2,
    h: 1,
    label: "SAMSUNG",
    background: "green",
    shape: "rectangle",
    tooltip: "button node",
  };

  return (
    <>
      <ButtonContainer>
        {exampleData.shape === "circle" ? (
          <ButtonCircle onClick={sendMessage(exampleData.nodeId)} exampleData={exampleData}>
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
