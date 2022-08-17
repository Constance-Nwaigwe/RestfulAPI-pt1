const path = require("path");
const fs = require("fs").promises;

const { db } = require("./api/db");
const { Users } = require("./api/class");

const seed = async () => {
  //
  await db.sync({ force: true });

  const userspath = path.join(__dirname, "data/users.json");

  const usersbuffer = await fs.readFile(userspath);

  const { usersdata } = JSON.parse(String(usersbuffer));

  const userspromise = usersdata.map((user) => Users.create(user));

  await Promise.all(userspromise);

  console.log("success");
};

module.exports = seed;
