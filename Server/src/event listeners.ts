import socketIO from "socket.io";
import { ChatManager } from "./database/ChatManager";
import { IMessage, IRoom } from "./interfaces";
import * as utils from "./utils";

export function configureEvents(
  socket: socketIO.Socket,
  db: ChatManager,
  userId: string,
  sendMessage: (id: string, message: IMessage) => void
) {
  socket.on("getMessages", async (roomId: string) => {
    const room = await db.rooms.find(roomId);

    socket.emit("getMessagesResponse", room?.messages);
  });

  socket.on("message", (message: IMessage, roomId: string) => {
    message.sender = userId;

    sendMessage(roomId, message);
  });
}
