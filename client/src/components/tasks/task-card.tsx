import React from "react";
import { Task } from "../../types/task";

interface TaskCardProps {
  task: Task;
  onEdit?: () => void;
  onDelete?: () => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onEdit, onDelete }) => {
  return (
    <div className="bg-white shadow-md rounded-lg p-4 mb-4">
      <h3 className="text-lg font-semibold">{task.title}</h3>
      <p className="text-gray-600">{task.description}</p>
      <div className="flex justify-between mt-4">
        <button onClick={onEdit} className="text-blue-500 hover:underline">
          Edit
        </button>
        <button onClick={onDelete} className="text-red-500 hover:underline">
          Delete
        </button>
      </div>
    </div>
  );
};

export default TaskCard;
