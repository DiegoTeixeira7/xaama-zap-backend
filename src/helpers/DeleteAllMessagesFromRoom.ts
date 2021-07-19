import { messages } from '../entities/Message';

class DeleteAllMessagesFromRoom {
  execute(messagesId: Array<any>) {
    messagesId?.map(async (messageId) => {
      let message = null;
      try {
        message = await messages.findById(messageId);
      } catch (err) {
        return false;
      }

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