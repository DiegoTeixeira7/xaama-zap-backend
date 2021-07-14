import { rooms } from '../entities/Room';
import { users } from '../entities/User';
import { AppError } from 'src/errors/AppError';

interface IRoomRequest {
  type?: string;
  name?: string;
  description?: string;
  numberParticipants?: number;
  userId?: string;
  roomId?: string;
  transformIntoAdmin?: boolean;
  userIdAdmin?: string
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

  async updateByAdmin({ userId, roomId, name, description, transformIntoAdmin, userIdAdmin }: IRoomRequest) {
    if (!userId) {
      throw new AppError("User ID is empty");
    }

    if (!roomId) {
      throw new AppError("Room ID is empty");
    }

    const room = await rooms.findById(roomId);

    if (!room) {
      throw new AppError("Room is not exists");
    }

    if (!name) {
      throw new AppError("Name is empty");
    }

    if (!description) {
      throw new AppError("Description is empty");
    }

    if (userIdAdmin) {
      const newUserAdmin = await users.findById(userIdAdmin);

      if (!newUserAdmin) {
        throw new AppError("User admin ID is not exists");
      }

      let isAdmin = false;

      room.usersIdAdmin.forEach(userId => {
        if (userIdAdmin.toString() === userId.toString()) {
          isAdmin = true;
        }
      });

      if (transformIntoAdmin && !isAdmin) {
        room.usersIdAdmin.push(newUserAdmin.id);
      } else if (!transformIntoAdmin && isAdmin) {
        room.usersIdAdmin.splice(room.usersIdAdmin.indexOf(newUserAdmin.id), 1);
      }
    }

    room.name = name.trim();
    room.description = description.trim();

    const updatedRoom = await room.save();

    if (updatedRoom) {
      return updatedRoom;
    } else {
      throw new AppError("Room not updated");
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