import { Socket } from "socket.io";
import { Message } from ".";

export interface Room {
  id: string;
  messages: Message[];
  participants: User[];
}

export interface User {
  // socket: Socket;
  id: string;
}
