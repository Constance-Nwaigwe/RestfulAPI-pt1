const express = require("express");

const app = express();

const port = 4000;

const { Users } = require("./api/class");
const seed = require("./seed");

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Welcome to RestfulAPI");
});

//get all users
app.get("/users", async (req, res) => {
  const users = await Users.findAll();
  res.json({ users });
});
//get user by id
app.get("/users/:id", async (req, res) => {
  const user = await Users.findByPk(req.params.id);
  res.json({ user });
});
//post a new users
app.post("/users", async (req, res) => {
  const newuser = await Users.create(req.body);
  res.json({ newuser });
});

//update user info
app.put("/users/:id", async (req, res) => {
  const user = await Users.update(req.body, { where: { id: req.params.id } });
  res.json({ user });
});

//Delete user
app.delete("/users/:id", async (req, res) => {
  await Users.destroy({ where: { id: req.params.id } });
  res.json({ message: "User deleted" });
});

app.listen(port, async () => {
  await seed();
  console.log(`Running app on port ${port} at http://localhost:${port}`);
});
