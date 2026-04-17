const authService = require("../services/authService");

const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      throw Object.assign(new Error("name, email and password are required"), {
        statusCode: 400,
      });
    }

    const user = await authService.register({
      name: String(name).trim(),
      email: String(email).trim().toLowerCase(),
      password: String(password),
    });

    res.status(201).json({ user });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      throw Object.assign(new Error("email and password are required"), {
        statusCode: 400,
      });
    }

    const data = await authService.login({
      email: String(email).trim().toLowerCase(),
      password: String(password),
    });

    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};

const refresh = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      throw Object.assign(new Error("refreshToken is required"), {
        statusCode: 400,
      });
    }

    const data = await authService.refreshAccessToken(String(refreshToken));
    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};

const logout = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      throw Object.assign(new Error("refreshToken is required"), {
        statusCode: 400,
      });
    }

    await authService.logout(String(refreshToken));
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    next(error);
  }
};

const me = async (req, res, next) => {
  try {
    const user = await authService.getUserById(req.user.id);
    res.status(200).json({ user });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  refresh,
  logout,
  me,
};
