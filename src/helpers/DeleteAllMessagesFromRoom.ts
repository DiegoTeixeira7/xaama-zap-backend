import { messages } from '../entities/Message';

class DeleteAllMessagesFromRoom {
  execute(messagesId: Array<any>) {
    messagesId?.map(async (messageId) => {
      const message = await messages.findById(messageId);

      if (message) {
        await message.remove();
      } else {
        return false;
      }
    });

    return true;
  }
}

export { DeleteAllMessagesFromRoom }