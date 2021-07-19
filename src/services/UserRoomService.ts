import { usersRooms } from '../entities/UserRoom';
import { AppError } from 'src/errors/AppError';

interface IUserRoomRequest {
  userId: string;
  roomId?: string;
  clearMessages?: Boolean;
}

class UserRoomService {
  async index({ userId }: IUserRoomRequest) {
    if (!userId) {
      throw new AppError("User ID is empty");
    }

    var userRoom = null
    try {
      userRoom = await usersRooms.findOne({ userId }).populate({
        path: 'roomId',
        select: '-creationAt -__v -usersId -userCreatorId -usersIdAdmin -messageId',
        options: { sort: { updateAt: -1 } }
      });
    } catch (err) {
      throw new AppError(err);
    }

    if (userRoom) {
      return userRoom;

    } else {
      throw new AppError("User Room is not found");
    }
  }

  async update({ userId, roomId, clearMessages }: IUserRoomRequest) {
    if (!userId) {
      throw new AppError("User ID is empty");
    }

    if (!roomId) {
      throw new AppError("Room ID is empty");
    }

    var userRoom = null
    try {
      userRoom = await usersRooms.findOne({ userId })
    } catch (err) {
      throw new AppError(err);
    }

    if (userRoom) {
      let isClearMessages = false;

      userRoom?.clearMessagesRoomId?.forEach(messagesRoomId => {
        if (messagesRoomId.toString() === roomId.toString()) {
          isClearMessages = true;
        }
      });

      if (clearMessages && !isClearMessages) {
        userRoom?.clearMessagesRoomId?.push(roomId);
        userRoom.updateAt = new Date(Date.now());

        const userRoomUpdate = await userRoom.save();

        if (userRoomUpdate) {
          return userRoomUpdate;
        } else {
          throw new AppError("User room not updated")
        }

      } else if (!clearMessages && isClearMessages) {
        userRoom.clearMessagesRoomId.splice(userRoom.clearMessagesRoomId?.indexOf(roomId), 1);
        userRoom.updateAt = new Date(Date.now());

        const userRoomUpdate = await userRoom.save();

        if (userRoomUpdate) {
          return userRoomUpdate;
        } else {
          throw new AppError("User room not updated")
        }

      } else if (clearMessages && isClearMessages) {
        throw new AppError("The user wants to clean the messages from this one but they are already clean");
      } else {
        throw new AppError("The user wants to restore messages from this but they are already restored");
      }

    } else {
      throw new AppError("User Room is not found");
    }
  }
}

export { UserRoomService }