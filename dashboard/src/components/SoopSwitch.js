import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { mainColor, groupColor, fontColor, fontSize } from "../assets/DesignOption";
import { sendMessage } from "../utils/socket";
import useUpdateHook from "../hooks/UpdateHook";
import { calculateHeight, calculateWidth, calculateLeft, calculateTop } from "../assets/DesignOption";

// TODO: exampleData -> props
// TODO: x, y, w, h에서 받아오면 계산하기
// TODO: top, left 옵션줘서 위치 배정하기

const SwitchContainer = styled.div`
  position: absolute;
  left: ${({ layout }) => `${layout[0]}px;`}
  top: ${({ layout }) => `${layout[1]}px;`}
  width: ${({ layout }) => `${layout[2]}px;`}
  height:${({ layout }) => `${layout[3]}px;`}
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
  margin: auto;
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
    background: ${({ switchColor }) => mainColor[switchColor]};
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
  const { currentGroupW, currentGroupWidth, currentGroupH } = props;
  const [switchState, setSwitchState] = useState(false);

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

  useUpdateHook(() => {
    sendMessage(node.id, { switchState });
  }, [switchState]);

  function onSwitchChange(e) {
    setSwitchState(!switchState);
  }

  return (
    <SwitchContainer layout={layout}>
      <SwitchLabel>{exampleData.label}</SwitchLabel>
      <SwitchWrapper>
        <SwitchInput
          type="checkbox"
          id={`switch-${exampleData.nodeId}`}
          checked={switchState}
          onChange={onSwitchChange}
          switchColor={exampleData.background}
        />
        <SwitchArea htmlFor={`switch-${exampleData.nodeId}`} className="switch_area">
          <SwitchHandle className="switch_handle"></SwitchHandle>
        </SwitchArea>
      </SwitchWrapper>
    </SwitchContainer>
  );
};

export default SoopSwitch;
