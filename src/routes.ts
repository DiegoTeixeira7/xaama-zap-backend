//  Loading modules
import express from "express";
import "express-async-errors";

//  Loading middlewares
import { ensureAuthenticated } from "./middlewares/ensureAuthenticated"

//  Setting up routes
const routes = express.Router();

//  Importing route controllers
import { UserController } from "@controllers/UserController";

//  Loading route controllers
const userController = new UserController();

//  Home
routes.get("/", (req, res) => {
  return res.status(200).send("Backend is running");
});

//  User
routes.post("/user", userController.create);
routes.get("/user", ensureAuthenticated, userController.index);

export { routes }