import { useAuth } from "../../store/auth";

export default function UserInfo() {
    const user = useAuth((s) => s.user);

    if (!user) return null;

    return (
        <div className="mb-6 p-4 bg-white border border-gray-200 rounded-xl shadow-sm">
            <h2 className="text-lg font-medium text-gray-800">
                Welcome back, {user.user.name} 👋
            </h2>
            <p className="text-sm text-gray-600">
                Logged in as <span className="font-mono">{user.user.email}</span>
            </p>
        </div>
    );
}
