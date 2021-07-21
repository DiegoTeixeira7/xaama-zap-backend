import app from "./app";

const port = process.env.PORT || 4000;

//  Listening requests on the given port
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
}).on("error", (error) => {
  console.error(`Unable to listen to port: ${port}\n`, error);
});