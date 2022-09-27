import React from "react";
import styled from "styled-components";
import { fontSize, fontColor } from "../assets/DesignOption";

const Group = styled.div`
  width: 300px;
  height: 200px;
  border-radius: 10px;
  filter: drop-shadow(0px 0px 20px rgba(0, 0, 0, 0.05));
  background-color: white;
`;

const GroupName = styled.div`
  width: 100%;
  height: 30px;
  display: flex;
  align-items: center;
  box-sizing: border-box;
  border-radius: 10px;
  font-family: "Pretendard-Bold";
  font-size: ${fontSize.md};
  color: ${fontColor.light};
  padding: 3px 10px;
`;

const SoopGroup = () => {
  // TODO: 노드 그룹 정보들을 받아오면 그룹의 설정에 따라서 변경이 가능하다.
  // 그리고 노드의 렌더링도 여기서 해야한다... ㅠㅜㅠㅜ
  const nameHidden = false;

  return (
    <Group>
      {!nameHidden && <GroupName>그룹입니당</GroupName>}
      <div>1</div>
      <div>2</div>
    </Group>
  );
};

export default SoopGroup;
