import socketIO from "socket.io";
import { Message, Room } from "./interfaces";
import * as utils from "./utils";

export function configureEvents(
  socket: socketIO.Socket,
  id: string,
  room: string,
  createRoom: Function,
  newMessage: Function,
  broadcast: (...args: any[]) => void
) {
  // I want to handle the logic differently for when a room is not found. Think it should be the client's responsibility to get this part right

  // socket.on("roomNotFoundResponse", (response: string) => {
  //   if (!response) {
  //     try {
  //       socket.disconnect();
  //     } catch (_) {}
  //   }

  //   if (response.toLowerCase().startsWith("y")) {
  //     utils.log(`Creating room ${room}`);

  //     createRoom(room);
  //     socket.join(room);
  //   } else {
  //     socket.disconnect();
  //   }
  // });

  socket.on("clientMessage", (message: Message) => {
    message.sender = id;
    newMessage(message);
  });

  socket.on("message", broadcast);
}
