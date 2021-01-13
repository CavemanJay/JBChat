import { ICollection, IMonkManager } from "monk";
import { IRoom, IUser } from "../interfaces";
import { RoomNotFound } from "./Errors";

export class RoomManager {
  private rooms: ICollection<IRoom>;
  constructor(private db: IMonkManager) {
    this.rooms = db.get<IRoom>("rooms");
  }

  async all() {
    return await this.rooms.find({}, { raw: false, rawCursor: false });
  }

  async find(id: string) {
    return await this.rooms.findOne({ id });
  }

  async add(room: IRoom) {
    return await this.rooms.insert(room);
  }

  async addParticipant(roomId: string, user: IUser) {
    // TODO: Handle when user already in room
    // Thought about using a set but mongo stores IEnumerables as arrays
    await this.rooms.update(
      { id: roomId },
      {
        $push: {
          participants: user,
        },
      }
    );
  }

  async delete(room: IRoom) {
    return await this.rooms.remove({ id: room.id });
  }
}
