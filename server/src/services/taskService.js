const { getChannel } = require("../config/rabbitMq");
const { redisClient } = require("../config/redis");
const { Task } = require("../models");
const { getMembership } = require("./organizationService");

const VALID_STATUSES = new Set(["todo", "in-progress", "done"]);

const CACHE_TTL = 60; // seconds

const getCacheKey = organizationId => `tasks:org:${organizationId}`;

const invalidateTaskCache = async organizationId => {
  await redisClient.del(getCacheKey(organizationId));
};

const assertAssigneeInOrganization = async ({ organizationId, assignedTo }) => {
  if (!assignedTo) return;

  const membership = await getMembership({
    organizationId,
    userId: assignedTo,
  });

  if (!membership) {
    throw Object.assign(
      new Error("Assignee must be a member of the organization"),
      { statusCode: 400 },
    );
  }
};

const validateStatus = status => {
  if (status && !VALID_STATUSES.has(status)) {
    throw Object.assign(new Error("Invalid status"), { statusCode: 400 });
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
  validateStatus(status);

  await assertAssigneeInOrganization({
    organizationId,
    assignedTo,
  });

  const task = await Task.create({
    organization_id: organizationId,
    title,
    description: description ?? null,
    status: status ?? "todo",
    assigned_to: assignedTo ?? null,
    created_by: createdBy,
  });

  // 🔹 send event 
  try {
    const channel = getChannel();

    if (channel) {
      channel.sendToQueue(
        "task_queue",
        Buffer.from(
          JSON.stringify({
            type: "TASK_CREATED",
            taskId: task.id,
            organizationId,
          }),
        ),
      );
    }
  } catch (err) {
    console.error("Queue send failed:", err.message);
  }

  //  invalidate cache
  await invalidateTaskCache(organizationId);

  return task.toJSON();
};

const listTasksByOrganization = async organizationId => {
  const key = getCacheKey(organizationId);
  // console.log("Yo key ho hai ", key);

  // Check cache
  const cached = await redisClient.get(key);
  console.log("cache : ", cached);
  if (cached) {
    console.log(`[Redis] Cache hit: ${key}`);
    return JSON.parse(cached);
  }

  const tasks = await Task.findAll({
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
    raw: true, // ensures plain objects
  });

  await redisClient.setEx(key, CACHE_TTL, JSON.stringify(tasks));

  return tasks;
};

const updateTask = async ({
  organizationId,
  taskId,
  title,
  description,
  status,
  assignedTo,
}) => {
  const task = await Task.findOne({
    where: { id: taskId, organization_id: organizationId },
  });

  if (!task) {
    throw Object.assign(new Error("Task not found"), { statusCode: 404 });
  }

  validateStatus(status);

  const nextAssignedTo =
    assignedTo === undefined ? task.assigned_to : assignedTo;

  await assertAssigneeInOrganization({
    organizationId,
    assignedTo: nextAssignedTo,
  });

  if (title !== undefined) task.title = title;
  if (description !== undefined) task.description = description;
  if (status !== undefined) task.status = status;
  task.assigned_to = nextAssignedTo;

  await task.save();

  await invalidateTaskCache(organizationId);

  return task.toJSON();
};

const deleteTask = async ({ organizationId, taskId }) => {
  const deleted = await Task.destroy({
    where: { id: taskId, organization_id: organizationId },
  });

  if (!deleted) {
    throw Object.assign(new Error("Task not found"), { statusCode: 404 });
  }

  await invalidateTaskCache(organizationId);
};

module.exports = {
  createTask,
  listTasksByOrganization,
  updateTask,
  deleteTask,
};
