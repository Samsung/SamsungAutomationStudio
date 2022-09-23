import React, { useEffect } from "react";
import SoopButton from "./SoopButton";
import SoopText from "./SoopText";
import SoopSlider from "./SoopSlider";
import SoopGauge from "./SoopGauge";
import SoopChart from "./SoopChart";
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
      <SoopButton />
      <SoopText />
      <SoopSlider />
      <SoopGauge />
      <SoopChart />
    </>
  );
};

export default App;
