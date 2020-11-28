import { Message } from ".";

export interface Room {
  id: string;
  messages: Message[];
}
