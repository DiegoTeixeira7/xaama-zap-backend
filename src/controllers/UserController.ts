import { Request, Response } from "express"
import { UserService } from "../services/UserService";

class UserController {
  async create(request: Request, response: Response) {
    const { username, phone, password } = request.body;

    const userService = new UserService();

    const user = await userService.create({ username, phone, password });

    return response.json(user);
  }
}

export { UserController }