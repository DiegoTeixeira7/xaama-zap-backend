import { refreshTokens } from '../entities/RefreshToken';
import { AppError } from '../errors/AppError';
import dayjs from 'dayjs';

class GenerateRefreshToken {
  async execute(userId: string) {
    const refreshTokenExpiresIn = dayjs().add(120, "minutes").unix();

    const generateRefreshToken = await refreshTokens.create({
      expiresIn: refreshTokenExpiresIn,
      userId
    });

    if (generateRefreshToken) {
      return generateRefreshToken;
    }

    throw new AppError("Error creating refresh token");
  }
}

export { GenerateRefreshToken }