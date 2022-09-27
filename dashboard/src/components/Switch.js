import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { mainColor, groupColor } from "../assets/DesignOption";
import { sendMessage } from "../utils/socket";

const SwitchWrapper = styled.div`
  position: relative;
`;

const SwitchInput = styled.input`
  position: absolute;

  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;

  &:checked + #switch_area {
    background: ${mainColor.blue};
  }

  &:checked + #switch_area #switch_handle {
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

const Switch = props => {
  const [switchState, setSwitchState] = useState(false);

  useEffect(() => {
    sendMessage(props.id, { switchState });
  }, [switchState]);

  function onSwitchChange(e) {
    setSwitchState(!switchState);
  }

  return (
    <SwitchWrapper>
      <SwitchInput type="checkbox" id="switch" checked={switchState} onChange={onSwitchChange} />
      <SwitchArea htmlFor="switch" id="switch_area">
        <SwitchHandle id="switch_handle"></SwitchHandle>
      </SwitchArea>
    </SwitchWrapper>
  );
};

export default Switch;
