import { sign } from "jsonwebtoken";

interface IUserRequest {
  username: string;
  phone: string;
  isOnline: boolean;
  id: string;
}

class GenerateTokenProvider {
  async execute({ username, phone, isOnline, id }: IUserRequest) {
    const token = sign({
      username,
      phone,
      isOnline
    }, process.env.TOKEN, {
      subject: id,
      expiresIn: "60m"
    });

    return token;
  }
}

export { GenerateTokenProvider }