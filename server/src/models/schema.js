const { sequelize } = require("../config/db");
require("./index");

const createSchema = async () => {
  await sequelize.sync();
};

module.exports = {
  createSchema,
};
