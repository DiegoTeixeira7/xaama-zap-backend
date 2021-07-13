import { Request, Response } from "express";
import { RefreshTokenService } from "src/services/RefreshTokenService";

class RefreshTokenController {
  async handle(request: Request, response: Response) {
    const { refreshTokenId } = request.params;

    const refreshTokenService = new RefreshTokenService();

    const token = await refreshTokenService.execute(refreshTokenId);

    return response.json(token);
  }
}

export { RefreshTokenController }