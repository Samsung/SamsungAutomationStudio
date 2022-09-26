import React, { useState } from "react";
import styled from "styled-components";
import { fontColor, fontSize } from "../assets/DesignOption";

const ListContainer = styled.div`
  color: ${fontColor.light};
  font-size: ${fontSize.md};
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
    option: ["value1", "value2"],
    checked: [true, false],
    label: "라벨이당",
    tooltip: "툴팁이당",
  };
  const [optionChecked, setOptionChecked] = useState(exampleData.checked);

  const onClickCheck = (idx) => {
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
    case "ordered":
      return (
        <ListContainer>
          <ol>
            {exampleData.option.map((item, idx) => {
              return <li key={idx}>{item}</li>;
            })}
          </ol>
        </ListContainer>
      );
    case "unordered":
      return (
        <ListContainer>
          <ul>
            {exampleData.option.map((item, idx) => {
              return <li key={idx}>{item}</li>;
            })}
          </ul>
        </ListContainer>
      );
    case "checkbox":
      return (
        <ListContainer>
          {exampleData.option.map((item, idx) => {
            return (
              <div key={idx}>
                {optionChecked[idx] ? (
                  <>
                    <input
                      type="checkbox"
                      id={idx}
                      name={item}
                      defaultChecked
                      onClick={() => {
                        onClickCheck(idx);
                      }}
                    />
                    <ListLabel
                      htmlFor={idx}
                      idx={idx}
                      optionChecked={optionChecked}
                    >
                      {item}
                    </ListLabel>
                  </>
                ) : (
                  <>
                    <input
                      type="checkbox"
                      id={idx}
                      name={item}
                      onClick={() => {
                        onClickCheck(idx);
                      }}
                    />
                    <label htmlFor={idx}>{item}</label>
                  </>
                )}
              </div>
            );
          })}
        </ListContainer>
      );
  }
};

export default SoopList;
