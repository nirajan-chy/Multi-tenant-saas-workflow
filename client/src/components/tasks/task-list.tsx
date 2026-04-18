import React from "react";
import TaskCard from "./task-card";
import { useTasks } from "../../features/tasks/hooks";

const TaskList: React.FC = () => {
  const { tasks, loading, error } = useTasks();

  if (loading) {
    return <div>Loading tasks...</div>;
  }

  if (error) {
    return <div>Error loading tasks: {error}</div>;
  }

  return (
    <div className="task-list">
      {tasks.length === 0 ? (
        <div>No tasks available</div>
      ) : (
        tasks.map(task => <TaskCard key={task.id} task={task} />)
      )}
    </div>
  );
};

export default TaskList;
