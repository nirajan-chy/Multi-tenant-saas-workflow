const { verifyAccessToken } = require("../utils/jwt");
const { getMembership } = require("../services/organizationService");

const authenticate = (req, _res, next) => {
  const authHeader = req.headers.authorization || "";
  const [scheme, token] = authHeader.split(" ");

  if (scheme !== "Bearer" || !token) {
    return next(
      Object.assign(new Error("Missing or invalid Authorization header"), {
        statusCode: 401,
      }),
    );
  }

  try {
    const payload = verifyAccessToken(token);
    req.user = {
      id: payload.sub,
      email: payload.email,
      name: payload.name,
    };
    return next();
  } catch (_error) {
    return next(
      Object.assign(new Error("Invalid or expired access token"), {
        statusCode: 401,
      }),
    );
  }
};

const requireOrganizationMember = async (req, _res, next) => {
  try {
    const organizationId = Number(req.params.organizationId);
    if (!Number.isInteger(organizationId)) {
      throw Object.assign(new Error("Invalid organization id"), {
        statusCode: 400,
      });
    }

    const membership = await getMembership({
      organizationId,
      userId: req.user.id,
    });

    if (!membership) {
      throw Object.assign(
        new Error("You are not a member of this organization"),
        { statusCode: 403 },
      );
    }

    req.organization = { id: organizationId };
    req.membership = membership;
    next();
  } catch (error) {
    next(error);
  }
};

const requireRole =
  (...allowedRoles) =>
  (req, _res, next) => {
    if (!req.membership || !allowedRoles.includes(req.membership.role)) {
      return next(
        Object.assign(new Error("Insufficient permissions"), {
          statusCode: 403,
        }),
      );
    }

    return next();
  };

module.exports = {
  authenticate,
  requireOrganizationMember,
  requireRole,
};
