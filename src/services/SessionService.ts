import { users } from '../entities/User';
import { hash } from "bcryptjs";
import { sign } from "jsonwebtoken";
import { AppError } from 'src/errors/AppError';

interface IUserRequest {
  username: string;
  password: string;
}

class SessionService {
  async create({ username, password }: IUserRequest) {

  }
}

export { SessionService }