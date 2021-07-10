import { Request, Response } from "express"
import { RoomService } from "../services/RoomService";

class RoomController {
  async index(request: Request, response: Response) {
    const { roomId } = request.params;

    const roomService = new RoomService();

    const room = await roomService.index({ roomId });

    return response.status(200).json(room);
  }

  async create(request: Request, response: Response) {
    const { userId } = request
    const { type, name, description } = request.body;

    const roomService = new RoomService();

    const room = await roomService.create({ type, name, description, userId });

    return response.status(200).json(room);
  }

  // get todas as salas de um usuário
  // delete sala(somente grupo)
  // update sala(name, description, usersIdAdmin)
  // update(numberParticipants, usersId)
}

export { RoomController }