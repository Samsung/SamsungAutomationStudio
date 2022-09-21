import { io } from "socket.io-client";

let socket;

export const initlaizeSocket = () => {
  socket = io();

  socket.on("connect", () => {
    console.info(`socket connected : ${socket.id}`);
  });

  socket.on("initial-value", (state) => {
    console.log(state);
  });

  socket.on("update-value", (state) => {
    console.log(state);
  });
};

export const disconnectSocket = () => {
  socket.disconnect();
};
