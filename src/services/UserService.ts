import { users } from '../entities/User';
import { hash } from "bcryptjs";

interface IUserRequest {
  username: string;
  phone: string;
  password: string;
}

class UserService {
  async create({ username, phone, password }: IUserRequest) {
    if (!username) {
      throw new Error("Username is empty");
    }

    if (!phone) {
      throw new Error("Phone is empty");
    }

    if (!password) {
      throw new Error("Password is empty");
    }

    const userAlreadyExists = await users.findOne({
      username: username.trim()
    });

    if (userAlreadyExists) {
      throw new Error("User already exists")
    }

    const passwordHash = await hash(password, 8);

    users.create({
      username: username.trim(),
      phone: phone.trim(),
      password: passwordHash
    }).then((user) => {
      if (user) {
        return user;
      } else {
        throw new Error("User already exists")
      }
    }).catch((error) => {
      throw new Error("Error internal")
    });
  }
}

export { UserService }