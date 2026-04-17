const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

const Membership = sequelize.define(
  "Membership",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    organization_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    role: {
      type: DataTypes.ENUM("admin", "user"),
      allowNull: false,
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "memberships",
    timestamps: false,
    underscored: true,
    indexes: [
      {
        name: "memberships_user_org_unique",
        unique: true,
        fields: ["user_id", "organization_id"],
      },
      {
        name: "idx_memberships_org",
        fields: ["organization_id"],
      },
    ],
  },
);

module.exports = Membership;
