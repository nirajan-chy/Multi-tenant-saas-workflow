const { Task } = require("../models");
const { getMembership } = require("./organizationService");

const validStatuses = new Set(["todo", "in-progress", "done"]);

const assertAssigneeInOrganization = async ({ organizationId, assignedTo }) => {
  if (!assignedTo) {
    return;
  }

  const membership = await getMembership({
    organizationId,
    userId: assignedTo,
  });
  if (!membership) {
    throw Object.assign(
      new Error("Assignee must be a member of the organization"),
      {
        statusCode: 400,
      },
    );
  }
};

const createTask = async ({
  organizationId,
  title,
  description,
  status,
  assignedTo,
  createdBy,
}) => {
  if (status && !validStatuses.has(status)) {
    throw Object.assign(new Error("Invalid status"), { statusCode: 400 });
  }

  await assertAssigneeInOrganization({ organizationId, assignedTo });

  return Task.create({
    organization_id: organizationId,
    title,
    description: description || null,
    status: status || "todo",
    assigned_to: assignedTo || null,
    created_by: createdBy,
  });
};

const listTasksByOrganization = async organizationId => {
  return Task.findAll({
    where: { organization_id: organizationId },
    attributes: [
      "id",
      "organization_id",
      "title",
      "description",
      "status",
      "assigned_to",
      "created_by",
      "created_at",
      "updated_at",
    ],
    order: [["created_at", "DESC"]],
  });
};

const updateTask = async ({
  organizationId,
  taskId,
  title,
  description,
  status,
  assignedTo,
}) => {
  const existing = await Task.findOne({
    where: {
      id: taskId,
      organization_id: organizationId,
    },
  });

  if (!existing) {
    throw Object.assign(new Error("Task not found"), { statusCode: 404 });
  }

  if (status && !validStatuses.has(status)) {
    throw Object.assign(new Error("Invalid status"), { statusCode: 400 });
  }

  const nextAssignedTo =
    assignedTo === undefined ? existing.assigned_to : assignedTo;
  await assertAssigneeInOrganization({
    organizationId,
    assignedTo: nextAssignedTo,
  });

  existing.title = title === undefined ? existing.title : title;
  existing.description =
    description === undefined ? existing.description : description;
  existing.status = status === undefined ? existing.status : status;
  existing.assigned_to = nextAssignedTo;

  await existing.save();
  return existing;
};

const deleteTask = async ({ organizationId, taskId }) => {
  const deleted = await Task.destroy({
    where: {
      id: taskId,
      organization_id: organizationId,
    },
  });

  if (!deleted) {
    throw Object.assign(new Error("Task not found"), { statusCode: 404 });
  }
};

module.exports = {
  createTask,
  listTasksByOrganization,
  updateTask,
  deleteTask,
};
