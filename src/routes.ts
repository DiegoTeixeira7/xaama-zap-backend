//  Loading modules
import express from "express";
import "express-async-errors";

//  Setting up routes
const routes = express.Router();

//  Importing route controllers
import { UserController } from "@controllers/UserController";

//  Loading route controllers
const createUserController = new UserController();

//  Home
routes.get("/", (req, res) => {
  return res.status(200).send("Backend is running");
});

//  User
routes.post("/user", createUserController.create);

export { routes }