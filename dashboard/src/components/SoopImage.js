import React from "react";
import styled from "styled-components";

const Image = styled.img`
  width: 100%;
  height: 100%;
  object-fit: ${({ objectFit }) => {
    return objectFit;
  }}}
  border-radius: 10px;
`;

const SoopImage = () => {
  const exampleData = {
    node: {
      tooltip: "This is Image Node",
      source: "link", //  upload, link
      upload: "???",
      link: "https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885__480.jpg",
      objectFit: "cover",
    },
    states: {},
  };

  switch (exampleData.node.source) {
    case "upload":
      return <Image src="" objectFit={exampleData.node.objectFit} />;
    case "link":
      return <Image src={exampleData.node.link} objectFit={exampleData.node.objectFit} />;
  }
};

export default SoopImage;
