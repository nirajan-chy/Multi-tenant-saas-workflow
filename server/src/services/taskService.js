const db = require("../config/db");
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

  const result = await db.query(
    `INSERT INTO tasks (organization_id, title, description, status, assigned_to, created_by)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING id, organization_id, title, description, status, assigned_to, created_by, created_at, updated_at`,
    [
      organizationId,
      title,
      description || null,
      status || "todo",
      assignedTo || null,
      createdBy,
    ],
  );

  return result.rows[0];
};

const listTasksByOrganization = async organizationId => {
  const result = await db.query(
    `SELECT id, organization_id, title, description, status, assigned_to, created_by, created_at, updated_at
     FROM tasks
     WHERE organization_id = $1
     ORDER BY created_at DESC`,
    [organizationId],
  );

  return result.rows;
};

const updateTask = async ({
  organizationId,
  taskId,
  title,
  description,
  status,
  assignedTo,
}) => {
  const existing = await db.query(
    `SELECT id, organization_id, title, description, status, assigned_to, created_by, created_at, updated_at
     FROM tasks
     WHERE id = $1 AND organization_id = $2`,
    [taskId, organizationId],
  );

  if (!existing.rowCount) {
    throw Object.assign(new Error("Task not found"), { statusCode: 404 });
  }

  if (status && !validStatuses.has(status)) {
    throw Object.assign(new Error("Invalid status"), { statusCode: 400 });
  }

  const nextAssignedTo =
    assignedTo === undefined ? existing.rows[0].assigned_to : assignedTo;
  await assertAssigneeInOrganization({
    organizationId,
    assignedTo: nextAssignedTo,
  });

  const nextTitle = title === undefined ? existing.rows[0].title : title;
  const nextDescription =
    description === undefined ? existing.rows[0].description : description;
  const nextStatus = status === undefined ? existing.rows[0].status : status;

  const result = await db.query(
    `UPDATE tasks
     SET title = $1,
         description = $2,
         status = $3,
         assigned_to = $4,
         updated_at = NOW()
     WHERE id = $5 AND organization_id = $6
     RETURNING id, organization_id, title, description, status, assigned_to, created_by, created_at, updated_at`,
    [
      nextTitle,
      nextDescription,
      nextStatus,
      nextAssignedTo,
      taskId,
      organizationId,
    ],
  );

  return result.rows[0];
};

const deleteTask = async ({ organizationId, taskId }) => {
  const result = await db.query(
    "DELETE FROM tasks WHERE id = $1 AND organization_id = $2 RETURNING id",
    [taskId, organizationId],
  );

  if (!result.rowCount) {
    throw Object.assign(new Error("Task not found"), { statusCode: 404 });
  }
};

module.exports = {
  createTask,
  listTasksByOrganization,
  updateTask,
  deleteTask,
};
