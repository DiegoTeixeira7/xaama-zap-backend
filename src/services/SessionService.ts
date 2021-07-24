import { users } from '../entities/User';
import { refreshTokens } from '../entities/RefreshToken';
import { compare } from "bcryptjs";
import { AppError } from '../errors/AppError';
import { GenerateRefreshToken } from '../helpers/GenerateRefreshToken';
import { GenerateTokenProvider } from '../helpers/GenerateTokenProvider';

interface IUserRequest {
  username: string;
  password?: string;
}

class SessionService {
  async create({ username, password }: IUserRequest) {
    if (!username) {
      throw new AppError("Username/Password empty!");
    }

    if (!password) {
      throw new AppError("Username/Password empty!");
    }

    const user = await users.findOne({
      username: username.trim()
    });

    if (!user) {
      throw new AppError("Username/Password incorrect!");
    }

    const passwordMatch = await compare(password, user.password);

    if (!passwordMatch) {
      throw new AppError("Username/Password incorrect!");
    }

    user.isOnline = true;
    user.updateAt = new Date(Date.now());
    await user.save();

    const generateTokenProvider = new GenerateTokenProvider();
    const token = await generateTokenProvider.execute({ username, phone: user.phone, isOnline: true, id: user.id });

    await refreshTokens.deleteMany({
      userId: user.id
    })

    const generateRefreshToken = new GenerateRefreshToken();
    const refreshToken = await generateRefreshToken.execute(user.id);

    return { token, refreshToken };
  }

  async logout({ username }: IUserRequest) {
    if (!username) {
      throw new AppError("Username/Password empty!");
    }

    const user = await users.findOne({
      username: username.trim()
    });

    if (!user) {
      throw new AppError("Username/Password incorrect!");
    }

    user.isOnline = false;
    user.updateAt = new Date(Date.now());
    await user.save();

    await refreshTokens.deleteMany({
      userId: user.id
    })

    return { message: "User logged out successfully" };
  }
}

export { SessionService }