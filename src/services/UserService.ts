import { users } from '../entities/User';
import { hash } from "bcryptjs";
import { sign } from "jsonwebtoken";
import { AppError } from 'src/errors/AppError';

interface IUserRequest {
  username: string;
  phone: string;
  password: string;
}

class UserService {
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
      password: passwordHash
    });

    if (user) {
      const token = sign({
        username: user.username,
        phone: user.phone
      }, process.env.TOKEN, {
        subject: user.id,
        expiresIn: "1d"
      });

      return { user, token };
    } else {
      throw new AppError("User already exists!");
    }
  }
}

export { UserService }