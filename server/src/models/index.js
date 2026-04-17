const User = require("./User");
const Organization = require("./Organization");
const Membership = require("./Membership");
const Task = require("./Task");
const RefreshToken = require("./RefreshToken");

Organization.belongsTo(User, {
  foreignKey: "created_by",
  as: "creator",
  onDelete: "RESTRICT",
});
User.hasMany(Organization, {
  foreignKey: "created_by",
  as: "organizationsCreated",
});

Membership.belongsTo(User, {
  foreignKey: "user_id",
  as: "user",
  onDelete: "CASCADE",
});
Membership.belongsTo(Organization, {
  foreignKey: "organization_id",
  as: "organization",
  onDelete: "CASCADE",
});
User.hasMany(Membership, { foreignKey: "user_id", as: "memberships" });
Organization.hasMany(Membership, {
  foreignKey: "organization_id",
  as: "memberships",
});

Task.belongsTo(Organization, {
  foreignKey: "organization_id",
  as: "organization",
  onDelete: "CASCADE",
});
Task.belongsTo(User, {
  foreignKey: "assigned_to",
  as: "assignee",
  onDelete: "SET NULL",
});
Task.belongsTo(User, {
  foreignKey: "created_by",
  as: "creator",
  onDelete: "RESTRICT",
});
Organization.hasMany(Task, { foreignKey: "organization_id", as: "tasks" });

RefreshToken.belongsTo(User, {
  foreignKey: "user_id",
  as: "user",
  onDelete: "CASCADE",
});
User.hasMany(RefreshToken, { foreignKey: "user_id", as: "refreshTokens" });

module.exports = {
  User,
  Organization,
  Membership,
  Task,
  RefreshToken,
};
