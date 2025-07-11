import { useNavigate } from "react-router-dom";
import {
    User2,
    CalendarClock,
    RefreshCcw,
    BadgeCheck,
    Users2,
    ListChecks,
} from "lucide-react";
import type { IProject } from "../../types";

export default function ProjectCard({
    _id,
    name,
    description,
    createdAt,
    updatedAt,
    status,
    owner,
    members,
    tasks,
}: IProject) {
    const navigate = useNavigate();

    const statusColors: Record<string, string> = {
        Completed: "bg-green-100 text-green-700",
        "In Progress": "bg-yellow-100 text-yellow-700",
        "Not Started": "bg-gray-100 text-gray-600",
        default: "bg-blue-100 text-blue-700",
    };

    return (
        <div
            onClick={() => navigate(`/project/${_id}`)}
            className="bg-sky-50 rounded-xs border border-sky-200 shadow-xs hover:shadow-sm transition cursor-pointer px-4 py-3 space-y-2"
        >
            {/* Title & Description */}
            <div>
                <h2 className="text-base font-semibold text-gray-800 truncate">{name}</h2>
                <p
                    className="text-xs text-gray-500 mb-2"
                    title={description}
                >
                    {description.length > 35
                        ? description.slice(0, 35) + "..."
                        : description}
                </p>
            </div>

            {/* Status */}
            {status && (
                <span
                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium ${statusColors[status] || statusColors.default}`}
                >
                    <BadgeCheck className="h-3 w-3" />
                    {status}
                </span>
            )}

            {/* Meta */}
            <div className="text-[11px] text-gray-600 space-y-1">
                <div className="flex items-center gap-1">
                    <User2 className="h-3 w-3 text-blue-500" />
                    <span className="font-medium">Owner:</span> {owner?.name}
                </div>

                <div className="flex items-center gap-1">
                    <CalendarClock className="h-3 w-3 text-gray-500" />
                    <span className="font-medium">Created:</span>{" "}
                    {new Date(createdAt).toLocaleDateString()}
                </div>

                <div className="flex items-center gap-1">
                    <RefreshCcw className="h-3 w-3 text-orange-500" />
                    <span className="font-medium">Updated:</span>{" "}
                    {new Date(updatedAt).toLocaleDateString()}
                </div>

                <div className="flex items-center gap-1">
                    <ListChecks className="h-3 w-3 text-green-600" />
                    <span className="font-medium">Tasks:</span> {tasks?.length || 0}
                </div>

                {members.length > 0 && (
                    <div className="flex items-start gap-1">
                        <Users2 className="h-3 w-3 text-purple-500 mt-0.5" />
                        <div>
                            <span className="font-medium">Members:</span>{" "}
                            {members
                                .slice(0, 2)
                                .map((m) => `${m.user.name} (${m.role})`)
                                .join(", ")}
                            {members.length > 2 && (
                                <span className="text-gray-500"> +{members.length - 2} more</span>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
