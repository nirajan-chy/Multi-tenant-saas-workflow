require("./config/env");

const app = require("./app");
const config = require("./config/env");
const db = require("./config/db");
const { createSchema } = require("./models/schema");

const start = async () => {
  try {
    console.log(
      `Checking PostgreSQL connection to ${config.db.host}:${config.db.port}/${config.db.database} ...`,
    );
    await db.query("SELECT NOW() AS current_time");
    console.log("PostgreSQL connection established");

    await createSchema();
    console.log("Database schema is ready");

    app.listen(config.port, () => {
      console.log(`Server listening on port ${config.port}`);
    });
  } catch (error) {
    console.error("Failed to start server");
    console.error(`Database target: ${config.db.host}:${config.db.port}/${config.db.database}`);
    console.error("Reason:", error.message);
    process.exit(1);
  }
};

start();
