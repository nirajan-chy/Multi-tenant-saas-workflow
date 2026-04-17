const express = require("express");

const organizationController = require("../controllers/organizationController");
const taskRoutes = require("./taskRoutes");
const {
  authenticate,
  requireOrganizationMember,
  requireRole,
} = require("../middlewares/authMiddleware");

const router = express.Router();

router.use(authenticate);

router.get("/", organizationController.listMyOrganizations);
router.post("/", organizationController.createOrganization);

router.post(
  "/:organizationId/members",
  requireOrganizationMember,
  requireRole("admin"),
  organizationController.addOrganizationMember,
);

router.use("/:organizationId/tasks", taskRoutes);

module.exports = router;
