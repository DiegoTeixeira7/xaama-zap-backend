import { Request, Response } from "express"
import { RoomService } from "../services/RoomService";

class RoomController {
  async index(request: Request, response: Response) {
    const { roomId } = request.params;
    const { isMessages } = request.body;

    const roomService = new RoomService();

    const room = await roomService.index({ roomId, isMessages });

    return response.status(200).json(room);
  }

  async create(request: Request, response: Response) {
    const { userId } = request
    const { type, name, description } = request.body;

    const roomService = new RoomService();

    const room = await roomService.create({ type, name, description, userId });

    return response.status(200).json(room);
  }

  async updateByAdmin(request: Request, response: Response) {
    const { roomId } = request.params;
    const { userId } = request;
    const { name, description, transformIntoAdmin, userIdAdmin } = request.body;

    const roomService = new RoomService();

    const roomUpdated = await roomService.updateByAdmin({
      userId,
      roomId,
      name,
      description,
      transformIntoAdmin,
      userIdAdmin
    });

    return response.status(200).json(roomUpdated);
  }

  async updateParticipants(request: Request, response: Response) {
    const { roomId } = request.params;
    const { userId } = request;
    const { enterExitRoom, userEnterExitRoomId } = request.body;

    const roomService = new RoomService();

    const roomUpdated = await roomService.updateParticipants({
      userId,
      roomId,
      enterExitRoom,
      userEnterExitRoomId
    });

    return response.status(200).json(roomUpdated);
  }

  async update(request: Request, response: Response) {
    const { roomId } = request.params;
    const { userId } = request;
    const { enterExitRoom } = request.body;

    const roomService = new RoomService();

    const roomUpdated = await roomService.update({
      userId,
      roomId,
      enterExitRoom,
    });

    return response.status(200).json(roomUpdated);
  }

  async delete(request: Request, response: Response) {
    const { roomId } = request.params;
    const { userId } = request

    const roomService = new RoomService();

    const room = await roomService.delete({ userId, roomId });

    return response.status(200).json(room);
  }
}

export { RoomController }