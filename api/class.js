const { db, DataTypes, Model } = require("./db");

class Users extends Model {}

Users.init(
  {
    username: DataTypes.STRING,
    password: DataTypes.STRING,
  },
  {
    sequelize: db,
    timestamps: false,
  }
);

module.exports = { Users };
