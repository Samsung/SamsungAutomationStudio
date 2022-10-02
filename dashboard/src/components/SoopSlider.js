import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { Slider } from "@mui/material";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { mainColor, fontSize, fontColor } from "../assets/DesignOption";
import { sendMessage } from "../utils/socket";

// TODO: exampleData -> props
// TODO: x, y, w, h에서 받아오면 계산하기
// TODO: top, left 옵션줘서 위치 배정하기, 그룹제목이 기본 30px
const SliderContainer = styled.div`
  width: 100%;
  padding: 5px 10px;
  box-sizing: border-box;
  position: absolute;
  top: 100px;
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

const SEND_TYPE = {
  ALWAYS: "always",
  RELEASE: "release",
};

const SoopSlider = ({ node, states }) => {
  console.log(node);
  const exampleData = {
    color: "purple",
    label: "This is Label!",
    tooltip: "slider_label",
    when: "always",
    invert: false,
    states: [{ value: 50 }],
  };

  // FIXME: 현재 보이는 값 -> props에서 들어오는 것으로 수정해야 한다.
  const [value, setValue] = useState("");

  useEffect(() => {
    if (Array.isArray(states) && states[0]) {
      setValue(states[0].value);
    }
  }, [states]);

  const muiTheme = createTheme({
    palette: {
      primary: {
        main: mainColor[node.colorPicking],
      },
    },
  });

  function onChangeCommitted(e, v) {
    if (node.send == SEND_TYPE.RELEASE) sendMessage(node.id, { value: v });
  }

  function onChangeValue(e, v) {
    setValue(v);
    if (node.send == SEND_TYPE.ALWAYS) sendMessage(node.id, { value: v });
  }

  return (
    <>
      <SliderContainer>
        <SliderLabel>{node.label}</SliderLabel>
        <ThemeProvider theme={muiTheme}>
          <Slider
            value={value}
            aria-label="Default"
            valueLabelDisplay="auto"
            min={node.min}
            max={node.max}
            step={node.step}
            onChange={onChangeValue}
            onChangeCommitted={onChangeCommitted}
          />
        </ThemeProvider>
      </SliderContainer>
    </>
  );
};

export default SoopSlider;
