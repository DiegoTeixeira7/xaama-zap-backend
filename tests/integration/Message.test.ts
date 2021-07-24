
//	Importing mongoose, supertest, app and faker resources
import mongoose from "mongoose";
import request from "supertest";
import app from "../../src/app";
import faker from "faker";

//	Test variables
let userToken = "";
let otherUserToken = "";
let roomId = "";
const username = faker.name.firstName();
const otherUsername = faker.name.firstName();
const phone = faker.phone.phoneNumber();
const type = "group";
const name = "Test message";
const description = "A simple room";
const message = "A simple message";

// Importing entities
import { users } from '../../src/entities/User';
import { rooms } from '../../src/entities/Room';

describe('Session', () => {
  afterAll(async () => {
    const user = await users.findOne({ username });
    await user.remove();

    const otherUser = await users.findOne({ username: otherUsername });
    await otherUser.remove();

    const room = await rooms.findById(roomId);
    await room.remove();

    await mongoose.disconnect().catch((error) => {
      return console.error("Unable to disconnect from database:", error);
    });
  });

  test("Should be able to create a user", async () => {
    await request(app).post("/user").send({
      username,
      phone,
      password: "1234567",
    }).expect(200).then((response) => userToken = response.body.token);
  });

  test("Should be able to create a user", async () => {
    await request(app).post("/user").send({
      username: otherUsername,
      phone,
      password: "1234567",
    }).expect(200).then((response) => otherUserToken = response.body.token);
  });

  test("Should be able to create a room", async () => {
    await request(app).post("/room").send({
      type,
      name,
      description,
    }).set({
      Authorization: `Bearer ${userToken}`
    }).expect(200).then((response) => roomId = response.body._id);
  });

  test("Should be able to create a message an room", async () => {
    await request(app).post(`/message/${roomId}`).send({
      message
    }).set({
      Authorization: `Bearer ${userToken}`
    }).expect(200);
  });

  test("Should not able to create a message an room", async () => {
    await request(app).post(`/message/${roomId}`).send({
      message
    }).expect(401);
  });

  test("Should not able to create a message an room", async () => {
    await request(app).post(`/message/${roomId}`).send({
      message: ""
    }).set({
      Authorization: `Bearer ${userToken}`
    }).expect(400);
  });

  test("Should not able to create a message an room", async () => {
    await request(app).post('/message/dsf323').send({
      message
    }).set({
      Authorization: `Bearer ${userToken}`
    }).expect(400);
  });

  test("Should not able to create a message an room", async () => {
    await request(app).post(`/message/${roomId}`).send({
      message
    }).set({
      Authorization: `Bearer ${otherUserToken}`
    }).expect(400);
  });

})