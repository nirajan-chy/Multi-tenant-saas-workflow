"use client";

import React, { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Task } from "../../types/task";
import { createTask } from "../../services/task-service";

const TaskForm: React.FC<{ initialTask?: Task; onSuccess: () => void }> = ({
  initialTask,
  onSuccess,
}) => {
  const [title, setTitle] = useState(initialTask?.title || "");
  const [description, setDescription] = useState(
    initialTask?.description || "",
  );
  const [dueDate, setDueDate] = useState(initialTask?.dueDate || "");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      await createTask({
        title,
        description,
        dueDate,
        status: "pending",
        priority: "medium",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
      setTitle("");
      setDescription("");
      setDueDate("");
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
        value={dueDate}
        onChange={e => setDueDate(e.target.value)}
        type="date"
      />
      <Button type="submit" disabled={loading}>
        {loading ? "Creating..." : "Create Task"}
      </Button>
    </form>
  );
};

export default TaskForm;
