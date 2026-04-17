const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

const Organization = sequelize.define(
  "Organization",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },
    created_by: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    tableName: "organizations",
    timestamps: true,
    underscored: true,
  },
);

module.exports = Organization;
