//	Loading mongoose and dotenv modules
import mongoose from "mongoose";
require("dotenv").config();
class Database {
  private uri: string;

  //	Setting up database connection
  constructor() {
    mongoose.Promise = global.Promise;
    mongoose.set("useFindAndModify", false);

    //	Defining database server
    this.uri = `mongodb+srv://${process.env.USERNAME}:${process.env.DBPASSWORD}@cluster0.1kiaj.mongodb.net/xaamazap?retryWrites=true&w=majority`;
  }

  //	Connect to database
  public async connect(): Promise<void> {
    //	Connecting to database
    mongoose.connect(this.uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    }).then(() => {
      console.log("Connection to database has been established successfully.");
    }).catch((error) => {
      console.error("Unable to connect to the database:\n", error);
    });
  }
}

//	Exporting database object
export default new Database();