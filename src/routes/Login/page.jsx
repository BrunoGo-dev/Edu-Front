import { useState } from "react";
import { useAuth } from "@/contexts/auth-context";
import { useNavigate } from "react-router-dom";

export default function Login() {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        try {
            await login(email, password);
            navigate("/app");
        } catch (err) {
            setError("Credenciales inválidas", err.message);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-slate-900">
            <form
                onSubmit={handleSubmit}
                className="w-full max-w-md rounded-2xl bg-white p-10 shadow-xl dark:bg-slate-800"
            >
                <h1 className="mb-2 text-center text-4xl font-bold text-blue-600 dark:text-blue-400">Iniciar sesión</h1>
                <p className="mb-6 text-center text-lg font-medium text-slate-500 dark:text-slate-300">Bienvenido al sistema de Suisegur</p>
                {error && <div className="mb-4 rounded border border-red-300 bg-red-100 px-4 py-2 text-center text-red-700">{error}</div>}
                <div className="mb-4">
                    <label className="mb-1 block text-base font-medium text-slate-700 dark:text-slate-200">Email</label>
                    <input
                        className="w-full rounded-lg border border-blue-300 bg-gray-50 px-4 py-3 focus:ring-2 focus:ring-blue-400 focus:outline-none dark:bg-slate-700 dark:text-gray-100"
                        placeholder="Ingresa el email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-6">
                    <label className="mb-1 block text-base font-medium text-slate-700 dark:text-slate-200">Contraseña</label>
                    <input
                        className="w-full rounded-lg border border-blue-300 bg-gray-50 px-4 py-3 focus:ring-2 focus:ring-blue-400 focus:outline-none dark:bg-slate-700 dark:text-gray-100"
                        placeholder="Ingresa la contraseña"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button
                    type="submit"
                    className="w-full rounded-lg bg-blue-600 py-3 text-lg font-semibold text-white shadow transition hover:bg-blue-700 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                >
                    Entrar
                </button>
            </form>
        </div>
    );
}
