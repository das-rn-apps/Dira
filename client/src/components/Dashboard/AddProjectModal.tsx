import { useState } from "react";
import api from "../../services/api";
import type { IMember, IProject, IUser } from "../../types";

interface Props {
    onClose: () => void;
    onAdd: (project: IProject) => void;
    users: IUser[];
}

export default function AddProjectModal({ onClose, onAdd, users }: Props) {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [members, setMembers] = useState<IMember[]>([]);

    const handleAddMember = () => {
        setMembers([...members, { user: { _id: "", name: "", email: "" }, role: "member" }]);
    };

    const handleChangeMember = (index: number, key: keyof IMember, value: string) => {
        const updated = [...members];

        if (key === "user") {
            const foundUser = users.find((u) => u._id === value);
            if (foundUser) {
                updated[index].user = foundUser;
            }
        } else {
            updated[index][key] = value as any;
        }

        setMembers(updated);
    };

    const handleRemoveMember = (index: number) => {
        setMembers(members.filter((_, i) => i !== index));
    };

    const handleSubmit = async () => {
        if (!name.trim()) return;

        try {
            const formattedMembers = members
                .filter((m) => m.user._id)
                .map((m) => ({
                    user: m.user._id,
                    role: m.role,
                }));

            const res = await api.post("/api/projects", {
                name,
                description,
                members: formattedMembers,
            });

            onAdd(res.data);
            onClose();
        } catch (err) {
            console.error("Failed to add project:", err);
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
            <div className="bg-white p-6 rounded-xl shadow-xl w-full max-w-lg space-y-4">
                <h2 className="text-xl font-semibold">Add New Project</h2>

                <input
                    type="text"
                    placeholder="Project Name"
                    className="w-full border p-2 rounded"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />

                <textarea
                    placeholder="Description"
                    className="w-full border p-2 rounded"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />

                <div className="space-y-2">
                    <div className="flex justify-between items-center">
                        <span className="font-medium">Members</span>
                        <button
                            onClick={handleAddMember}
                            className="text-sm text-blue-600 hover:underline"
                        >
                            + Add Member
                        </button>
                    </div>

                    {members.map((member, idx) => (
                        <div key={idx} className="flex gap-2 items-center">
                            <select
                                value={member.user._id}
                                onChange={(e) => handleChangeMember(idx, "user", e.target.value)}
                                className="flex-1 p-2 border rounded"
                            >
                                <option value="">Select User</option>
                                {users.map((u) => (
                                    <option key={u._id} value={u._id}>
                                        {u.name}
                                    </option>
                                ))}
                            </select>

                            <select
                                value={member.role}
                                onChange={(e) => handleChangeMember(idx, "role", e.target.value)}
                                className="w-36 p-2 border rounded"
                            >
                                <option value="admin">Admin</option>
                                <option value="member">Member</option>
                                <option value="tester">Tester</option>
                            </select>

                            <button
                                onClick={() => handleRemoveMember(idx)}
                                className="text-red-500 text-sm"
                            >
                                ✕
                            </button>
                        </div>
                    ))}
                </div>

                <div className="flex justify-end gap-2 pt-4">
                    <button
                        className="px-4 py-2 bg-gray-300 text-gray-800 rounded"
                        onClick={onClose}
                    >
                        Cancel
                    </button>
                    <button
                        className="px-4 py-2 bg-blue-600 text-white rounded"
                        onClick={handleSubmit}
                    >
                        Add
                    </button>
                </div>
            </div>
        </div>
    );
}
