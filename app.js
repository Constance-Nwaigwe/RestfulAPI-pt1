const express = require("express");

const app = express();

const bookRouter = express.Router();

const port = 4000;

bookRouter.route("/books").get((req, res) => {
  const response = { hello: "Hi there" };
  res.json(response);
});

app.use("/api", bookRouter);

app.get("/", (req, res) => {
  res.send("Welcome to RestfulAPI");
});

app.listen(port, () => {
  console.log(`Running app at port ${port}`);
});
