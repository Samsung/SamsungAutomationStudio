import React, { useState } from "react";
import styled from "styled-components";
import { fontColor, fontSize } from "../assets/DesignOption";
import { calculateHeight, calculateWidth, calculateLeft, calculateTop } from "../assets/DesignOption";

const ListContainer = styled.div`
  position: absolute;
  left: ${({ layout }) => `${layout[0]}px;`}
  top: ${({ layout }) => `${layout[1]}px;`}
  width: ${({ layout }) => `${layout[2]}px;`}
  height:${({ layout }) => `${layout[3]}px;`}
  padding: 5px 10px;
  box-sizing: border-box;
  color: ${fontColor.light};
  font-size: ${fontSize.md};
`;

const ListWrapper = styled.div`
  display: flex;
  align-items: center;
  margin: 1px 0;
`;

const ListLabel = styled.span`
  text-decoration: ${({ optionChecked, idx }) => {
    if (optionChecked[idx]) return "line-through";
    else return "none";
  }};
  color: ${({ optionChecked, idx }) => {
    if (optionChecked[idx]) {
      return "#B3B7BC";
    }
  }};
`;

const SoopList = props => {
  const { currentGroupW, currentGroupWidth, currentGroupH } = props;

  // FIXME: 전역 상태로 변경
  const exampleData = {
    type: "checkbox",
    options: [{ value: "val1" }, { value: "val2" }],
    widgetX: 1,
    widgetY: 1,
    width: 1,
    height: 1,
    label: "라벨이당",
    tooltip: "툴팁이당",
  };
  const oC = Array.from({ length: exampleData.options.length }, () => false);
  const [optionChecked, setOptionChecked] = useState(oC);

  const layout = [
    calculateLeft(exampleData.widgetX, currentGroupWidth, currentGroupW),
    calculateTop(exampleData.widgetY),
    calculateWidth(exampleData.width, currentGroupWidth, currentGroupW),
    calculateHeight(exampleData.height, currentGroupH),
  ];

  const onClickCheck = idx => {
    const tmpChecked = optionChecked.map((opt, i) => {
      if (idx === i) {
        return !optionChecked[i];
      } else {
        return optionChecked[i];
      }
    });
    setOptionChecked(tmpChecked);
  };

  switch (exampleData.type) {
    case "ol":
      return (
        <ListContainer layout={layout}>
          <ol style={{ margin: 0 }}>
            {exampleData.options.map((item, idx) => {
              return <li key={idx}>{item.value}</li>;
            })}
          </ol>
        </ListContainer>
      );
    case "ul":
      return (
        <ListContainer layout={layout}>
          <ul style={{ margin: 0 }}>
            {exampleData.options.map((item, idx) => {
              return <li key={idx}>{item.value}</li>;
            })}
          </ul>
        </ListContainer>
      );
    case "checkbox":
      return (
        <ListContainer layout={layout}>
          {exampleData.options.map((item, idx) => {
            return (
              <div key={idx}>
                {optionChecked[idx] ? (
                  <ListWrapper>
                    <input
                      type="checkbox"
                      id={idx}
                      name={item.value}
                      defaultChecked
                      onClick={() => {
                        onClickCheck(idx);
                      }}
                    />
                    <ListLabel htmlFor={idx} idx={idx} optionChecked={optionChecked}>
                      {item.value}
                    </ListLabel>
                  </ListWrapper>
                ) : (
                  <ListWrapper>
                    <input
                      type="checkbox"
                      id={idx}
                      name={item.value}
                      onClick={() => {
                        onClickCheck(idx);
                      }}
                    />
                    <label htmlFor={idx}>{item.value}</label>
                  </ListWrapper>
                )}
              </div>
            );
          })}
        </ListContainer>
      );
  }
};

export default SoopList;
