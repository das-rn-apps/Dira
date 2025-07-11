import { useEffect, useState } from "react";
import {
    User2,
    CalendarClock,
    RefreshCcw,
    BadgeCheck,
    Users2,
} from "lucide-react";
import api from "../../services/api";

interface Member {
    user: {
        email: string;
        name: string;
        _id: string;
    };
    role: string;
}

interface Owner {
    email: string;
    name: string;
    _id: string;
}

interface Project {
    _id: string;
    name: string;
    description: string;
    createdAt?: string;
    updatedAt?: string;
    status?: string;
    members?: Member[];
    owner?: Owner;
}

export default function ProjectDetail({ projectId }: { projectId: string | undefined }) {
    const [project, setProject] = useState<Project | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProject = async () => {
            try {
                const res = await api.get(`/projects/${projectId}`);
                setProject(res.data);
            } catch (err) {
                console.error("Failed to fetch project details:", err);
            } finally {
                setLoading(false);
            }
        };

        if (projectId) fetchProject();
    }, [projectId]);

    if (loading || !project) return null;

    return (
        <div className="w-full px-4 py-1 bg-gray-100 border-b border-gray-200 text-[11px] text-gray-500 flex flex-wrap md:flex-nowrap items-center gap-x-4 gap-y-1 overflow-x-auto whitespace-nowrap">
            <span className="font-bold text-purple-700 text-sm">{project.name}</span>

            {project.status && (
                <span className="flex items-center gap-1 text-green-500">
                    <BadgeCheck className="h-[10px] w-[10px]" />
                    {project.status}
                </span>
            )}

            {project.owner && (
                <span className="flex items-center gap-1">
                    <User2 className="h-[10px] w-[10px]" />
                    Owner: {project.owner.name}
                </span>
            )}

            {project.createdAt && (
                <span className="flex items-center gap-1">
                    <CalendarClock className="h-[10px] w-[10px]" />
                    {new Date(project.createdAt).toLocaleDateString()}
                </span>
            )}

            {project.updatedAt && (
                <span className="flex items-center gap-1 text-orange-400">
                    <RefreshCcw className="h-[10px] w-[10px]" />
                    {new Date(project.updatedAt).toLocaleDateString()}
                </span>
            )}

            {project.members && project.members.length > 0 && (
                <span className="flex items-center gap-1 text-purple-500">
                    <Users2 className="h-[10px] w-[10px]" />
                    Team: {project.members.map((m) => m.user.name).join(", ")}
                </span>
            )}
        </div>
    );
}
