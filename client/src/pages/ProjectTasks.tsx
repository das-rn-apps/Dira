import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { DragDropContext, type DropResult } from "@hello-pangea/dnd";
import api from "../services/api";
import { useAuth, type User } from "../store/auth";
import socket from "../socket";

import ProgressBar from "../components/ProjectTasks/ProgressBar";
import InviteForm from "../components/ProjectTasks/InviteForm";
import TaskForm from "../components/ProjectTasks/TaskForm";
import TaskColumn from "../components/ProjectTasks/TaskColumn";
import ProjectDetails from "../components/ProjectTasks/ProjectDetails";

export interface Task {
    _id: string;
    title: string;
    description: string;
    assignee: User;
    status: "todo" | "in-progress" | "done";
}

export default function ProjectTasks() {
    const { projectId } = useParams();
    const [tasks, setTasks] = useState<Task[]>([]);
    const [members, setMembers] = useState<{ _id: string; name: string }[]>([]);
    const [myRole, setMyRole] = useState<string>("");
    const [showForm, setShowForm] = useState(false);
    const user = useAuth((s) => s.user);

    const fetchTasks = async () => {
        const res = await api.get(`/tasks/${projectId}`);
        setTasks(res.data);
    };

    const groupedTasks = {
        todo: tasks.filter((t) => t.status === "todo"),
        "in-progress": tasks.filter((t) => t.status === "in-progress"),
        done: tasks.filter((t) => t.status === "done"),
    };

    const handleDragEnd = async (result: DropResult) => {
        const { source, destination, draggableId } = result;
        if (!destination || source.droppableId === destination.droppableId) return;

        await api.put(`/tasks/${draggableId}`, { status: destination.droppableId });
        fetchTasks();
    };

    useEffect(() => {
        fetchTasks();

        const fetchMembers = async () => {
            const res = await api.get(`/projects/${projectId}/members`);
            setMembers(res.data);
        };

        const fetchRole = async () => {
            const res = await api.get(`/projects/${projectId}`);
            const project = res.data;
            const member = project.members.find((m: any) => m.user === user?.user._id);
            setMyRole(member?.role);
        };

        fetchMembers();
        fetchRole();

        socket.emit("join_project", projectId);
        socket.on("update_task", () => fetchTasks());

        return () => {
            socket.off("update_task");
        };
    }, [projectId]);

    return (
        <div className="px-6 py-1">
            <ProjectDetails projectId={projectId} />
            <ProgressBar tasks={tasks} />

            {myRole === "admin" && <InviteForm projectId={projectId!} />}

            {showForm && <TaskForm projectId={projectId!} members={members} onCreated={fetchTasks} />}

            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Tasks</h1>
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="flex items-center px-2 py-1 rounded-sm bg-purple-600 text-white font-medium text-sm shadow-md hover:bg-blue-700 active:scale-95 transition-all duration-200"
                >
                    {showForm ? "Cancel" : "+ New Task"}
                </button>

            </div>

            <DragDropContext onDragEnd={handleDragEnd}>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {(["todo", "in-progress", "done"] as const).map((status) => (
                        <TaskColumn key={status} status={status} tasks={groupedTasks[status]} members={members} />
                    ))}
                </div>
            </DragDropContext>
        </div>
    );
}
