const notFoundHandler = (_req, _res, next) => {
  next(Object.assign(new Error("Route not found"), { statusCode: 404 }));
};

const errorHandler = (error, _req, res, next) => {
  void next;
  const statusCode = error.statusCode || 500;

  res.status(statusCode).json({
    message: error.message || "Internal server error",
  });
};

module.exports = {
  notFoundHandler,
  errorHandler,
};
