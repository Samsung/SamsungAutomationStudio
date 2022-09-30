import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { Slider } from "@mui/material";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { mainColor, fontSize, fontColor } from "../assets/DesignOption";

const SliderContainer = styled.div`
  width: 100%;
  padding: 5px 10px;
  box-sizing: border-box;
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

const SoopSlider = ({ node, states }) => {
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

  useEffect(() => {
    if (Array.isArray(states) && states[0]) {
      setValue(states[0].value);
    }
  }, [states]);

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
            min={node.min}
            max={node.max}
            step={node.step}
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
