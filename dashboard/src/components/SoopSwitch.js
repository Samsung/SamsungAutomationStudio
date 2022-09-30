import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { mainColor, groupColor, fontColor, fontSize } from "../assets/DesignOption";
import { sendMessage } from "../utils/socket";
import useUpdateHook from "../hooks/UpdateHook";

// TODO: exampleData -> props
// TODO: x, y, w, h에서 받아오면 계산하기
// TODO: top, left 옵션줘서 위치 배정하기

const SwitchContainer = styled.div`
  position: absolute;
  top: 50px;
  width: 100%;
  padding: 5px 10px;
  box-sizing: border-box;
  display: flex;
  justify-content: space-between;
  aligh-items: center;
`;

const SwitchLabel = styled.div`
  color: ${fontColor.light};
  font-size: ${fontSize.md};
  font-family: "Pretendard-Bold";
  margin: 15px auto;
`;

const SwitchWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

const SwitchInput = styled.input`
  position: absolute;

  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;

  &:checked + .switch_area {
    background: ${mainColor.pink};
  }

  &:checked + .switch_area .switch_handle {
    left: 36px;
  }
`;

const SwitchArea = styled.label`
  position: relative;
  cursor: pointer;
  display: inline-block;
  width: 60px;
  height: 27px;
  border-radius: 14px;

  background: #d9d9d9;

  transition: 0.2s;
`;

const SwitchHandle = styled.span`
  position: absolute;
  top: 3px;
  left: 3px;
  display: inline-block;
  width: 21px;
  height: 21px;
  border-radius: 20px;
  background: ${groupColor.light};
  transition: 0.2s;
`;

const SoopSwitch = props => {
  const [switchState, setSwitchState] = useState(false);

  useUpdateHook(() => {
    sendMessage(props.nodeId, { switchState });
  }, [switchState]);

  function onSwitchChange(e) {
    setSwitchState(!switchState);
  }

  return (
    <SwitchContainer>
      <SwitchLabel>스위치 노드</SwitchLabel>
      <SwitchWrapper>
        <SwitchInput type="checkbox" id={`switch-${props.nodeId}`} checked={switchState} onChange={onSwitchChange} />
        <SwitchArea htmlFor={`switch-${props.nodeId}`} className="switch_area">
          <SwitchHandle className="switch_handle"></SwitchHandle>
        </SwitchArea>
      </SwitchWrapper>
    </SwitchContainer>
  );
};

export default SoopSwitch;
