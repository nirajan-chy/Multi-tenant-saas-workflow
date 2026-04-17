const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

const Task = sequelize.define(
  "Task",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    organization_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM("todo", "in-progress", "done"),
      allowNull: false,
      defaultValue: "todo",
    },
    assigned_to: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    created_by: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    tableName: "tasks",
    timestamps: true,
    underscored: true,
    indexes: [
      {
        name: "idx_tasks_org",
        fields: ["organization_id"],
      },
      {
        name: "idx_tasks_assigned_to",
        fields: ["assigned_to"],
      },
    ],
  },
);

module.exports = Task;
