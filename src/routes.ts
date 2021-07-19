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
import { UserRoomController } from "@controllers/UserRoomController";

//  Loading route controllers
const userController = new UserController();
const refreshTokenController = new RefreshTokenController();
const sessionController = new SessionController();
const roomController = new RoomController();
const messageController = new MessageController();
const userRoomController = new UserRoomController();

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

// UserRoom
routes.get("/userRoom", ensureAuthenticated, userRoomController.index);
routes.patch("/userRoom/:roomId", ensureAuthenticated, ensureParticipatesRoom, userRoomController.update);

export { routes }

// TODO: quando o último adm sai de uma sala, algum outro usuário vira adm (helper)
// TODO: quando usuário sair de uma sala, tira o id dessa sala do clear messages id (add no helper)
// TODO: arrumar mensagens de errors/AppError
// TODO: tratar alguns lugares com try catch
// TODO: salvar json d insomnia
// TODO: Implementar testes