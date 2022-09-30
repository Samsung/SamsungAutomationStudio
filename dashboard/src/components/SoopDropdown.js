import React, { useState, useEffect } from "react";
import styled from "styled-components";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { sendMessage } from "../utils/socket";

// TODO: exampleData -> props
// TODO: x, y, w, h에서 받아오면 계산하기
// TODO: top, left 옵션줘서 위치 배정하기
const DropdownContainer = styled.div`
  position: absolute;
  top: 30px;

  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  padding: 5px 10px;
  box-sizing: border-box;
`;

const SoopDropdown = () => {
  const [selectedOption, setSelectedOption] = useState("");
  const [currentOptions, setCurrentOptions] = useState([]);
  const [currentLabel, setCurrentLabel] = useState("");

  const exampleData = {
    node: {
      label: "dropdown라벨",
      tooltip: "dropdown node",
      placeholder: "Select option",
      option: { option1: "value1", option2: "value2" },
    },
    states: {},
  };

  const onChange = e => {
    setSelectedOption(e.target.value);
    // TODO: sendMessage 활성화하기
    // sendMessage(node.id, { value: option });
  };

  useEffect(() => {
    const optionsArray = Object.entries(exampleData.node.option);
    setCurrentOptions(optionsArray);
    setCurrentLabel(exampleData.node.label);
  }, []);

  return (
    <>
      <DropdownContainer>
        <FormControl fullWidth>
          <InputLabel id="soop-dashboard-select-label">{currentLabel}</InputLabel>
          <Select labelId="soop-dashboard-select-label" label={currentLabel} value={selectedOption} onChange={onChange}>
            {currentOptions.map((cOption, idx) => {
              return (
                <MenuItem key={idx} value={cOption[0]}>
                  {cOption[1]}
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
