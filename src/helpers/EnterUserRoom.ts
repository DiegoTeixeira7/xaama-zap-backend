import { Types } from 'mongoose';
import { usersRooms } from '../entities/UserRoom';

interface IUserRoomRequest {
  userId: Types.ObjectId,
  roomId: Types.ObjectId,
}

class EnterUserRoom {
  async execute({ userId, roomId }: IUserRoomRequest) {
    if (!userId) {
      return false;
    }

    if (!roomId) {
      return false;
    }

    var userRoom = null
    try {
      userRoom = await usersRooms.findOne({ userId });
    } catch (err) {
      // error
    }

    if (userRoom) {
      let isUserRoom = false;

      userRoom?.roomId?.forEach(rId => {
        if (rId.toString() === roomId.toString()) {
          isUserRoom = true;
        }
      });

      if (isUserRoom) {
        return false;
      }

      userRoom?.roomId.push(roomId);

      const userRoomUpdate = await userRoom.save();

      if (userRoomUpdate) {
        return true;
      } else {
        return false;
      }
    } else {
      const userRoom = await usersRooms.create({
        userId,
        roomId: [roomId]
      });

      if (userRoom) {
        return true;
      } else {
        return false;
      }
    }
  }
}

export { EnterUserRoom }