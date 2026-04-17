const express = require("express");

const taskController = require("../controllers/taskController");
const {
  requireOrganizationMember,
  requireRole,
} = require("../middlewares/authMiddleware");

const router = express.Router({ mergeParams: true });

router.use(requireOrganizationMember);

router.get("/", taskController.listTasks);
router.post("/", taskController.createTask);
router.put("/:taskId", taskController.updateTask);
router.delete("/:taskId", requireRole("admin"), taskController.deleteTask);

module.exports = router;
