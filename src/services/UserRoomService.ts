import { usersRooms } from '../entities/UserRoom';
import { AppError } from 'src/errors/AppError';

interface IUserRoomRequest {
  userId: string;
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
      // error
    }

    if (userRoom) {
      return userRoom;

    } else {
      return "User Room is not found"
    }

  }
}

export { UserRoomService }