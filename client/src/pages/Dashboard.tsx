import { useEffect, useState } from "react";
import { FolderKanban, PlusCircle } from "lucide-react";
import api from "../services/api";
import UserInfo from "../components/Dashboard/UserInfo";
import ProjectGrid from "../components/Dashboard/ProjectGrid";
import AddProjectModal from "../components/Dashboard/AddProjectModal";
import { useUsers } from "../store/userStore";
import { useProjects } from "../store/projectStore";


export default function Dashboard() {
    const [showModal, setShowModal] = useState(false);
    const { setUsers, users } = useUsers();
    const { setProjects, projects } = useProjects();

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const res = await api.get("/api/projects");
                setProjects(res.data);
            } catch (err) {
                console.error("Error loading projects:", err);
            }
        };
        const fetchUsers = async () => {
            try {
                const res = await api.get("/api/auth/users");
                setUsers(res.data);
            } catch (err) {
                console.error("Error loading projects:", err);
            }
        };
        if (users.length === 0) {
            fetchUsers()
        }
        if (projects.length === 0) {
            fetchProjects()
        }
    }, []);

    return (
        <div className="p-6">
            <UserInfo />
            <div className="flex items-center justify-between mb-4">
                <h1 className="text-3xl font-bold flex items-center gap-2">
                    <FolderKanban className="text-blue-500" />
                    Your Projects
                </h1>
                <button
                    className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                    onClick={() => setShowModal(true)}
                >
                    <PlusCircle size={20} /> Add Project
                </button>
            </div>

            <ProjectGrid projects={projects} />
            {showModal && (
                <AddProjectModal
                    onClose={() => setShowModal(false)}
                    onAdd={(project) => setProjects([...projects, project])}
                    users={users}
                />

            )}
        </div>
    );
}
