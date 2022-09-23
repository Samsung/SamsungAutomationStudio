import React, { useState, useEffect } from "react";
import { Box, Slider } from "@mui/material";
import styled from "styled-components";
// import { mainColor, gradientColor, fontSize } from "../assets/DesignOption";

const BoardSlider = styled(Slider)({
  // TODO: MUI createTheme 활용해서 수정하기
  // color: mainColor.orange,
});

const SoopSlider = () => {
  const defaultValue = 40; // FIXME: 현재 보이는 값 -> props에서 들어오는 것으로 수정해야 한다.
  const [value, setValue] = useState(defaultValue);

  useEffect(() => {
    // TODO: props에서 변경이 생기면 slider에서도 변경이 되어야 한다!
    // setValue()
  }, []);

  return (
    <>
      <Box width={300}>
        <BoardSlider
          color="secondary"
          value={value}
          aria-label="Default"
          valueLabelDisplay="auto"
          onChange={(_, value) => {
            console.log(value);
            setValue(value);
          }}
        />
      </Box>
    </>
  );
};

export default SoopSlider;
