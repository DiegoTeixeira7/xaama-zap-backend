//  Loading modules
import express from "express";
import "express-async-errors";

//  Loading middlewares
import { ensureAuthenticated } from "./middlewares/ensureAuthenticated";
import { ensureParticipatesRoom } from "./middlewares/ensureParticipatesRoom"
import { ensureAdminRoom } from "./middlewares/ensureAdminRoom"

//  Setting up routes
const routes = express.Router();

//  Importing route controllers
import { UserController } from "@controllers/UserController";
import { RefreshTokenController } from "@controllers/RefreshTokenController";
import { SessionController } from "@controllers/SessionController";
import { RoomController } from "@controllers/RoomController";
import { MessageController } from "@controllers/MessageController";

//  Loading route controllers
const userController = new UserController();
const refreshTokenController = new RefreshTokenController();
const sessionController = new SessionController();
const roomController = new RoomController();
const messageController = new MessageController();

//  Home
routes.get("/", (req, res) => {
  return res.status(200).send("Backend is running");
});

//  User
routes.post("/user", userController.create);
routes.get("/user", ensureAuthenticated, userController.index);

//  Refresh Token
routes.post("/refreshToken/:refreshTokenId", refreshTokenController.handle);

//  Session
routes.post("/login", sessionController.create);
routes.post("/logout", ensureAuthenticated, sessionController.logout);

//  Room
routes.post("/room", ensureAuthenticated, roomController.create);
routes.get("/room/:roomId", ensureAuthenticated, ensureParticipatesRoom, roomController.index);
routes.patch("/room/:roomId", ensureAuthenticated, roomController.update);
routes.patch("/roomParticipants/:roomId", ensureAuthenticated, ensureParticipatesRoom, ensureAdminRoom, roomController.updateParticipants);
routes.patch("/roomAdmin/:roomId", ensureAuthenticated, ensureParticipatesRoom, ensureAdminRoom, roomController.updateByAdmin);
routes.delete("/room/:roomId", ensureAuthenticated, ensureParticipatesRoom, ensureAdminRoom, roomController.delete);

// Message
routes.post("/message/:roomId", ensureAuthenticated, ensureParticipatesRoom, messageController.create);

export { routes }