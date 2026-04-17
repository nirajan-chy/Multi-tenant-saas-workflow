const db = require("../config/db");

const createOrganization = async ({ name, ownerUserId }) => {
  const client = await db.getClient();

  try {
    await client.query("BEGIN");

    const orgResult = await client.query(
      `INSERT INTO organizations (name, created_by)
       VALUES ($1, $2)
       RETURNING id, name, created_by, created_at`,
      [name, ownerUserId],
    );

    const org = orgResult.rows[0];

    await client.query(
      `INSERT INTO memberships (user_id, organization_id, role)
       VALUES ($1, $2, 'admin')`,
      [ownerUserId, org.id],
    );

    await client.query("COMMIT");
    return org;
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};

const getMembership = async ({ organizationId, userId }) => {
  const result = await db.query(
    `SELECT id, user_id, organization_id, role
     FROM memberships
     WHERE organization_id = $1 AND user_id = $2`,
    [organizationId, userId],
  );

  return result.rows[0] || null;
};

const listOrganizationsForUser = async userId => {
  const result = await db.query(
    `SELECT o.id, o.name, m.role, o.created_at
     FROM memberships m
     JOIN organizations o ON o.id = m.organization_id
     WHERE m.user_id = $1
     ORDER BY o.created_at DESC`,
    [userId],
  );

  return result.rows;
};

const addUserToOrganization = async ({ organizationId, userId, role }) => {
  const userExists = await db.query("SELECT id FROM users WHERE id = $1", [
    userId,
  ]);
  if (!userExists.rowCount) {
    throw Object.assign(new Error("User not found"), { statusCode: 404 });
  }

  const orgExists = await db.query(
    "SELECT id FROM organizations WHERE id = $1",
    [organizationId],
  );
  if (!orgExists.rowCount) {
    throw Object.assign(new Error("Organization not found"), {
      statusCode: 404,
    });
  }

  const result = await db.query(
    `INSERT INTO memberships (user_id, organization_id, role)
     VALUES ($1, $2, $3)
     ON CONFLICT (user_id, organization_id)
     DO UPDATE SET role = EXCLUDED.role
     RETURNING id, user_id, organization_id, role, created_at`,
    [userId, organizationId, role],
  );

  return result.rows[0];
};

module.exports = {
  createOrganization,
  getMembership,
  listOrganizationsForUser,
  addUserToOrganization,
};
