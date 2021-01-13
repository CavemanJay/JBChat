import { ICollection, IMonkManager } from "monk";
import { IMessage, IRoom } from "../interfaces";
import { RoomNotFound } from "./Errors";

export class MessageManager {
  private rooms: ICollection<IRoom>;
  constructor(private db: IMonkManager) {
    this.rooms = db.get("rooms");
  }

  async add(roomId: string, message: IMessage): Promise<Error | null> {
    const room = await this.rooms.findOne({ id: roomId });

    if (!room) {
      return RoomNotFound;
    }

    room.messages.push(message);

    await this.rooms.update({ id: roomId }, room);

    return null;
  }

  async delete() {}
}
