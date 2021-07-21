
//	Importing mongoose, supertest, app and faker resources
import mongoose from "mongoose";
import request from "supertest";
import app from "../../src/app";
import faker from "faker";

//	Test variables
let userToken = "";
const username = faker.name.firstName();
const phone = faker.phone.phoneNumber();

// Importing entities
import { users } from '../../src/entities/User';

describe('Session', () => {
  afterAll(async () => {
    const user = await users.findOne({ username });
    await user.remove();

    await mongoose.disconnect().catch((error) => {
      return console.error("Unable to disconnect from database:", error);
    });
  });

  test("Should be able to create a user", async () => {
    return await request(app).post("/user").send({
      username,
      phone,
      password: "1234567",
    }).expect(200).then((response) => userToken = response.body.token);
  });

  test("Should be able to create a session", async () => {
    await request(app).post("/login").send({
      username,
      password: "1234567"
    }).set({
      Authorization: `Bearer ${userToken}`
    }).expect(200).then((response) => userToken = response.body.token);
  });

  test("Should be able to create a session", async () => {
    await request(app).post("/login").send({
      username,
      password: "passwordIncorrect"
    }).set({
      Authorization: `Bearer ${userToken}`
    }).expect(400);
  });
})