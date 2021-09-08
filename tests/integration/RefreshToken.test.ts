
//	Importing mongoose, supertest, app and faker resources
import mongoose from "mongoose";
import request from "supertest";
import app from "../../src/app";
import faker from "faker";

//	Test variables
let userRefreshTokenId = "";
const username = faker.name.firstName();
const phone = faker.phone.phoneNumber();

// Importing entities
import { users } from '../../src/entities/User';

describe('RefreshToken', () => {
  afterAll(async () => {
    const user = await users.findOne({ username });
    await user.remove();

    await mongoose.disconnect().catch((error) => {
      return console.error("Unable to disconnect from database:", error);
    });
  });

  test("Should be able to create a user", async () => {
    await request(app).post("/user").send({
      username,
      phone,
      password: "1234567",
    }).expect(200).then((response) => userRefreshTokenId = response.body.refreshToken._id);
  });

  test("Should be able to create a refresh token", async () => {
    await request(app).post(`/refreshToken/${userRefreshTokenId}`).expect(200);
  });

  test("Should not able to create a refresh token", async () => {
    await request(app).post(`/refreshToken/dj38due8djd`).expect(400);
  });

})