import { refreshTokens } from '../entities/RefreshToken';
import { AppError } from 'src/errors/AppError';
import dayjs from 'dayjs';

class GenerateRefreshToken {
  async execute(userId: string) {
    const refreshTokenExpiresIn = dayjs().add(15, "seconds").unix();

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