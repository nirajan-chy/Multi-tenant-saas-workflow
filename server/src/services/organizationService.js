const { sequelize } = require("../config/db");
const { User, Organization, Membership, Task } = require("../models");

const createOrganization = async ({ name, ownerUserId }) => {
  return sequelize.transaction(async transaction => {
    const org = await Organization.create(
      {
        name,
        created_by: ownerUserId,
      },
      { transaction },
    );

    await Membership.create(
      {
        user_id: ownerUserId,
        organization_id: org.id,
        role: "admin",
      },
      { transaction },
    );

    return org;
  });
};

const updateOrganization = async ({ organizationId, name }) => {
  const organization = await Organization.findByPk(organizationId);

  if (!organization) {
    throw Object.assign(new Error("Organization not found"), {
      statusCode: 404,
    });
  }

  organization.name = name;
  await organization.save();

  return organization;
};

const deleteOrganization = async ({ organizationId }) => {
  await sequelize.transaction(async transaction => {
    await Task.destroy({
      where: { organization_id: organizationId },
      transaction,
    });
    await Membership.destroy({
      where: { organization_id: organizationId },
      transaction,
    });
    const deleted = await Organization.destroy({
      where: { id: organizationId },
      transaction,
    });

    if (!deleted) {
      throw Object.assign(new Error("Organization not found"), {
        statusCode: 404,
      });
    }
  });
};

const getMembership = async ({ organizationId, userId }) => {
  const membership = await Membership.findOne({
    where: {
      organization_id: organizationId,
      user_id: userId,
    },
    attributes: ["id", "user_id", "organization_id", "role"],
  });

  return membership;
};

const listOrganizationsForUser = async userId => {
  const memberships = await Membership.findAll({
    where: { user_id: userId },
    attributes: ["role"],
    include: [
      {
        model: Organization,
        as: "organization",
        attributes: ["id", "name", "created_at"],
        required: true,
      },
    ],
    order: [
      [{ model: Organization, as: "organization" }, "created_at", "DESC"],
    ],
  });

  return memberships.map(membership => ({
    id: membership.organization.id,
    name: membership.organization.name,
    role: membership.role,
    created_at: membership.organization.created_at,
  }));
};

const listOrganizationMembers = async organizationId => {
  const memberships = await Membership.findAll({
    where: { organization_id: organizationId },
    attributes: ["id", "role", "created_at"],
    include: [
      {
        model: User,
        as: "user",
        attributes: ["id", "name", "email", "created_at"],
        required: true,
      },
    ],
    order: [["created_at", "ASC"]],
  });

  return memberships.map(membership => ({
    id: membership.id,
    role: membership.role,
    created_at: membership.created_at,
    user: membership.user,
  }));
};

const addUserToOrganization = async ({ organizationId, userId, role }) => {
  const userExists = await User.findByPk(userId, { attributes: ["id"] });
  if (!userExists) {
    throw Object.assign(new Error("User not found"), { statusCode: 404 });
  }

  const orgExists = await Organization.findByPk(organizationId, {
    attributes: ["id"],
  });
  if (!orgExists) {
    throw Object.assign(new Error("Organization not found"), {
      statusCode: 404,
    });
  }

  const existing = await Membership.findOne({
    where: {
      user_id: userId,
      organization_id: organizationId,
    },
  });

  if (existing) {
    existing.role = role;
    await existing.save();
    return existing;
  }

  return Membership.create({
    user_id: userId,
    organization_id: organizationId,
    role,
  });
};

module.exports = {
  createOrganization,
  updateOrganization,
  deleteOrganization,
  getMembership,
  listOrganizationsForUser,
  listOrganizationMembers,
  addUserToOrganization,
};
