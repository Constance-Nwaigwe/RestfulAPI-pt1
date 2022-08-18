const express = require("express");
const bcrypt = require("bcrypt");
const saltRounds = 10;

const app = express();

const port = process.env.PORT || 4000;

const { expressjwt: jwt } = require("express-jwt");
const jwks = require("jwks-rsa");

const { Users } = require("./api/class");
const seed = require("./seed");

app.use(express.json());

const jwtCheck = jwt({
  secret: jwks.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: "https://dev-0nf0mzq3.us.auth0.com/.well-known/jwks.json",
  }),
  audience: "http://localhost:4000",
  issuer: "https://dev-0nf0mzq3.us.auth0.com/",
  algorithms: ["RS256"],
});

app.use(jwtCheck);

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
  const username = req.body.username;
  const password = req.body.password;

  bcrypt.hash(password, saltRounds, async function (err, hash) {
    const newuser = await Users.create({ username: username, password: hash });
    res.json({ newuser });
  });
  // const newuser = await Users.create(req.body);
  // res.json({ newuser });
});

//New session
app.post("/session", async (req, res) => {
  const thisuser = await Users.findOne({
    where: { username: req.body.username },
  });
  if (!thisuser) {
    res.json({ message: "no user found by that username" });
  } else {
    bcrypt.compare(
      req.body.password,
      thisuser.password,
      async function (err, result) {
        if (result) {
          res.json({ thisuser });
        } else {
          res.json({ message: "password do not match" });
        }
      }
    );
  }
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
