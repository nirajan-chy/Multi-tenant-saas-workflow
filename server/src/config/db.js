const { Pool } = require("pg");
const config = require("./env");

const pool = new Pool(config.db);

pool.on("error", error => {
  console.error("Unexpected PostgreSQL pool error", error);
});

module.exports = {
  query: (text, params) => pool.query(text, params),
  getClient: () => pool.connect(),
  pool,
};
