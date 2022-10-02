import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { Slider } from "@mui/material";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { mainColor, fontSize, fontColor } from "../assets/DesignOption";
import { sendMessage } from "../utils/socket";
import { calculateHeight, calculateWidth, calculateLeft, calculateTop } from "../assets/DesignOption";

const SliderContainer = styled.div`
  position: absolute;
  width: ${({ layout }) => `${layout[2]}px;`}
  height:${({ layout }) => `${layout[3]}px;`}
  padding: 5px 10px;
  box-sizing: border-box;
  left: ${({ layout }) => `${layout[0]}px;`}
  top: ${({ layout }) => `${layout[1]}px;`}
  display: flex;
  align-items: center;
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

const SoopSlider = props => {
  const { currentGroupW, currentGroupWidth, currentGroupH } = props;

  const exampleData = {
    color: "purple",
    label: "This is Label!",
    tooltip: "slider_label",
    when: "always",
    invert: false,
    widgetX: 1,
    widgetY: 1,
    width: 2,
    height: 1,
    states: [{ value: 50 }],
  };

  const layout = [
    calculateLeft(exampleData.widgetX, currentGroupWidth, currentGroupW),
    calculateTop(exampleData.widgetY),
    calculateWidth(exampleData.width, currentGroupWidth, currentGroupW),
    calculateHeight(exampleData.height, currentGroupH),
  ];

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
      <SliderContainer layout={layout}>
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
            onChangeCommitted={onChangeCommitted}
          />
        </ThemeProvider>
      </SliderContainer>
    </>
  );
};

export default SoopSlider;
