import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { Slider } from "@mui/material";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { mainColor, fontSize, fontColor } from "../assets/DesignOption";
import { sendMessage } from "../utils/socket";

const SliderContainer = styled.div`
  width: 100%;
  padding: 5px 10px;
  box-sizing: border-box;
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

  function onChangeCommited(e, v) {
    setValue(v);
    sendMessage(node.id, { value: v });
  }

  function onChangeValue(e, v) {
    setValue(v);
  }

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
            onChange={onChangeValue}
            onChangeCommitted={onChangeCommited}
          />
        </ThemeProvider>
      </SliderContainer>
    </>
  );
};

export default SoopSlider;
