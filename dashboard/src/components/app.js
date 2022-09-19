import React, { useEffect } from "react";
import io from "socket.io-client";

const socket = io.connect("http://localhost:1880");

const App = () => {
  useEffect(() => {
    socket.on("connection", ({ name, message }) => {
      console.log(name, message);
    });

    socket.on("hello", (msg) => {
      console.log(msg);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <>
      <div>Hello Dashboard</div>
    </>
  );
};

export default App;
