import socketIO from "socket.io";
import { Message, Room } from "./interfaces";

export function configureEvents(
  socket: socketIO.Socket,
  room: string,
  createRoom: Function,
  newMessage: Function
) {
  socket.on("roomNotFoundResponse", (response: string) => {
    if (!response) {
      try {
        socket.disconnect();
      } catch (_) {}
    }

    if (response.toLowerCase().startsWith("y")) {
      console.log(`Creating room ${room}`);

      createRoom(room);
      socket.join(room);
    } else {
      socket.disconnect();
    }
  });

  socket.on("clientMessage", (message: Message) => {
    newMessage(message);
  });
}
