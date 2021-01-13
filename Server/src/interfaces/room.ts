import { IMessage, IUser } from ".";

export interface IRoom {
  id: string;
  messages: IMessage[];
  participants: IUser[];
}
