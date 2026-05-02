"use client";

import React, { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Task } from "../../types/task";
import { createTask } from "../../services/task-service";

const TaskForm: React.FC<{
  organizationId: number;
  initialTask?: Task;
  onSuccess: () => void;
}> = ({ organizationId, initialTask, onSuccess }) => {
  const [title, setTitle] = useState(initialTask?.title || "");
  const [description, setDescription] = useState(
    initialTask?.description || "",
  );
  const [status, setStatus] = useState<Task["status"]>(
    initialTask?.status || "todo",
  );
  const [assignedTo, setAssignedTo] = useState(
    initialTask?.assignedTo?.toString() || "",
  );
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      await createTask(organizationId, {
        title,
        description,
        status,
        assignedTo: assignedTo ? Number(assignedTo) : null,
      });
      setTitle("");
      setDescription("");
      setStatus("todo");
      setAssignedTo("");
      onSuccess();
    } catch (error) {
      console.error("Error creating task:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="task-form">
      <Input
        value={title}
        onChange={e => setTitle(e.target.value)}
        placeholder="Task Title"
        required
      />
      <Input
        value={description}
        onChange={e => setDescription(e.target.value)}
        placeholder="Task Description"
      />
      <Input
        value={assignedTo}
        onChange={e => setAssignedTo(e.target.value)}
        placeholder="Assigned To User ID"
        type="number"
      />
      <select
        value={status}
        onChange={e => setStatus(e.target.value as Task["status"])}
        className="rounded-md border border-gray-300 p-2"
      >
        <option value="todo">Todo</option>
        <option value="in-progress">In Progress</option>
        <option value="done">Done</option>
      </select>
      <Button type="submit" disabled={loading}>
        {loading ? "Creating..." : "Create Task"}
      </Button>
    </form>
  );
};

export default TaskForm;
