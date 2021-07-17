import { Request, Response } from "express"
import { UserRoomService } from "../services/UserRoomService";

class UserRoomController {
  async index(request: Request, response: Response) {
    const { userId } = request

    const userRoomService = new UserRoomService();

    const userRoom = await userRoomService.index({ userId });

    return response.status(200).json(userRoom);
  }
}

export { UserRoomController }