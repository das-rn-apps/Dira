import { useNavigate } from "react-router-dom";
import {
    User2,
    CalendarClock,
    RefreshCcw,
    BadgeCheck,
    Users2,
} from "lucide-react";

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

interface Props {
    _id: string;
    name: string;
    description: string;
    createdAt?: string;
    updatedAt?: string;
    status?: string;
    members?: Member[];
    owner?: Owner;
}

export default function ProjectCard({
    _id,
    name,
    description,
    createdAt,
    updatedAt,
    status,
    owner,
    members,
}: Props) {
    const navigate = useNavigate();

    return (
        <div
            onClick={() => navigate(`/project/${_id}`)}
            className="bg-white border border-gray-300  hover:bg-gray-50 transition-all duration-200 cursor-pointer p-4 space-y-3"
        >
            {/* Header */}
            <div className="flex justify-between items-start">
                <div>
                    <h2 className="text-lg font-semibold text-gray-800">{name}</h2>
                    <p className="text-purple-400 text-xs">{description}</p>
                </div>
                {status && (
                    <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded-full font-medium flex items-center gap-1">
                        <BadgeCheck className="h-4 w-4" /> {status}
                    </span>
                )}
            </div>

            {/* Metadata */}
            <div className="grid grid-cols-1 text-xs text-gray-500 gap-y-1">
                {owner && (
                    <p className="flex items-center gap-1">
                        <User2 className="h-4 w-4 text-blue-500" />
                        <span className="font-medium">Owner:</span> {owner.name}
                    </p>
                )}
                {createdAt && (
                    <p className="flex items-center gap-1">
                        <CalendarClock className="h-4 w-4 text-gray-500" />
                        <span className="font-medium">Created:</span>{" "}
                        {new Date(createdAt).toLocaleString()}
                    </p>
                )}
                {updatedAt && (
                    <p className="flex items-center gap-1">
                        <RefreshCcw className="h-4 w-4 text-orange-500" />
                        <span className="font-medium">Updated:</span>{" "}
                        {new Date(updatedAt).toLocaleString()}
                    </p>
                )}
                {members && members.length > 0 && (
                    <div className="flex items-start gap-1">
                        <Users2 className="h-4 w-4 text-purple-500 mt-0.5" />
                        <div>
                            <span className="font-medium">Members:</span>{" "}
                            {members
                                .map((m) => `${m.user.name} (${m.role})`)
                                .slice(0, 2)
                                .join(", ")}
                            {members.length > 2 && ` +${members.length - 2} more`}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
