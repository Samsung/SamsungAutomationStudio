import React, { useState } from "react";
import styled from "styled-components";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";

const DropdownContainer = styled.div`
  width: 200px;
`;

const SoopDropdown = () => {
  const [option, setOption] = useState("");

  const exampleData = {
    label: "dropdown",
    tooltip: "dropdown node",
    placeholder: "Select option",
    option: { option1: "value1", option2: "value2" },
  };
  const entries = Object.entries(exampleData.option);

  const onChange = (e) => {
    // FIXME: 현재 value로만 변경값이 저장되는데.. key는 어떻게 해야할지 허허
    console.log(e.target.value);
    setOption(e.target.value);
  };
  return (
    <>
      <DropdownContainer>
        <FormControl fullWidth>
          <InputLabel id="soop-dashboard-select-label">
            {exampleData.label}
          </InputLabel>
          <Select
            labelId="soop-dashboard-select-label"
            label={exampleData.placeholder}
            value={option}
            onChange={onChange}
          >
            {entries.map((entry, idx) => {
              return (
                <MenuItem key={idx} value={entry[1]}>
                  {entry[1]}
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
