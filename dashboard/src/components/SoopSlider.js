import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { Slider } from "@mui/material";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { mainColor, fontSize, fontColor } from "../assets/DesignOption";

const SliderContainer = styled.div`
  position: absolute;
  top: 100px;
  width: 300px;
  display: flex;
  color: ${fontColor.light};
  font-family: "Pretendard-Bold";
  font-size: ${fontSize.md};
`;

const SliderLabel = styled.div`
  display: inline-block;
  width: fit-content;
  margin: auto 10px;
`;

const SoopSlider = () => {
  const exampleData = {
    color: "pink",
    label: "This is Label!",
    tooltip: "slider_label",
    range: [0, 100, 5],
    when: "always",
    invert: false,
    payload: 50,
  };
  // FIXME: 현재 보이는 값 -> props에서 들어오는 것으로 수정해야 한다.
  const [value, setValue] = useState(exampleData.payload);

  const muiTheme = createTheme({
    palette: {
      primary: {
        main: mainColor[exampleData.color],
      },
    },
  });

  useEffect(() => {
    // TODO: value에서 변경이 생기면, socket통해서 runtime에도 전달해야 한다.
  }, []);

  return (
    <>
      <SliderContainer>
        <SliderLabel>{exampleData.label}</SliderLabel>
        <ThemeProvider theme={muiTheme}>
          <Slider
            value={value}
            aria-label="Default"
            valueLabelDisplay="auto"
            min={exampleData.range[0]}
            max={exampleData.range[1]}
            step={exampleData.range[2]}
            onChange={(_, value) => {
              setValue(value);
            }}
          />
        </ThemeProvider>
      </SliderContainer>
    </>
  );
};

export default SoopSlider;
