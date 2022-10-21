import React, { useState, useEffect } from "react";
import styled from "styled-components";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { sendMessage } from "../utils/socket";
import { calculateHeight, calculateWidth, calculateLeft, calculateTop } from "../assets/DesignOption";

const DropdownContainer = styled.div`
  position: absolute;
  left: ${({ layout }) => `${layout.LEFT}px;`}
  top: ${({ layout }) => `${layout.TOP}px;`}
  width: ${({ layout }) => `${layout.WIDTH}px;`}
  height:${({ layout }) => `${layout.HEIGHT}px;`}
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 5px 10px;
  box-sizing: border-box;
`;

const SoopDropdown = ({ currentGroupW, currentGroupWidth, currentGroupH, node, nameVisible }) => {
  const [selectedOption, setSelectedOption] = useState("");
  const [currentOptions, setCurrentOptions] = useState([]);
  const [currentLabel, setCurrentLabel] = useState("");

  const layout = {
    LEFT: calculateLeft(parseInt(node?.widgetX), currentGroupWidth, currentGroupW),
    TOP: calculateTop(parseInt(node?.widgetY), currentGroupH, nameVisible),
    WIDTH: calculateWidth(parseInt(node?.width), currentGroupWidth, currentGroupW),
    HEIGHT: calculateHeight(parseInt(node?.height), currentGroupH, nameVisible),
  };

  const onChange = e => {
    setSelectedOption(e.target.value);
    sendMessage(node?.id, { value: e.target.value });
  };

  useEffect(() => {
    const optionsArray = node?.options.map(opt => {
      return opt.label;
    });
    if (Array.isArray(node?.states) && node?.states[0]) {
      setSelectedOption(node?.states[0].value);
    }
    setCurrentOptions(optionsArray);
    setCurrentLabel(node?.label);
  }, [node]);

  return (
    <>
      <DropdownContainer layout={layout}>
        <FormControl fullWidth>
          <InputLabel id="soop-dashboard-select-label">{currentLabel}</InputLabel>
          <Select labelId="soop-dashboard-select-label" label={currentLabel} value={selectedOption} onChange={onChange}>
            {Array.isArray(currentOptions) &&
              currentOptions.map((cOption, idx) => {
                return (
                  <MenuItem key={idx} value={idx}>
                    {cOption}
                  </MenuItem>
                );
              })}
          </Select>
        </FormControl>
      </DropdownContainer>
    </>
  );
};

export default SoopDropdown;
