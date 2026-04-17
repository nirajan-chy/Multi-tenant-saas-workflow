const bcrypt = require("bcryptjs");
const crypto = require("crypto");

const config = require("../config/env");
const { signAccessToken } = require("../utils/jwt");
const { User, RefreshToken } = require("../models");

const hashRefreshToken = token =>
  crypto.createHash("sha256").update(token).digest("hex");

const createRefreshTokenPair = async userId => {
  const refreshToken = crypto.randomBytes(64).toString("hex");
  const tokenHash = hashRefreshToken(refreshToken);
  const expiresAt = new Date(
    Date.now() + config.auth.refreshTokenExpiresDays * 24 * 60 * 60 * 1000,
  );

  await RefreshToken.create({
    user_id: userId,
    token_hash: tokenHash,
    expires_at: expiresAt,
  });

  return refreshToken;
};

const buildAccessToken = user =>
  signAccessToken({
    sub: user.id,
    email: user.email,
    name: user.name,
  });

const register = async ({ name, email, password }) => {
  const existing = await User.findOne({ where: { email }, attributes: ["id"] });
  if (existing) {
    throw Object.assign(new Error("Email already in use"), { statusCode: 409 });
  }

  const passwordHash = await bcrypt.hash(password, 12);

  const user = await User.create({
    name,
    email,
    password_hash: passwordHash,
  });

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    created_at: user.created_at,
  };
};

const login = async ({ email, password }) => {
  const user = await User.findOne({
    where: { email },
    attributes: ["id", "name", "email", "password_hash"],
  });

  if (!user) {
    throw Object.assign(new Error("Invalid email or password"), {
      statusCode: 401,
    });
  }

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

  const tokenRow = await RefreshToken.findOne({
    where: { token_hash: tokenHash },
    attributes: ["id", "user_id", "expires_at", "revoked"],
  });

  if (!tokenRow) {
    throw Object.assign(new Error("Invalid refresh token"), {
      statusCode: 401,
    });
  }

  const expired = new Date(tokenRow.expires_at).getTime() < Date.now();

  if (tokenRow.revoked || expired) {
    throw Object.assign(new Error("Refresh token is expired or revoked"), {
      statusCode: 401,
    });
  }

  await RefreshToken.update({ revoked: true }, { where: { id: tokenRow.id } });

  const user = await User.findByPk(tokenRow.user_id, {
    attributes: ["id", "name", "email"],
  });
  if (!user) {
    throw Object.assign(new Error("User not found"), { statusCode: 404 });
  }

  const accessToken = buildAccessToken(user);
  const newRefreshToken = await createRefreshTokenPair(user.id);

  return {
    accessToken,
    refreshToken: newRefreshToken,
  };
};

const logout = async refreshToken => {
  const tokenHash = hashRefreshToken(refreshToken);

  await RefreshToken.update(
    { revoked: true },
    { where: { token_hash: tokenHash } },
  );
};

const getUserById = async userId => {
  const user = await User.findByPk(userId, {
    attributes: ["id", "name", "email", "created_at"],
  });

  if (!user) {
    throw Object.assign(new Error("User not found"), { statusCode: 404 });
  }

  return user;
};

module.exports = {
  register,
  login,
  refreshAccessToken,
  logout,
  getUserById,
};
