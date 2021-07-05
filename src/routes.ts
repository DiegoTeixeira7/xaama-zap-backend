//  Loading express-js and multer modules
import express from "express";
// import "express-async-errors";

//  Setting up routes
const routes = express.Router();

//  Home
routes.get("/", (req, res) => {
  return res.status(200).send("Backend is running");
});

export { routes }