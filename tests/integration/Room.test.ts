
//	Importing mongoose, supertest, app and faker resources
import mongoose from "mongoose";
import request from "supertest";
import app from "../../src/app";
import faker from "faker";

//	Test variables
let userToken = "";
let otherUserToken = "";
let roomId = "";
let otherRoomId = "";
let removeRoomId = "";
let otherUserId = "";
const username = faker.name.firstName();
const otherUsername = faker.name.firstName();
const phone = faker.phone.phoneNumber();
const type = "group";
const name = "Test room";
const description = "A simple room";
const message = "A simple message";

// Importing entities
import { users } from '../../src/entities/User';
import { rooms } from '../../src/entities/Room';

describe('Room', () => {
  afterAll(async () => {
    const user = await users.findOne({ username });
    await user.remove();

    const otherUser = await users.findOne({ username: otherUsername });
    await otherUser.remove();

    const room = await rooms.findById(roomId);
    await room.remove();

    const otherRoom = await rooms.findById(otherRoomId);
    await otherRoom.remove();

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
    }).expect(200).then((response) => {
      otherUserToken = response.body.token
      otherUserId = response.body.user._id
    });
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

  test("Should be able to search a room", async () => {
    await request(app).get(`/room/${roomId}`).send({
      isMessages: false
    }).set({
      Authorization: `Bearer ${userToken}`
    }).expect(200);
  });

  test("Should be able to search a room", async () => {
    await request(app).get(`/room/${roomId}`).send({
      isMessages: true
    }).set({
      Authorization: `Bearer ${userToken}`
    }).expect(200);
  });

  test("Should be able to enter a room", async () => {
    await request(app).patch(`/room/${roomId}`).send({
      enterExitRoom: true
    }).set({
      Authorization: `Bearer ${otherUserToken}`
    }).expect(200);
  });

  test("Should not able to enter a room", async () => {
    await request(app).patch(`/room/${roomId}`).send({
      enterExitRoom: true
    }).set({
      Authorization: `Bearer ${otherUserToken}`
    }).expect(400);
  });

  test("Should be able to exit a room", async () => {
    await request(app).patch(`/room/${roomId}`).send({
      enterExitRoom: false
    }).set({
      Authorization: `Bearer ${otherUserToken}`
    }).expect(200);
  });

  test("Should not able to exit a room", async () => {
    await request(app).patch(`/room/${roomId}`).send({
      enterExitRoom: false
    }).set({
      Authorization: `Bearer ${otherUserToken}`
    }).expect(400);
  });

  test("Should be able to create a room", async () => {
    await request(app).post("/room").send({
      type: 'private',
      name: 'Room test private',
      description,
    }).set({
      Authorization: `Bearer ${userToken}`
    }).expect(200).then((response) => otherRoomId = response.body._id);
  });

  test("Should be able to enter a room", async () => {
    await request(app).patch(`/room/${otherRoomId}`).send({
      enterExitRoom: true
    }).set({
      Authorization: `Bearer ${otherUserToken}`
    }).expect(200);
  });

  test("Should be able to exit a room", async () => {
    await request(app).patch(`/room/${otherRoomId}`).send({
      enterExitRoom: false
    }).set({
      Authorization: `Bearer ${otherUserToken}`
    }).expect(200);
  });

  test("Should be able to exit a room", async () => {
    await request(app).patch(`/room/${otherRoomId}`).send({
      enterExitRoom: false
    }).set({
      Authorization: `Bearer ${userToken}`
    }).expect(200);
  });

  test("Should be able to add a user to a room", async () => {
    await request(app).patch(`/roomParticipants/${roomId}`).send({
      enterExitRoom: true,
      userEnterExitRoomId: otherUserId
    }).set({
      Authorization: `Bearer ${userToken}`
    }).expect(200);
  });

  test("Should not able to add a user to a room", async () => {
    await request(app).patch(`/roomParticipants/${roomId}`).send({
      enterExitRoom: true,
      userEnterExitRoomId: otherUserId
    }).set({
      Authorization: `Bearer ${userToken}`
    }).expect(400);
  });

  test("Should be able to remove a user to a room", async () => {
    await request(app).patch(`/roomParticipants/${roomId}`).send({
      enterExitRoom: false,
      userEnterExitRoomId: otherUserId
    }).set({
      Authorization: `Bearer ${userToken}`
    }).expect(200);
  });

  test("Should not able to remove a user to a room", async () => {
    await request(app).patch(`/roomParticipants/${roomId}`).send({
      enterExitRoom: false,
      userEnterExitRoomId: otherUserId
    }).set({
      Authorization: `Bearer ${userToken}`
    }).expect(400);
  });

  test("Should be able to create a room", async () => {
    await request(app).post("/room").send({
      type: 'private',
      name: 'Room test private',
      description,
    }).set({
      Authorization: `Bearer ${userToken}`
    }).expect(200).then((response) => otherRoomId = response.body._id);
  });

  test("Should be able to add a user to a room", async () => {
    await request(app).patch(`/roomParticipants/${otherRoomId}`).send({
      enterExitRoom: true,
      userEnterExitRoomId: otherUserId
    }).set({
      Authorization: `Bearer ${userToken}`
    }).expect(200);
  });

  test("Should be able to enter a room", async () => {
    await request(app).patch(`/room/${roomId}`).send({
      enterExitRoom: true
    }).set({
      Authorization: `Bearer ${otherUserToken}`
    }).expect(200);
  });

  test("Should be able to change room data a room", async () => {
    await request(app).patch(`/roomAdmin/${roomId}`).send({
      name: 'Update test name room',
      description: 'An updated description',
      transformIntoAdmin: true,
      userIdAdmin: otherUserId
    }).set({
      Authorization: `Bearer ${userToken}`
    }).expect(200);
  });

  test("Should be able to create a room", async () => {
    await request(app).post("/room").send({
      type: 'private',
      name: 'Room test private and remove',
      description,
    }).set({
      Authorization: `Bearer ${userToken}`
    }).expect(200).then((response) => removeRoomId = response.body._id);
  });

  test("Should be able to create a message an room", async () => {
    await request(app).post(`/message/${removeRoomId}`).send({
      message
    }).set({
      Authorization: `Bearer ${userToken}`
    }).expect(200);
  });

  test("Should be able to remove an room", async () => {
    await request(app).delete(`/room/${removeRoomId}`).set({
      Authorization: `Bearer ${otherUserToken}`
    }).expect(400);
  });

  test("Should not able to remove an room", async () => {
    await request(app).delete(`/room/${removeRoomId}`).set({
      Authorization: `Bearer ${userToken}`
    }).expect(200);
  });

  test("Should not able to remove an room", async () => {
    await request(app).delete(`/room/${removeRoomId}`).set({
      Authorization: `Bearer ${userToken}`
    }).expect(400);
  });

})