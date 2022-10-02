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
  left: ${({ layout }) => `${layout[0]}px;`}
  top: ${({ layout }) => `${layout[1]}px;`}
  display: flex;
  justify-content: center;
  align-items: center;
  width: ${({ layout }) => `${layout[2]}px;`}
  height:${({ layout }) => `${layout[3]}px;`}
  padding: 5px 10px;
  box-sizing: border-box;
`;

const SoopDropdown = node => {
  const { currentGroupW, currentGroupWidth, currentGroupH } = node;

  const [selectedOption, setSelectedOption] = useState("");
  const [currentOptions, setCurrentOptions] = useState([]);
  const [currentLabel, setCurrentLabel] = useState("");
  const exampleData = {
    label: "dropdown라벨",
    tooltip: "툴팁",
    widgetX: 0,
    widgetY: 0,
    width: 1,
    height: 1,
    options: [
      { label: "val1", value: "0", type: "str" },
      { label: "val2", value: "1", type: "str" },
      { label: "val3", value: "2", type: "str" },
    ],
    states: [{}],
  };

  const layout = [
    calculateLeft(exampleData.widgetX, currentGroupWidth, currentGroupW),
    calculateTop(exampleData.widgetY),
    calculateWidth(exampleData.width, currentGroupWidth, currentGroupW),
    calculateHeight(exampleData.height, currentGroupH),
  ];

  const onChange = e => {
    setSelectedOption(e.target.value);
    // TODO: sendMessage 활성화하기
    sendMessage(node.id, { value: e.target.value });
  };

  // TODO: useEffect 활성화하기
  // useEffect(() => {
  //   const optionsArray = node.options.map(opt => {
  //     return opt.label;
  //   });
  //   if (Array.isArray(node.states) && states[0]) {
  //     setSelectedOption(node.states[0].key);
  //   }
  //   setCurrentOptions(optionsArray);
  //   setCurrentLabel(node.label);
  // }, [node, states]);

  return (
    <>
      <DropdownContainer layout={layout}>
        <FormControl fullWidth>
          <InputLabel id="soop-dashboard-select-label">{currentLabel}</InputLabel>
          <Select labelId="soop-dashboard-select-label" label={currentLabel} value={selectedOption} onChange={onChange}>
            {currentOptions.map((cOption, idx) => {
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
