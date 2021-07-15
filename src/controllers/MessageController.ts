import { Request, Response } from "express"
import { MessageService } from "../services/MessageService";

class MessageController {
  async create(request: Request, response: Response) {
    const { userId } = request;
    const { roomId } = request.params;
    const { message } = request.body;

    const messageService = new MessageService();

    const sendMessage = await messageService.create({ userId, roomId, message });

    return response.status(200).json(sendMessage);
  }
}

export { MessageController }