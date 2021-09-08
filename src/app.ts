//  Loading express.js, CORS, database and routes modules
import express, { NextFunction, Request, Response } from "express";
import { AppError } from "./errors/AppError";

import cors from "cors";
import { routes } from "./routes"
import db from "./config/database";

class App {
  public express: express.Application;

  constructor() {
    this.express = express();

    this.database();
    this.middlewares();
    this.routes();
    this.appError();
  }

  //	Using resources as middlewares
  private middlewares(): void {
    //  Configuring CORS
    const corsOptions = {
      origin: process.env.URL,
      optionsSuccessStatus: 200
    };

    this.express.use(express.json());
    this.express.use(cors(corsOptions));
  }

  //	Implementing routes
  private routes(): void {
    this.express.use(routes);
  }

  private appError(): void {
    this.express.use(
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
  }

  //	Connect to database
  private database(): void {
    db.connect();
  }

}

//	Exporting app object
export default new App().express;