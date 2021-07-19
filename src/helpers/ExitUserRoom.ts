import { Types } from 'mongoose';
import { usersRooms } from '../entities/UserRoom';

interface IUserRoomRequest {
  userId: string | Types.ObjectId,
  roomId: Types.ObjectId,
}

class ExitUserRoom {
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
      return false;
    }

    if (userRoom) {
      let isUserRoom = false;

      userRoom?.roomId?.forEach(rId => {
        if (rId.toString() === roomId.toString()) {
          isUserRoom = true;
        }
      });

      if (!isUserRoom) {
        return false;
      }

      userRoom.roomId.splice(userRoom.roomId.indexOf(roomId), 1);
      userRoom.clearMessagesRoomId.splice(userRoom.clearMessagesRoomId.indexOf(roomId), 1);

      userRoom.updateAt = new Date(Date.now());

      const userRoomUpdate = await userRoom.save();

      if (userRoomUpdate) {
        return true;
      } else {
        return false;
      }
    }

    return false
  }
}

export { ExitUserRoom }