import React, { useState, useEffect } from "react";
import styled from "styled-components";
import SoopGroup from "./SoopGroup";
import { Responsive as ResponsiveGridLayout } from "react-grid-layout";
import { withSize } from "react-sizeme";
import { useDispatch, useSelector } from "react-redux";
import { updateGrid } from "../utils/store";
import useUpdateEffect from "../hooks/UpdateHook";

const GridContainer = styled.div`
  height: 700px;
  over-flow: hidden;

  &:active {
    cursor: grabbing !important;
  }
`;

const GridItem = styled.div`
  cursor: ${({ isEditing }) => isEditing && "grab"};

  &:active {
    ${({ isEditing }) => isEditing && "curr: grabbing"};
  }
`;

const SoopGrid = ({ size: { width }, isEditing, tab }) => {
  const { groups } = tab;
  const dispatch = useDispatch();
  const tabsGrid = useSelector(state => state.tabsGrid);

  const initialGroupGrid = Array.isArray(groups)
    ? groups.map(group => {
        return {
          i: group.groupId,
          w: parseInt(group.width),
          h: parseInt(group.height),
          x: parseInt(group.groupX),
          y: parseInt(group.groupY),
          static: !isEditing,
        };
      })
    : [];
  const [layouts, setLayouts] = useState({ lg: initialGroupGrid });

  const onLayoutChange = (_, allLayouts) => {
    setLayouts(allLayouts);
  };

  useEffect(() => {
    if (!!tabsGrid[tab.tabId]) {
      const currentLayouts = tabsGrid[tab.tabId];
      setLayouts(currentLayouts);
    }
  }, []);

  useUpdateEffect(() => {
    const currentLayouts = layouts.lg.map(item => {
      return { ...item, static: !isEditing };
    });
    setLayouts({ lg: currentLayouts });
    dispatch(updateGrid({ lg: currentLayouts }, tab.tabId));
  }, [isEditing]);

  return (
    <GridContainer>
      <ResponsiveGridLayout
        className="layout"
        layouts={layouts}
        breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
        cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
        rowHeight={75}
        width={width}
        onLayoutChange={onLayoutChange}
        compactType="vertical"
        containerPadding={[20, 0]}
      >
        {Array.isArray(groups) &&
          groups.map((group, index) => (
            <GridItem key={group.groupId} className="widget" data-grid={layouts.lg[index]} isEditing={isEditing}>
              <SoopGroup group={group} index={index} />
            </GridItem>
          ))}
      </ResponsiveGridLayout>
    </GridContainer>
  );
};

export default withSize({ refreshMode: "debounce", refreshRate: 60 })(SoopGrid);
