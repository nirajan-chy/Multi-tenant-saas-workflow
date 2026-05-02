const organizationService = require("../services/organizationService");

const createOrganization = async (req, res, next) => {
  try {
    const { name } = req.body;
    if (!name) {
      throw Object.assign(new Error("name is required"), { statusCode: 400 });
    }

    const organization = await organizationService.createOrganization({
      name: String(name).trim(),
      ownerUserId: req.user.id,
    });

    res.status(201).json({
      organization,
      membership: {
        role: "admin",
      },
    });
  } catch (error) {
    next(error);
  }
};

const updateOrganization = async (req, res, next) => {
  try {
    const organizationId = Number(req.params.organizationId);
    const { name } = req.body;

    if (!Number.isInteger(organizationId)) {
      throw Object.assign(new Error("Invalid organization id"), {
        statusCode: 400,
      });
    }

    if (!name) {
      throw Object.assign(new Error("name is required"), {
        statusCode: 400,
      });
    }

    const organization = await organizationService.updateOrganization({
      organizationId,
      name: String(name).trim(),
    });

    res.status(200).json({ organization });
  } catch (error) {
    next(error);
  }
};

const deleteOrganization = async (req, res, next) => {
  try {
    const organizationId = Number(req.params.organizationId);

    if (!Number.isInteger(organizationId)) {
      throw Object.assign(new Error("Invalid organization id"), {
        statusCode: 400,
      });
    }

    await organizationService.deleteOrganization({ organizationId });
    res.status(200).json({ message: "Organization deleted" });
  } catch (error) {
    next(error);
  }
};

const listMyOrganizations = async (req, res, next) => {
  try {
    const organizations = await organizationService.listOrganizationsForUser(
      req.user.id,
    );
    res.status(200).json({ organizations });
  } catch (error) {
    next(error);
  }
};

const addOrganizationMember = async (req, res, next) => {
  try {
    const organizationId = Number(req.params.organizationId);
    const { userId, role } = req.body;

    if (!Number.isInteger(organizationId)) {
      throw Object.assign(new Error("Invalid organization id"), {
        statusCode: 400,
      });
    }

    if (!Number.isInteger(userId)) {
      throw Object.assign(new Error("userId must be an integer"), {
        statusCode: 400,
      });
    }

    if (!["admin", "user"].includes(role)) {
      throw Object.assign(new Error("role must be one of: admin, user"), {
        statusCode: 400,
      });
    }

    const membership = await organizationService.addUserToOrganization({
      organizationId,
      userId,
      role,
    });

    res.status(201).json({ membership });
  } catch (error) {
    next(error);
  }
};

const listOrganizationMembers = async (req, res, next) => {
  try {
    const organizationId = Number(req.params.organizationId);

    if (!Number.isInteger(organizationId)) {
      throw Object.assign(new Error("Invalid organization id"), {
        statusCode: 400,
      });
    }

    const members =
      await organizationService.listOrganizationMembers(organizationId);

    res.status(200).json({ members });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createOrganization,
  updateOrganization,
  deleteOrganization,
  listMyOrganizations,
  addOrganizationMember,
  listOrganizationMembers,
};
