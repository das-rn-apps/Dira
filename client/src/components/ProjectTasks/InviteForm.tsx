import { useState } from "react";
import api from "../../services/api";

export default function InviteForm({ projectId }: { projectId: string }) {
    const [inviteEmail, setInviteEmail] = useState("");

    const handleInvite = async () => {
        try {
            await api.post(`/projects/${projectId}/invite`, { email: inviteEmail });
            alert("User invited!");
            setInviteEmail("");
        } catch (err: any) {
            alert(err.response?.data?.message || "Invite failed");
        }
    };

    return (
        <div className="flex items-center space-x-2 mb-6">
            <input
                type="email"
                placeholder="Invite user by email"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                className="p-2 border rounded w-64"
            />
            <button onClick={handleInvite} className="bg-indigo-600 text-white px-4 py-2 rounded">
                Invite
            </button>
        </div>
    );
}
