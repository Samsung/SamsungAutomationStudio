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
    // console.log(dashboard);
  }, [dashboard]);

  return (
    <>
      {Object.keys(dashboard).length !== 0 ? (
        <>
          <SoopNavbar
            isEditing={isEditing}
            handleIsEditing={handleIsEditing}
            currentTab={currentTab}
            handleCurrentTab={handleCurrentTab}
            dashboard={dashboard}
          />

          {dashboard.tabs.map((tab, idx) => {
            if (currentTab === idx) {
              // console.log(tab);
              return <SoopGrid key={tab.tabId} isEditing={isEditing} tab={tab} />;
            }
          })}
        </>
      ) : (
        <></>
      )}
    </>
  );
};

export default App;
