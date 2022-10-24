import React, { useState } from "react";
import styled from "styled-components";
import { fontColor, fontSize } from "../assets/DesignOption";
import { calculateHeight, calculateWidth, calculateLeft, calculateTop } from "../assets/DesignOption";

const ListContainer = styled.div`
  position: absolute;
  left: ${({ layout }) => `${layout.LEFT}px;`}
  top: ${({ layout }) => `${layout.TOP}px;`}
  width: ${({ layout }) => `${layout.WIDTH}px;`}
  height:${({ layout }) => `${layout.HEIGHT}px;`}
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

const SoopList = ({ currentGroupW, currentGroupWidth, currentGroupH, node, nameVisible }) => {
  const oC = Array.from({ length: node?.options.length }, () => false);
  const [optionChecked, setOptionChecked] = useState(oC);

  const layout = {
    LEFT: calculateLeft(parseInt(node?.widgetX), currentGroupWidth, currentGroupW),
    TOP: calculateTop(parseInt(node?.widgetY), currentGroupH, nameVisible),
    WIDTH: calculateWidth(parseInt(node?.width), currentGroupWidth, currentGroupW),
    HEIGHT: calculateHeight(parseInt(node?.height), currentGroupH, nameVisible),
  };

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

  switch (node?.listType) {
    case "ol":
      return (
        <ListContainer layout={layout}>
          <ol style={{ margin: 0 }}>
            {node &&
              Array.isArray(node.options) &&
              node.options.map((item, idx) => {
                return <li key={idx}>{item.value}</li>;
              })}
          </ol>
        </ListContainer>
      );
    case "ul":
      return (
        <ListContainer layout={layout}>
          <ul style={{ margin: 0 }}>
            {node?.options.map((item, idx) => {
              return <li key={idx}>{item.value}</li>;
            })}
          </ul>
        </ListContainer>
      );
    case "checkbox":
      return (
        <ListContainer layout={layout}>
          {node &&
            Array.isArray(node.options) &&
            node?.options.map((item, idx) => {
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
