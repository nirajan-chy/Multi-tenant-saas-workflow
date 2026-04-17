const dotenv = require("dotenv");

dotenv.config();

const required = [
  "PORT",
  "DB_NAME",
  "DB_HOST",
  "DB_PORT",
  "DB_USER",
  "DB_PASSWORD",
  "SECRET_KEY",
];

for (const key of required) {
  if (!process.env[key]) {
    throw new Error(`Missing required env var: ${key}`);
  }
}

module.exports = {
  port: Number(process.env.PORT),
  db: {
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    ssl:
      process.env.DB_SSL === "true" ||
      process.env.DB_HOST.includes("aivencloud.com")
        ? { rejectUnauthorized: false }
        : false,
  },
  auth: {
    secret: process.env.SECRET_KEY,
    accessTokenExpiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN || "15m",
    refreshTokenExpiresDays: Number(
      process.env.REFRESH_TOKEN_EXPIRES_DAYS || 7,
    ),
  },
};
