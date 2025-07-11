import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { DragDropContext, type DropResult } from "@hello-pangea/dnd";
import api from "../services/api";
import { useAuth } from "../store/authStore";
import socket from "../socket";

import ProgressBar from "../components/ProjectTasks/ProgressBar";
import InviteForm from "../components/ProjectTasks/InviteForm";
import TaskForm from "../components/ProjectTasks/TaskForm";
import TaskColumn from "../components/ProjectTasks/TaskColumn";
import ProjectDetails from "../components/ProjectTasks/ProjectDetails";
import type { IMember } from "../types";
import { useTasks } from "../store/taskStore";


export default function ProjectTasks() {
    const { project_id } = useParams();
    const [members, setMembers] = useState<IMember[]>([]);
    const [myRole, setMyRole] = useState<string>("");
    const [showForm, setShowForm] = useState(false);
    const user = useAuth((s) => s.user);
    const { tasks, setTasks } = useTasks();

    const fetchTasks = async () => {
        const res = await api.get(`/api/tasks/${project_id}`);
        setTasks(res.data);
    };

    const groupedTasks = {
        todo: tasks.filter((t) => t.status === "todo"),
        "in-progress": tasks.filter((t) => t.status === "in-progress"),
        done: tasks.filter((t) => t.status === "done"),
        testing: tasks.filter((t) => t.status === "testing"),
    };

    const handleDragEnd = async (result: DropResult) => {
        const { source, destination, draggableId } = result;
        if (!destination || source.droppableId === destination.droppableId) return;

        await api.put(`/api/tasks/${draggableId}`, { status: destination.droppableId });
        fetchTasks();
    };

    useEffect(() => {
        if (tasks.length === 0) {
            fetchTasks();
        }

        const fetchMembers = async () => {
            const res = await api.get(`/api/projects/${project_id}/members`);
            setMembers(res.data);
        };

        const fetchMyRole = async () => {
            const res = await api.get(`/api/projects/${project_id}`);
            const project = res.data;
            const member = project.members.find((m: any) => m.user === user?.user._id);
            setMyRole(member?.role);
        };

        fetchMembers();
        fetchMyRole();

        socket.emit("join_project", project_id);
        socket.on("update_task", () => fetchTasks());

        return () => {
            socket.off("update_task");
        };
    }, [project_id]);

    return (
        <div className="px-6 py-1">
            <ProjectDetails project_id={project_id} />
            <ProgressBar tasks={tasks} />

            {myRole === "admin" && <InviteForm project_id={project_id!} />}

            {showForm && (
                <TaskForm
                    project_id={project_id!}
                    members={members}
                    onCreated={() => {
                        setShowForm(false);
                        fetchTasks();
                    }}
                />
            )}
            <div className="flex justify-between items-center mb-3">
                <h1 className="text-xl font-bold">Tasks</h1>
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="flex items-center px-2 py-1 rounded-sm bg-purple-600 text-white font-medium text-sm shadow-md hover:bg-blue-700 active:scale-95 transition-all duration-200"
                >
                    {showForm ? "Cancel" : "+ New Task"}
                </button>

            </div>

            <DragDropContext onDragEnd={handleDragEnd}>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {(["todo", "in-progress", "testing", "done"] as const).map((status) => (
                        <TaskColumn key={status} status={status} tasks={groupedTasks[status]} />
                    ))}
                </div>
            </DragDropContext>
        </div>
    );
}
