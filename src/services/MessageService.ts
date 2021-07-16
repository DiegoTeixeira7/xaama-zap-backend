import { messages } from '../entities/Message';
import { rooms } from 'src/entities/Room';
import { AppError } from 'src/errors/AppError';

interface IMessageRequest {
  userId: string;
  roomId: string;
  message: string;
}

class MessageService {
  async create({ userId, roomId, message }: IMessageRequest) {
    if (!userId) {
      throw new AppError("User ID is empty");
    }

    if (!roomId) {
      throw new AppError("Room ID is empty");
    }

    if (!message) {
      throw new AppError("Description is empty");
    }

    const sendMessage = await messages.create({ userId, roomId, message });

    if (sendMessage) {
      const room = await rooms.findById(roomId);

      if (!room) {
        throw new AppError("Room is not exists");
      }

      room.messageId.push(sendMessage.id);
      room.updateAt = new Date(Date.now());

      const roomUpdateMessage = await room.save();

      if (roomUpdateMessage) {
        return sendMessage;
      } else {
        throw new AppError("Unsent message to room");
      }

    } else {
      throw new AppError("Unsent message");
    }
  }
}

export { MessageService }