const express = require("express");

const authController = require("../controllers/authController");
const { authenticate } = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/register", authController.register);
router.post("/login", authController.login);
router.post("/refresh", authController.refresh);
router.post("/logout", authController.logout);
router.post("/forgot-password", (_req, res) => {
  res.status(200).json({
    message: "Password reset is not implemented yet.",
  });
});
router.get("/me", authenticate, authController.me);

module.exports = router;
