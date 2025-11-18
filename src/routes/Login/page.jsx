import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useNavigate } from "react-router-dom";
import { AlertCircle } from "lucide-react";

export default function Login() {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            await login(username, password);
            navigate("/app/Dashboard");
        } catch (err) {
            setError(err.message || "Usuario o contraseña inválidos");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 dark:from-slate-900 dark:to-slate-800">
            <form
                onSubmit={handleSubmit}
                className="w-full max-w-md rounded-2xl bg-white p-10 shadow-2xl dark:bg-slate-800"
            >
                <div className="mb-8 text-center">
                    <h1 className="mb-2 text-4xl font-bold text-blue-600 dark:text-blue-400">Edutrack</h1>
                    <p className="text-lg font-medium text-slate-500 dark:text-slate-300">Iniciar sesión</p>
                </div>

                {error && (
                    <div className="mb-4 flex items-center gap-3 rounded-lg border border-red-300 bg-red-50 p-4 dark:border-red-800 dark:bg-red-950">
                        <AlertCircle className="h-5 w-5 flex-shrink-0 text-red-600 dark:text-red-400" />
                        <p className="text-sm font-medium text-red-700 dark:text-red-200">{error}</p>
                    </div>
                )}

                <div className="mb-4">
                    <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-200">Usuario</label>
                    <input
                        className="w-full rounded-lg border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900 placeholder-slate-400 transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100 dark:placeholder-slate-500 dark:focus:ring-blue-900"
                        placeholder="Ingresa tu usuario"
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                        disabled={loading}
                    />
                </div>

                <div className="mb-6">
                    <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-200">Contraseña</label>
                    <input
                        className="w-full rounded-lg border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900 placeholder-slate-400 transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100 dark:placeholder-slate-500 dark:focus:ring-blue-900"
                        placeholder="••••••••"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        disabled={loading}
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full rounded-lg bg-blue-600 py-3 text-base font-semibold text-white shadow-lg transition duration-200 hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 disabled:cursor-not-allowed disabled:bg-slate-400 dark:focus:ring-blue-900"
                >
                    {loading ? "Ingresando..." : "Entrar"}
                </button>

                <p className="mt-6 text-center text-sm text-slate-500 dark:text-slate-400">Sistema de Gestión Educativa © 2025</p>
            </form>
        </div>
    );
}
