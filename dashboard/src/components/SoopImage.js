import React from "react";
import styled from "styled-components";

const Image = styled.img`
  width: 200px;
  height: 250px;
  object-fit: ${({ objectFit }) => {
    return objectFit;
  }}}
`;

const SoopImage = () => {
  const exampleData = {
    tooltip: "This is Image Node",
    source: "link", //  upload, link
    upload: "???",
    link: "https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885__480.jpg",
    objectFit: "cover",
  };

  switch (exampleData.source) {
    case "upload":
      return <Image src="" objectFit={exampleData.objectFit} />;
    case "link":
      return <Image src={exampleData.link} objectFit={exampleData.objectFit} />;
  }
};

export default SoopImage;
