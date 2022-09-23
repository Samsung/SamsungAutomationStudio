import React from "react";
import styled from "styled-components";
import { mainColor, gradientColor, fontSize } from "../assets/DesignOption";

// FIXME: button shape: square, rounded-square, pill, circle
// border-radius - sq: 0px, rdsq: 5px, pill: height/2, circle: 100%
const height = 48; // FIXME: 추후 그리드 사이즈에 맞게 바뀔것, width도 마찬가지

const BoardButton = styled.button`
  background: linear-gradient(
    91.29deg,
    ${mainColor.blue} 0%,
    ${gradientColor.blue} 100%
  );
  width: 200px;
  height: ${height}px;
  font-size: ${fontSize.md};
  font-family: "Pretendard-Medium";
  color: white;
  padding: 0.25em 1em;
  border: 0px;
  border-radius: ${height / 2}px;
`;

const Button = () => {
  return (
    <>
      <BoardButton>이것은 Button노드</BoardButton>
    </>
  );
};

export default Button;
