import { rooms } from '../entities/Room';
import { AppError } from 'src/errors/AppError';

interface IRoomRequest {
  type?: string;
  name?: string;
  description?: string;
  numberParticipants?: number;
  userId?: string;
  roomId?: string;
}

class RoomService {
  async index({ roomId }: IRoomRequest) {
    if (!roomId) {
      throw new AppError("Room ID is empty");
    }

    const room = await rooms.findById(roomId);

    if (room) {
      return room;
    } else
      throw new AppError("Room is not exists");
  }

  async create({ type, name, description, userId }: IRoomRequest) {
    if (!type) {
      throw new AppError("Type is empty");
    }

    if (type !== 'private' && type !== 'group') {
      throw new AppError("Type invalid");
    }

    if (!name) {
      throw new AppError("Name is empty");
    }

    if (!description) {
      throw new AppError("Description is empty");
    }

    const roomNameAlreadyExists = await rooms.findOne({
      name: name.trim()
    });

    if (roomNameAlreadyExists) {
      throw new AppError("Room already exists!");
    }

    const room = await rooms.create({
      type: type.trim(),
      name: name.trim(),
      description: description.trim(),
      usersId: [userId],
      userCreatorId: userId,
      usersIdAdmin: [userId]
    });

    if (room) {
      return room;
    } else {
      throw new AppError("Room already exists!");
    }
  }

  async delete({ roomId }: IRoomRequest) {
    if (!roomId) {
      throw new AppError("Room ID is empty");
    }

    const room = await rooms.findById(roomId);

    if (!room) {
      throw new AppError("Room is not exists");
    }

    if ((room?.type === 'private' && room?.numberParticipants != 1)) {
      throw new AppError("The room is not empty");
    }

    const roomRemove = await room.remove();

    if (roomRemove) {
      return "Room removed";
    }

    return "Room has not been removed";
  }

}

export { RoomService }