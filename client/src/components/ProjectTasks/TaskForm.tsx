import { useState } from "react";
import api from "../../services/api";
import type { IMember } from "../../types";

interface Props {
    project_id: string;
    members: IMember[];
    onCreated: () => void;
}

export default function TaskForm({ project_id, members, onCreated }: Props) {
    const [task, setTask] = useState({
        title: "",
        description: "",
        status: "todo",
        assignee: "",
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await api.post("/api/tasks", { ...task, project_id });
        setTask({ title: "", description: "", status: "todo", assignee: "" });
        onCreated();
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="w-full bg-gray-100 border border-gray-200 rounded-xs p-4 shadow-sm space-y-4 mb-2"
        >
            <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">Title</label>
                <input
                    type="text"
                    value={task.title}
                    onChange={(e) => setTask({ ...task, title: e.target.value })}
                    className="w-full text-sm px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                    placeholder="e.g., Fix login bug"
                    required
                />
            </div>

            <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">Description</label>
                <textarea
                    rows={3}
                    value={task.description}
                    onChange={(e) => setTask({ ...task, description: e.target.value })}
                    className="w-full text-sm px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white resize-none"
                    placeholder="Add more context for the task..."
                />
            </div>

            <div className="flex gap-4">
                <div className="flex-1">
                    <label className="block text-xs font-semibold text-gray-500 mb-1">Assignee</label>
                    <select
                        value={task.assignee}
                        onChange={(e) => setTask({ ...task, assignee: e.target.value })}
                        className="w-full text-sm px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                    >
                        <option value="">Unassigned</option>
                        {members.map((m) => (
                            <option key={`${m.user._id} ${m.role}`} value={m.user._id}>
                                {m.user.name}({m.role})
                            </option>
                        ))}
                    </select>
                </div>

                <div className="flex-1">
                    <label className="block text-xs font-semibold text-gray-500 mb-1">Status</label>
                    <select
                        value={task.status}
                        onChange={(e) => setTask({ ...task, status: e.target.value })}
                        className="w-full text-sm px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                    >
                        <option value="todo">To Do</option>
                        <option value="in-progress">In Progress</option>
                        <option value="done">Done</option>
                    </select>
                </div>
            </div>

            <div className="text-right">
                <button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2 px-4 rounded-md transition"
                >
                    Create Task
                </button>
            </div>
        </form>
    );
}
