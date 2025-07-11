import { useAuth } from "../../store/authStore";
import { User2 } from "lucide-react";

export default function UserInfo() {
    const user = useAuth((s) => s.user);

    if (!user) return null;

    return (
        <div className="mb-2 p-3 bg-gradient-to-br from-white to-gray-100 border border-gray-200 rounded-sm shadow-xs">
            <div className="flex items-center gap-3">
                <div className="bg-blue-100 text-blue-600 rounded-full p-2">
                    <User2 className="h-5 w-5" />
                </div>
                <div>
                    <h2 className="text-base font-semibold text-gray-800">
                        Welcome back, <span className="text-blue-600">{user.user.name}</span> 👋
                    </h2>
                    <p className="text-sm text-gray-500">
                        Logged in as <span className="font-mono text-gray-700">{user.user.email}</span>
                    </p>
                </div>
            </div>
        </div>
    );
}
