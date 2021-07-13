import { Request, Response } from "express"
import { UserService } from "../services/UserService";
class UserController {
  async index(request: Request, response: Response) {
    const { userId } = request

    const userService = new UserService();

    const user = await userService.index({ userId });

    return response.status(200).json(user);
  }

  async create(request: Request, response: Response) {
    const { username, phone, password } = request.body;

    const userService = new UserService();

    const { user, token, refreshToken } = await userService.create({ username, phone, password });

    return response.status(200).json({ user, token, refreshToken });
  }
}

export { UserController }