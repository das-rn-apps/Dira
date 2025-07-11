import { useState } from "react";
import api from "../../services/api";

interface Props {
    onClose: () => void;
    onAdd: (project: any) => void;
}

export default function AddProjectModal({ onClose, onAdd }: Props) {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");

    const handleSubmit = async () => {
        if (!name.trim()) return;
        try {
            const res = await api.post("/projects", { name, description });
            onAdd(res.data); // pass new project to parent
            onClose();
        } catch (err) {
            console.error("Failed to add project:", err);
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
            <div className="bg-white p-6 rounded-xl shadow-xl w-full max-w-md">
                <h2 className="text-xl font-semibold mb-4">Add New Project</h2>
                <input
                    type="text"
                    placeholder="Project Name"
                    className="w-full border p-2 mb-3 rounded"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
                <textarea
                    placeholder="Description"
                    className="w-full border p-2 mb-3 rounded"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />
                <div className="flex justify-end gap-2">
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
