import { useState } from "react";
import api from "../../services/api";

interface Props {
    projectId: string;
    members: { _id: string; name: string }[];
    onCreated: () => void;
}

export default function TaskForm({ projectId, members, onCreated }: Props) {
    const [task, setTask] = useState({ title: "", description: "", status: "todo", assignee: "" });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await api.post("/tasks", { ...task, project: projectId });
        setTask({ title: "", description: "", status: "todo", assignee: "" });
        onCreated();
    };

    return (
        <form onSubmit={handleSubmit} className="mb-6 p-4 border rounded bg-gray-100 space-y-4">
            <input
                type="text"
                placeholder="Task Title"
                value={task.title}
                onChange={(e) => setTask({ ...task, title: e.target.value })}
                className="w-full p-2 border rounded"
                required
            />
            <textarea
                placeholder="Description"
                value={task.description}
                onChange={(e) => setTask({ ...task, description: e.target.value })}
                className="w-full p-2 border rounded"
            />
            <select
                value={task.assignee}
                onChange={(e) => setTask({ ...task, assignee: e.target.value })}
                className="p-2 border rounded w-full"
            >
                <option value="">Unassigned</option>
                {members.map((m) => (
                    <option key={m._id} value={m._id}>
                        {m.name}
                    </option>
                ))}
            </select>
            <select
                value={task.status}
                onChange={(e) => setTask({ ...task, status: e.target.value })}
                className="p-2 border rounded"
            >
                <option value="todo">To Do</option>
                <option value="in-progress">In Progress</option>
                <option value="done">Done</option>
            </select>
            <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">
                Create Task
            </button>
        </form>
    );
}
