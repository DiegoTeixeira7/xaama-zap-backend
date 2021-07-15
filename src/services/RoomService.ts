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
  userIdAdmin?: string;
  enterExitRoom?: boolean;
  userEnterExitRoomId?: string;
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

      if (transformIntoAdmin) {
        let isRoom = false;

        // check if the user is in the room
        room.usersId.forEach(uId => {
          if (userIdAdmin.toString() === uId.toString()) {
            isRoom = true;
          }
        });

        if (!isRoom) {
          throw new AppError("User does not participate in the room");
        }
      }

      const newUserAdmin = await users.findById(userIdAdmin);

      if (!newUserAdmin) {
        throw new AppError("User admin ID is not exists");
      }

      let isAdmin = false;

      room.usersIdAdmin.forEach(uId => {
        if (userIdAdmin.toString() === uId.toString()) {
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
    room.updateAt = new Date(Date.now());

    const updatedRoom = await room.save();

    if (updatedRoom) {
      return updatedRoom;
    } else {
      throw new AppError("Room not updated");
    }
  }

  async updateParticipants({ userId, roomId, enterExitRoom, userEnterExitRoomId }: IRoomRequest) {
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

    if (!userEnterExitRoomId) {
      throw new AppError("User enter/exit room ID is empty");
    }

    const newUser = await users.findById(userEnterExitRoomId);

    if (!newUser) {
      throw new AppError("User enter/exit room ID is not exists");
    }

    let isRoom = false;

    // check if the user is in the room
    room.usersId.forEach(uId => {
      if (userEnterExitRoomId.toString() === uId.toString()) {
        isRoom = true;
      }
    });

    if (enterExitRoom && !isRoom) {
      // enter the room
      if (room.type === 'private') {
        if (room.numberParticipants === 1) {
          room.usersIdAdmin.push(newUser.id);
        } else {
          throw new AppError("Private room");
        }
      }

      room.usersId.push(newUser.id);
      room.numberParticipants += 1;

    } else if (!enterExitRoom && isRoom) {
      // leave the room
      let isAdmin = false;
      // check if the user is room admin
      room.usersIdAdmin.forEach(uId => {
        if (userEnterExitRoomId.toString() === uId.toString()) {
          isAdmin = true;
        }
      });

      if (isAdmin) {
        room.usersIdAdmin.splice(room.usersIdAdmin.indexOf(newUser.id), 1);
      }

      room.usersId.splice(room.usersId.indexOf(newUser.id), 1);
      room.numberParticipants -= 1;

    } else if (enterExitRoom && isRoom) {
      throw new AppError("User already participates in the room");
    } else {
      throw new AppError("User does not participate in the room");
    }

    room.updateAt = new Date(Date.now());

    const updatedRoom = await room.save();

    if (updatedRoom) {
      if (updatedRoom.numberParticipants === 0) {
        const roomRemove = await room.remove();

        if (roomRemove) {
          return "Room removed";
        }

        return "Room has not been removed";
      }

      return updatedRoom;
    } else {
      throw new AppError("Room not updated");
    }
  }

  async update({ userId, roomId, enterExitRoom }: IRoomRequest) {
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

    const userEnterExit = await users.findById(userId);

    if (!userEnterExit) {
      throw new AppError("User enter/exit room ID is not exists");
    }

    let isRoom = false;

    // check if the user is in the room
    room.usersId.forEach(uId => {
      if (uId.toString() === userId.toString()) {
        isRoom = true;
      }
    });

    if (!isRoom && enterExitRoom) {
      // enter the room
      if (room.type === 'private') {
        if (room.numberParticipants === 1) {
          room.usersIdAdmin.push(userEnterExit.id);
        } else {
          throw new AppError("Private room");
        }
      }

      room.usersId.push(userEnterExit.id);
      room.numberParticipants += 1;

    } else if (isRoom && !enterExitRoom) {
      // leave the room
      let isAdmin = false;

      // check if the user is room admin
      room.usersIdAdmin.forEach(uId => {
        if (uId.toString() === userId.toString()) {
          isAdmin = true;
        }
      });

      if (isAdmin) {
        room.usersIdAdmin.splice(room.usersIdAdmin.indexOf(userEnterExit.id), 1);
      }

      room.usersId.splice(room.usersId.indexOf(userEnterExit.id), 1);
      room.numberParticipants -= 1;

    } else if (isRoom && enterExitRoom) {
      throw new AppError("User already participates in the room");
    } else {
      throw new AppError("User does not participate in the room");
    }

    room.updateAt = new Date(Date.now());

    const updatedRoom = await room.save();

    if (updatedRoom) {
      if (updatedRoom.numberParticipants === 0) {
        const roomRemove = await room.remove();

        if (roomRemove) {
          return "Room removed";
        }

        return "Room has not been removed";
      }

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