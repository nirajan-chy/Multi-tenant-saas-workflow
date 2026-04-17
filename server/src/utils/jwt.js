const jwt = require("jsonwebtoken");
const config = require("../config/env");

const signAccessToken = payload =>
  jwt.sign(payload, config.auth.secret, {
    expiresIn: config.auth.accessTokenExpiresIn,
  });

const verifyAccessToken = token => jwt.verify(token, config.auth.secret);

module.exports = {
  signAccessToken,
  verifyAccessToken,
};
