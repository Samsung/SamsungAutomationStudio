import { io } from "socket.io-client";
import { setInitNode, updateNode } from "./store";

const { FRONT_SOCKET_TYPE } = require("../../common/common");

let socket;

export const initlaizeSocket = dispatch => {
  socket = io();

  socket.on("connect", () => {
    console.info(`socket connected : ${socket.id}`);
  });

  socket.on(FRONT_SOCKET_TYPE.INIT_NODE, states => {
    dispatch(setInitNode(states));
  });

  socket.on(FRONT_SOCKET_TYPE.UPDATE_NODE, updateData => {
    dispatch(updateNode(updateData));
  });
};

export const disconnectSocket = () => {
  socket.disconnect();
};

export const sendMessage = (nodeId, messageBody) => {
  socket.emit(FRONT_SOCKET_TYPE.RECEIVE_MESSAGE, {
    nodeId: nodeId,
    ...messageBody,
  });
};
