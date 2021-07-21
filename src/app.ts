//  Loading express.js, CORS, database and routes modules
import express, { NextFunction, Request, Response } from "express";
import { AppError } from "./errors/AppError";

import cors from "cors";
import { routes } from "./routes"
require("./config/database");

//  Setting up express and port number
const app = express();

//  Configuring CORS
const corsOptions = {
  origin: process.env.URL,
  optionsSuccessStatus: 200
};

//  Must be below middleware
//  Using modules
app.use(express.json());
app.use(cors(corsOptions));
app.use(routes);

app.use(
  (err: Error, request: Request, response: Response, _next: NextFunction) => {
    if (err instanceof AppError) {
      return response.status(err.statusCode).json({
        message: err.message,
      });
    }

    return response.status(500).json({
      status: "Error",
      message: "Internal server error",
    });
  }
);

export default app;