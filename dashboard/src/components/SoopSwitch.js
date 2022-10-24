import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { mainColor, groupColor, fontColor, fontSize } from "../assets/DesignOption";
import { sendMessage } from "../utils/socket";
import useUpdateHook from "../hooks/UpdateHook";
import { calculateHeight, calculateWidth, calculateLeft, calculateTop } from "../assets/DesignOption";

const SwitchContainer = styled.div`
  position: absolute;
  left: ${({ layout }) => `${layout.LEFT}px;`}
  top: ${({ layout }) => `${layout.TOP}px;`}
  width: ${({ layout }) => `${layout.WIDTH}px;`}
  height:${({ layout }) => `${layout.HEIGHT}px;`}
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

const SoopSwitch = ({ currentGroupW, currentGroupWidth, currentGroupH, node, nameVisible }) => {
  const [switchState, setSwitchState] = useState(false);

  const layout = {
    LEFT: calculateLeft(parseInt(node?.widgetX), currentGroupWidth, currentGroupW),
    TOP: calculateTop(parseInt(node?.widgetY), currentGroupH, nameVisible),
    WIDTH: calculateWidth(parseInt(node?.width), currentGroupWidth, currentGroupW),
    HEIGHT: calculateHeight(parseInt(node?.height), currentGroupH, nameVisible),
  };

  useUpdateHook(() => {
    sendMessage(node?.id, { switchState });
  }, [switchState]);

  useEffect(() => {
    const newState = node?.states[0]?.switchState ? node.states[0].switchState : switchState;
    setSwitchState(newState);
  }, [node]);

  function onSwitchChange(e) {
    setSwitchState(!switchState);
  }

  return (
    <SwitchContainer layout={layout}>
      <SwitchLabel>{node?.label}</SwitchLabel>
      <SwitchWrapper>
        <SwitchInput
          type="checkbox"
          id={`switch-${node?.id}`}
          checked={switchState}
          onChange={onSwitchChange}
          switchColor={node?.background}
        />
        <SwitchArea htmlFor={`switch-${node?.id}`} className="switch_area">
          <SwitchHandle className="switch_handle"></SwitchHandle>
        </SwitchArea>
      </SwitchWrapper>
    </SwitchContainer>
  );
};

export default SoopSwitch;
