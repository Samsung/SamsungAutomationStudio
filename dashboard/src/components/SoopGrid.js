import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import SoopGroup from "./SoopGroup";
import { Responsive as ResponsiveGridLayout } from "react-grid-layout";
import { withSize } from "react-sizeme";

const GridContainer = styled.div`
  height: 700px;
  over-flow: hidden;

  &:active {
    cursor: grabbing !important;
  }
`;

/** 노드가 들어간 그룹이 있다.
 * cursor 형태도 지정
 */
const GridItem = styled.div`
  cursor: ${({ isEditing }) => {
    if (isEditing) {
      return "grab";
    }
  }};

  &:active {
    ${({ isEditing }) => {
      if (isEditing) {
        return "cursor: grabbing";
      }
    }};
  }
`;

const SoopGrid = ({ size: { width }, isEditing }) => {
  const { tabId } = useParams();
  console.log(tabId);
  const originalItems = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j"];

  const initialLayouts = {
    lg: [
      { i: "a", x: 0, y: 0, w: 1, h: 4, static: !isEditing },
      { i: "b", x: 1, y: 0, w: 3, h: 4, static: !isEditing },
      { i: "c", x: 4, y: 0, w: 1, h: 4, static: !isEditing },
      { i: "d", x: 5, y: 0, w: 2, h: 4, static: !isEditing },
      { i: "e", x: 7, y: 0, w: 5, h: 4, static: !isEditing },
      { i: "f", x: 0, y: 4, w: 1, h: 4, static: !isEditing },
      { i: "g", x: 1, y: 4, w: 3, h: 4, static: !isEditing },
      { i: "h", x: 4, y: 4, w: 1, h: 4, static: !isEditing },
      { i: "i", x: 5, y: 4, w: 2, h: 4, static: !isEditing },
      { i: "j", x: 7, y: 4, w: 5, h: 4, static: !isEditing },
    ],
  };

  const [items, setItems] = useState(originalItems);
  const [layouts, setLayouts] = useState(initialLayouts);

  const onLayoutChange = (_, allLayouts) => {
    setLayouts(allLayouts);
  };

  useEffect(() => {
    const currentLayouts = layouts.lg.map(item => {
      return { ...item, static: !isEditing };
    });
    setLayouts({ lg: currentLayouts });
  }, [isEditing]);

  // FIXME: localStorage에 저장하기
  // const onLayoutSave = () => {
  //   saveToLS("layouts", layouts);
  // };

  return (
    <GridContainer>
      <ResponsiveGridLayout
        className="layout"
        layouts={layouts}
        breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
        cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
        rowHeight={60}
        maxRows={10}
        width={width}
        onLayoutChange={onLayoutChange}
        compactType="horizontal"
        containerPadding={[20, 0]}
        static={true}
      >
        {items.map(key => (
          <GridItem key={key} className="widget" data-grid={{ w: 3, h: 2, x: 0, y: 0 }} isEditing={isEditing}>
            <SoopGroup />
          </GridItem>
        ))}
      </ResponsiveGridLayout>
    </GridContainer>
  );
};

export default withSize({ refreshMode: "debounce", refreshRate: 60 })(SoopGrid);

// FIXME: LocalStorage에서 가져오기
// const [layouts, setLayouts] = useState(getFromLS("layouts") || initialLayouts);
// function getFromLS(key) {
//   let ls = {};
//   if (global.localStorage) {
//     try {
//       ls = JSON.parse(global.localStorage.getItem("rgl-8")) || {};
//     } catch (e) {}
//   }
//   return ls[key];
// }

// FIXME: LocalStorage에 저장하기
// function saveToLS(key, value) {
//   if (global.localStorage) {
//     global.localStorage.setItem(
//       "rgl-8",
//       JSON.stringify({
//         [key]: value,
//       }),
//     );
//   }
// }
