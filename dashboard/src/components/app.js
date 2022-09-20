import React, { useEffect } from "react";

import { initlaizeSocket, disconnectSocket } from "../utils/socket";

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
    </>
  );
};

export default App;
