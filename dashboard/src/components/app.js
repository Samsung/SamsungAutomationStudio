import React, { useEffect, useState } from "react";
import SoopGrid from "./SoopGrid";
import SoopNavbar from "./SoopNavbar";
import { initlaizeSocket, disconnectSocket } from "../utils/socket";
import "./App.css";
import { useDispatch, useSelector } from "react-redux";

const App = () => {
  const dispatch = useDispatch();
  const dashboard = useSelector(state => state.dashboard);
  const [isEditing, setIsEditing] = useState(false);
  const [currentTab, setCurrentTab] = useState(0);
  const [tabs, setTabs] = useState([]);

  const handleIsEditing = data => {
    setIsEditing(data);
  };
  const handleCurrentTab = tabIdx => {
    setCurrentTab(tabIdx);
  };

  useEffect(() => {
    initlaizeSocket(dispatch);

    return () => {
      disconnectSocket();
    };
  }, []);

  useEffect(() => {
    if (dashboard && Array.isArray(dashboard.tabs)) setTabs(dashboard.tabs);
  }, [dashboard]);

  return (
    <>
      <SoopNavbar
        isEditing={isEditing}
        handleIsEditing={handleIsEditing}
        currentTab={currentTab}
        handleCurrentTab={handleCurrentTab}
        tabs={tabs}
      />

      {tabs.map((tab, idx) => {
        if (currentTab === idx) {
          return <SoopGrid key={tab.tabId} isEditing={isEditing} tab={tab} />;
        }
      })}
    </>
  );
};

export default App;
