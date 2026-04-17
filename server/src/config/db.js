const { Sequelize } = require("sequelize");
const config = require("./env");

const sequelize = new Sequelize(
  config.db.database,
  config.db.user,
  config.db.password,
  {
    host: config.db.host,
    port: config.db.port,
    dialect: "postgres",
    logging: false,
    dialectOptions: config.db.ssl ? { ssl: config.db.ssl } : {},
  },
);

sequelize.authenticate().catch(error => {
  console.error("Unexpected PostgreSQL Sequelize error", error);
});

module.exports = {
  sequelize,
  query: (text, params) => sequelize.query(text, { bind: params }),
};
