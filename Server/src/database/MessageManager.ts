import { ICollection, IMonkManager } from "monk";
import { IMessage, IRoom } from "../interfaces";
import { RoomNotFound } from "./Errors";

export class MessageManager {
  private rooms: ICollection<IRoom>;
  constructor(private db: IMonkManager) {
    this.rooms = db.get("rooms");
  }

  async add(roomId: string, message: IMessage): Promise<Error | null> {
    await this.rooms.update({ id: roomId }, { $push: { messages: message } });

    return null;
  }

  async delete() {}
}
