import { Request, Response } from "express"
import { SessionService } from "../services/SessionService";

class SessionController {
  async create(request: Request, response: Response) {
    const { username, password } = request.body;

    const sessionService = new SessionService();

    const token = await sessionService.create({ username, password });

    return response.status(200).json(token);
  }

  async logout(request: Request, response: Response) {
    const { username } = request.body;

    const sessionService = new SessionService();

    const message = await sessionService.logout({ username });

    return response.status(200).json(message);
  }
}

export { SessionController }