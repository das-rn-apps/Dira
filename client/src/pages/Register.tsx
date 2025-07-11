import { useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";

export default function Register() {
    const [form, setForm] = useState({ name: "", email: "", password: "" });
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await api.post("/api/auth/register", form);
        navigate("/login");
    };

    return (
        <div className="max-w-md mx-auto mt-20">
            <h1 className="text-2xl font-bold mb-4">Register</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
                <input className="w-full p-2 border" placeholder="Name" onChange={e => setForm({ ...form, name: e.target.value })} />
                <input className="w-full p-2 border" placeholder="Email" onChange={e => setForm({ ...form, email: e.target.value })} />
                <input className="w-full p-2 border" placeholder="Password" type="password" onChange={e => setForm({ ...form, password: e.target.value })} />
                <button className="bg-blue-600 text-white px-4 py-2 rounded">Register</button>
            </form>
        </div>
    );
}
