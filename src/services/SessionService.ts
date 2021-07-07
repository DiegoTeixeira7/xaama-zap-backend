import { users } from '../entities/User';
import { compare } from "bcryptjs";
import { sign } from "jsonwebtoken";
import { AppError } from 'src/errors/AppError';

interface IUserRequest {
  username: string;
  password: string;
}

class SessionService {
  async create({ username, password }: IUserRequest) {
    if (!username) {
      throw new AppError("Username/Password incorrect!");
    }

    if (!password) {
      throw new AppError("Username/Password incorrect!");
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

    const token = sign({
      username: user.username,
      phone: user.phone,
      isOnline: user.isOnline
    }, process.env.TOKEN, {
      subject: user.id,
      expiresIn: "1d"
    });

    return token;
  }
}

export { SessionService }


// TODO: colocar usuário online quando ele faz o login e criar rota de logout