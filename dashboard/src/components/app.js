import React, { useEffect } from "react";
import Button from "./Button";
import Text from "./Text";
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
      <Button />
      <Text />
    </>
  );
};

export default App;
