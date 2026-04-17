const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const db = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const organizationRoutes = require("./routes/organizationRoutes");
const { notFoundHandler, errorHandler } = require("./middlewares/errorHandler");

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.get("/health", (_req, res) => {
  res.status(200).json({ ok: true, message: "Server is running" });
});

app.get("/health/db", async (_req, res) => {
  try {
    await db.query("SELECT 1");
    res.status(200).json({ ok: true, message: "Database connected" });
  } catch (error) {
    res.status(503).json({
      ok: false,
      message: "Database not reachable",
      error: error.message,
    });
  }
});

app.use("/api/auth", authRoutes);
app.use("/api/organizations", organizationRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
