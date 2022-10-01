import React from "react";
import styled from "styled-components";

// FIXME: x, y, w, h 계산하기
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
    tooltip: "This is Image Node",
    option: "link", //  upload, link
    resource: "https://item.kakaocdn.net/do/862539f7f2171437385154b3b749990f7154249a3890514a43687a85e6b6cc82",
    objectFit: "cover",
  };

  switch (exampleData.option) {
    case "upload":
      return <Image src={`data:image/jpg;base64,${exampleData.resource}`} objectFit={exampleData.objectFit} />;
    case "link":
      return <Image src={exampleData.resource} objectFit={exampleData.objectFit} />;
  }
};

export default SoopImage;
