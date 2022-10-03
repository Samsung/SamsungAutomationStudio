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
    return `${objectFit};`;
  }}}
  border-radius: ${({ isFull }) => isFull && `10px;`}
`;

const SoopImage = ({ currentGroupW, currentGroupWidth, currentGroupH, node }) => {
  const layout = [
    calculateLeft(parseInt(node?.widgetX), currentGroupWidth, currentGroupW),
    calculateTop(parseInt(node?.widgetY)),
    calculateWidth(parseInt(node?.width), currentGroupWidth, currentGroupW),
    calculateHeight(parseInt(node?.height), currentGroupH),
  ];
  const isFull = parseInt(node?.width) === currentGroupW && parseInt(node?.height) === currentGroupH ? true : false;

  switch (node?.option) {
    case "upload":
      return (
        <Image isFull={isFull} layout={layout} src={`data:image/jpg;base64,${node?.uploads}`} objectFit={node?.fit} />
      );
    case "link":
      return <Image isFull={isFull} layout={layout} src={node?.link} objectFit={node?.fit} />;
  }
};

export default SoopImage;
