const taskService = require("../services/taskService");

const createTask = async (req, res, next) => {
  try {
    const organizationId = Number(req.params.organizationId);
    const { title, description, status, assignedTo } = req.body;

    if (!title) {
      throw Object.assign(new Error("title is required"), { statusCode: 400 });
    }

    const task = await taskService.createTask({
      organizationId,
      title: String(title).trim(),
      description: description ? String(description) : null,
      status: status ? String(status) : undefined,
      assignedTo: assignedTo ?? undefined,
      createdBy: req.user.id,
    });

    res.status(201).json({ task });
  } catch (error) {
    next(error);
  }
};

const listTasks = async (req, res, next) => {
  try {
    const organizationId = Number(req.params.organizationId);
    const tasks = await taskService.listTasksByOrganization(organizationId);
    res.status(200).json({ tasks });
  } catch (error) {
    next(error);
  }
};

const updateTask = async (req, res, next) => {
  try {
    const organizationId = Number(req.params.organizationId);
    const taskId = Number(req.params.taskId);
    if (!Number.isInteger(taskId)) {
      throw Object.assign(new Error("Invalid task id"), { statusCode: 400 });
    }

    const task = await taskService.updateTask({
      organizationId,
      taskId,
      title: req.body.title,
      description: req.body.description,
      status: req.body.status,
      assignedTo: Object.prototype.hasOwnProperty.call(req.body, "assignedTo")
        ? req.body.assignedTo
        : undefined,
    });

    res.status(200).json({ task });
  } catch (error) {
    next(error);
  }
};

const deleteTask = async (req, res, next) => {
  try {
    const organizationId = Number(req.params.organizationId);
    const taskId = Number(req.params.taskId);
    if (!Number.isInteger(taskId)) {
      throw Object.assign(new Error("Invalid task id"), { statusCode: 400 });
    }

    await taskService.deleteTask({ organizationId, taskId });
    res.status(200).json({ message: "Task deleted" });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createTask,
  listTasks,
  updateTask,
  deleteTask,
};
