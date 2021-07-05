//  Loading express.js, CORS, database and routes modules
import express from "express";

const cors = require("cors");
import { routes } from "./routes"
//require("./config/database");

//  Setting up express and port number
const app = express();
const port = process.env.PORT || 4000;

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

//  Listening requests on the given port
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
}).on("error", (error) => {
  console.error(`Unable to listen to port: ${port}\n`, error);
});