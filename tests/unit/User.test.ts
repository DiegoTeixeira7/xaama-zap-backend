
//	Importing mongoose, supertest, app, faker and bcrypt resources
import mongoose from "mongoose";
import request from "supertest";
import app from "../../src/app";
import faker from "faker";
import bcrypt from "bcryptjs";

//	Test variables
let userToken = "";
const username = faker.name.firstName();
const phone = faker.phone.phoneNumber();


describe('Session', () => {
  afterAll(async () => {
    await mongoose.disconnect().catch((error) => {
      return console.error("Unable to disconnect from database:", error);
    });
  });

  test("Should encrypt user password", async () => {
    let passwordHash = '';

    await request(app).post("/user").send({
      username,
      phone,
      password: "1234567",
    }).then((response) => {
      userToken = response.body.token;
      passwordHash = response.body.user.password;
    });

    const compareHash = await bcrypt.compare("1234567", passwordHash);

    expect(compareHash).toBe(true);
  });

  // beforeAll(async () => {
  //   return await request(app).delete("/user").set({
  //     Authorization: `Bearer ${userToken}`
  //   }).send({
  //     password: "1234567"
  //   });
  // });
})