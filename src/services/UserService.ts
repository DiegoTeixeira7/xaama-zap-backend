import { users } from '../entities/User';
import { refreshTokens } from '../entities/RefreshToken';
import { hash } from "bcryptjs";
import { GenerateTokenProvider } from 'src/helpers/GenerateTokenProvider';
import { AppError } from 'src/errors/AppError';
import { GenerateRefreshToken } from 'src/helpers/GenerateRefreshToken';

interface IUserRequest {
  username?: string;
  phone?: string;
  password?: string;
  userId?: string;
}

class UserService {
  async index({ userId }: IUserRequest) {
    if (!userId) {
      throw new AppError("User ID is empty");
    }

    const user = await users.findById(userId);

    if (user) {
      const userResponse = {
        userName: user?.username,
        phone: user?.phone,
        isOnline: user?.isOnline
      }

      return userResponse;
    } else
      throw new AppError("User is not exists");
  }

  async create({ username, phone, password }: IUserRequest) {
    if (!username) {
      throw new AppError("Username is empty");
    }

    if (!phone) {
      throw new AppError("Phone is empty");
    }

    if (!password) {
      throw new AppError("Password is empty");
    }

    const userAlreadyExists = await users.findOne({
      username: username.trim()
    });

    if (userAlreadyExists) {
      throw new AppError("User already exists!");
    }

    const passwordHash = await hash(password, 8);

    const user = await users.create({
      username: username.trim(),
      phone: phone.trim(),
      password: passwordHash,
      isOnline: true
    });

    if (user) {
      const generateTokenProvider = new GenerateTokenProvider();
      const token = await generateTokenProvider.execute({ username, phone, isOnline: true, id: user.id });

      await refreshTokens.deleteMany({
        userId: user.id
      })

      const generateRefreshToken = new GenerateRefreshToken();
      const refreshToken = await generateRefreshToken.execute(user.id);


      return { user, token, refreshToken };
    } else {
      throw new AppError("User not found");
    }
  }
}

export { UserService }