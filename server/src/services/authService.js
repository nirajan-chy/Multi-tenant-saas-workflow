const bcrypt = require("bcryptjs");
const crypto = require("crypto");

const db = require("../config/db");
const config = require("../config/env");
const { signAccessToken } = require("../utils/jwt");

const hashRefreshToken = token =>
  crypto.createHash("sha256").update(token).digest("hex");

const createRefreshTokenPair = async userId => {
  const refreshToken = crypto.randomBytes(64).toString("hex");
  const tokenHash = hashRefreshToken(refreshToken);
  const expiresAt = new Date(
    Date.now() + config.auth.refreshTokenExpiresDays * 24 * 60 * 60 * 1000,
  );

  await db.query(
    `INSERT INTO refresh_tokens (user_id, token_hash, expires_at)
     VALUES ($1, $2, $3)`,
    [userId, tokenHash, expiresAt],
  );

  return refreshToken;
};

const buildAccessToken = user =>
  signAccessToken({
    sub: user.id,
    email: user.email,
    name: user.name,
  });

const register = async ({ name, email, password }) => {
  const existing = await db.query("SELECT id FROM users WHERE email = $1", [
    email,
  ]);
  if (existing.rowCount) {
    throw Object.assign(new Error("Email already in use"), { statusCode: 409 });
  }

  const passwordHash = await bcrypt.hash(password, 12);

  const result = await db.query(
    `INSERT INTO users (name, email, password_hash)
     VALUES ($1, $2, $3)
     RETURNING id, name, email, created_at`,
    [name, email, passwordHash],
  );

  return result.rows[0];
};

const login = async ({ email, password }) => {
  const result = await db.query(
    `SELECT id, name, email, password_hash
     FROM users
     WHERE email = $1`,
    [email],
  );

  if (!result.rowCount) {
    throw Object.assign(new Error("Invalid email or password"), {
      statusCode: 401,
    });
  }

  const user = result.rows[0];
  const isValid = await bcrypt.compare(password, user.password_hash);

  if (!isValid) {
    throw Object.assign(new Error("Invalid email or password"), {
      statusCode: 401,
    });
  }

  const accessToken = buildAccessToken(user);
  const refreshToken = await createRefreshTokenPair(user.id);

  return {
    accessToken,
    refreshToken,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
    },
  };
};

const refreshAccessToken = async refreshToken => {
  const tokenHash = hashRefreshToken(refreshToken);

  const tokenResult = await db.query(
    `SELECT id, user_id, expires_at, revoked
     FROM refresh_tokens
     WHERE token_hash = $1`,
    [tokenHash],
  );

  if (!tokenResult.rowCount) {
    throw Object.assign(new Error("Invalid refresh token"), {
      statusCode: 401,
    });
  }

  const tokenRow = tokenResult.rows[0];
  const expired = new Date(tokenRow.expires_at).getTime() < Date.now();

  if (tokenRow.revoked || expired) {
    throw Object.assign(new Error("Refresh token is expired or revoked"), {
      statusCode: 401,
    });
  }

  await db.query("UPDATE refresh_tokens SET revoked = TRUE WHERE id = $1", [
    tokenRow.id,
  ]);

  const userResult = await db.query(
    "SELECT id, name, email FROM users WHERE id = $1",
    [tokenRow.user_id],
  );
  if (!userResult.rowCount) {
    throw Object.assign(new Error("User not found"), { statusCode: 404 });
  }

  const user = userResult.rows[0];
  const accessToken = buildAccessToken(user);
  const newRefreshToken = await createRefreshTokenPair(user.id);

  return {
    accessToken,
    refreshToken: newRefreshToken,
  };
};

const logout = async refreshToken => {
  const tokenHash = hashRefreshToken(refreshToken);

  await db.query(
    "UPDATE refresh_tokens SET revoked = TRUE WHERE token_hash = $1",
    [tokenHash],
  );
};

const getUserById = async userId => {
  const result = await db.query(
    "SELECT id, name, email, created_at FROM users WHERE id = $1",
    [userId],
  );

  if (!result.rowCount) {
    throw Object.assign(new Error("User not found"), { statusCode: 404 });
  }

  return result.rows[0];
};

module.exports = {
  register,
  login,
  refreshAccessToken,
  logout,
  getUserById,
};
