import React from "react";
import styled from "styled-components";
import { calculateHeight, calculateWidth, calculateLeft, calculateTop } from "../assets/DesignOption";

// FIXME: x, y, w, h 계산하기
const Image = styled.img`
position: absolute;
left: ${({ layout }) => `${layout[0]}px;`}
top: ${({ layout }) => `${layout[1]}px;`}
width: ${({ layout }) => `${layout[2]}px;`}
height:${({ layout }) => `${layout[3]}px;`}
  object-fit: ${({ objectFit }) => {
    return objectFit;
  }}}
  border-radius: ${({ isFull }) => isFull && `10px;`}
`;

const SoopImage = props => {
  const { currentGroupW, currentGroupWidth, currentGroupH } = props;

  const exampleData = {
    tooltip: "This is Image Node",
    widgetX: 0,
    widgetY: 0,
    width: 4,
    height: 4,
    option: "link", //  upload, link
    resource: "https://www.sjpost.co.kr/news/photo/202007/53199_48342_4214.jpg",
    objectFit: "cover",
  };

  const layout = [
    calculateLeft(exampleData.widgetX, currentGroupWidth, currentGroupW),
    calculateTop(exampleData.widgetY),
    calculateWidth(exampleData.width, currentGroupWidth, currentGroupW),
    calculateHeight(exampleData.height, currentGroupH),
  ];

  const isFull = exampleData.width === currentGroupW && exampleData.height === currentGroupH ? true : false;

  switch (exampleData.option) {
    case "upload":
      return (
        <Image
          isFull={isFull}
          layout={layout}
          src={`data:image/jpg;base64,${exampleData.resource}`}
          objectFit={exampleData.objectFit}
        />
      );
    case "link":
      return <Image isFull={isFull} layout={layout} src={exampleData.resource} objectFit={exampleData.objectFit} />;
  }
};

export default SoopImage;
