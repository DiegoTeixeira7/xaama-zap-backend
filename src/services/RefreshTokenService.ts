import dayjs from 'dayjs';
import { refreshTokens } from '../entities/RefreshToken';
import { GenerateTokenProvider } from '../helpers/GenerateTokenProvider';
import { AppError } from '../errors/AppError';
import { GenerateRefreshToken } from '../helpers/GenerateRefreshToken';

class RefreshTokenService {
  async execute(rToken: string) {
    var refreshToken;
    refreshToken = await refreshTokens.findById(rToken).populate('userId');

    if (!refreshToken) {
      throw new AppError("Refresh token invalid");
    }

    const refreshTokenExpired = dayjs().isAfter(dayjs.unix(refreshToken.expiresIn));

    const generateTokenProvider = new GenerateTokenProvider();
    const token = await generateTokenProvider.execute({
      username: refreshToken.userId.username,
      phone: refreshToken.userId.phone,
      isOnline: refreshToken.userId.isOnline,
      id: refreshToken.userId.id
    });

    if (refreshTokenExpired) {
      await refreshTokens.deleteMany({
        userId: refreshToken.userId.id
      })

      const generateRefreshToken = new GenerateRefreshToken();
      const newRefreshToken = await generateRefreshToken.execute(refreshToken.userId.id);

      return { token, refreshToken: newRefreshToken };
    }


    return { token };
  }
}

export { RefreshTokenService }