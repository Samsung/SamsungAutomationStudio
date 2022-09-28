import React, { useState, useEffect } from "react";
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

const SoopGrid = ({ size: { width }, isEditing, tab }) => {
  const initialGroupGrid = tab.groups.map((group, idx) => {
    return {
      i: group.groupId,
      w: group.w,
      h: group.h,
      x: group.x,
      y: group.y,
      static: !isEditing,
    };
  });
  console.log("초기 그리드", initialGroupGrid);
  const initialLayouts = {
    lg: initialGroupGrid,
  };
  const [layouts, setLayouts] = useState(initialLayouts);

  const onLayoutChange = (_, allLayouts) => {
    setLayouts(allLayouts);
  };

  useEffect(() => {
    const currentLayouts = layouts.lg.map(item => {
      return { ...item, static: !isEditing };
    });
    setLayouts({ lg: currentLayouts });
    console.log("저장된 그리드", layouts);
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
        width={width}
        onLayoutChange={onLayoutChange}
        compactType="vertical"
        containerPadding={[20, 0]}
      >
        {tab.groups.map((group, index) => (
          <GridItem key={group.groupId} className="widget" data-grid={layouts.lg[index]} isEditing={isEditing}>
            <SoopGroup group={group} />
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
