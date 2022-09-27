import React, { useEffect } from "react";
import SoopButton from "./SoopButton";
import SoopText from "./SoopText";
import SoopSlider from "./SoopSlider";
import SoopGauge from "./SoopGauge";
import SoopChart from "./SoopChart";
import SoopDropdown from "./SoopDropdown";
import SoopList from "./SoopList";
import SoopImage from "./SoopImage";
import { initlaizeSocket, disconnectSocket } from "../utils/socket";
import "./App.css";

const App = () => {
  useEffect(() => {
    initlaizeSocket();

    return () => {
      disconnectSocket();
    };
  }, []);

  return (
    <>
      <div>Hello Dashboard</div>
      <SoopImage />
      <SoopList />
      <SoopButton />
      <SoopText />
      <SoopSlider />
      <SoopGauge />
      <SoopChart />
      <SoopDropdown />
    </>
  );
};

export default App;
