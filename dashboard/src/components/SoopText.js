import React from "react";
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

const BoardText = styled.div`
  display: flex;
  flex-direction: ${flexOption[3][0]};
  justify-content: ${flexOption[3][1]};
  align-items: center;
  width: 200px;
  height: ${height}px;
  font-size: ${fontSize.md};
  color: ${fontColor.light};
  padding: 0;
  margin: 0;
`;

const BoardTextLabel = styled.div`
  margin: 0px 10px;
`;

const BoardTextValue = styled.div`
  margin: 0px 10px;
  font-family: "Pretendard-Bold";
`;

const SoopText = () => {
  return (
    <>
      <BoardText>
        <BoardTextLabel>
          <span>label</span>
        </BoardTextLabel>
        <BoardTextValue>
          <span>value</span>
        </BoardTextValue>
      </BoardText>
    </>
  );
};

export default SoopText;
