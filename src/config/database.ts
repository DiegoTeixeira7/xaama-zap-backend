//	Loading mongoose and dotenv modules
import mongoose from "mongoose";
require("dotenv").config();

//	Setting up mongoose
mongoose.Promise = global.Promise;
mongoose.set("useFindAndModify", false);

//	Defining database server
const uri = `mongodb+srv://${process.env.USERNAME}:${process.env.DBPASSWORD}@cluster0.1kiaj.mongodb.net/xaamazap?retryWrites=true&w=majority`;

//	Connecting to database
mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log("Connection to database has been established successfully.");
}).catch((error) => {
  console.error("Unable to connect to the database:\n", error);
});

//	Exporting database connection
module.exports = mongoose;