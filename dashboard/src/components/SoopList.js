import React, { useState } from "react";
import styled from "styled-components";
import { fontColor, fontSize } from "../assets/DesignOption";

const ListContainer = styled.div`
  position: absolute;
  top: 30px;

  width: 100%;
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

const SoopList = () => {
  // FIXME: 전역 상태로 변경
  const exampleData = {
    type: "checkbox",
    options: [{ value: "val1" }, { value: "val2" }],
    label: "라벨이당",
    tooltip: "툴팁이당",
  };
  const oC = Array.from({ length: exampleData.options.length }, () => false);
  const [optionChecked, setOptionChecked] = useState(oC);

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
        <ListContainer>
          <ol style={{ margin: 0 }}>
            {exampleData.options.map((item, idx) => {
              return <li key={idx}>{item.value}</li>;
            })}
          </ol>
        </ListContainer>
      );
    case "ul":
      return (
        <ListContainer>
          <ul style={{ margin: 0 }}>
            {exampleData.options.map((item, idx) => {
              return <li key={idx}>{item.value}</li>;
            })}
          </ul>
        </ListContainer>
      );
    case "checkbox":
      return (
        <ListContainer>
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
