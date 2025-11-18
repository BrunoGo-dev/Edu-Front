import { useState, useEffect } from "react";
import { Edit2, Trash2, Plus, AlertCircle, CheckCircle } from "lucide-react";
import { cn } from "@/utils/cn";
import { apiGet, apiPost, apiPut, apiDelete } from "@/utils/api";

export default function AdminUsuarios() {
    const [usuarios, setUsuarios] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({
        username: "",
        password: "",
        email: "",
        nombre: "",
        apellido: "",
        rol: "ESTUDIANTE",
        activo: true,
    });

    // Obtener lista de usuarios
    useEffect(() => {
        fetchUsuarios();
    }, []);

    const fetchUsuarios = async () => {
        setLoading(true);
        setError("");
        try {
            const data = await apiGet("/usuarios");
            setUsuarios(data);
        } catch (err) {
            setError(err.message || "Error al cargar usuarios");
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        try {
            let dataToSend = { ...formData };

            // Si estamos editando y la contraseña está vacía, no la enviamos
            if (editingId && !formData.password) {
                delete dataToSend.password;
            }

            if (editingId) {
                await apiPut(`/usuarios/${editingId}`, dataToSend);
                setSuccess("Usuario actualizado correctamente");
            } else {
                await apiPost("/usuarios", dataToSend);
                setSuccess("Usuario creado correctamente");
            }
            resetForm();
            fetchUsuarios();
            setTimeout(() => setSuccess(""), 3000);
        } catch (err) {
            setError(err.message || "Error al guardar usuario");
        }
    };

    const handleEdit = (usuario) => {
        setFormData({
            username: usuario.username,
            password: "",
            email: usuario.email,
            nombre: usuario.nombre,
            apellido: usuario.apellido,
            rol: usuario.rol,
            activo: usuario.activo,
        });
        setEditingId(usuario.id);
        setShowForm(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm("¿Estás seguro de que deseas eliminar este usuario?")) return;

        setError("");
        try {
            await apiDelete(`/usuarios/${id}`);
            setSuccess("Usuario eliminado correctamente");
            fetchUsuarios();
            setTimeout(() => setSuccess(""), 3000);
        } catch (err) {
            // Si el error contiene "token" pero el usuario fue eliminado, ignorar el error
            if (err.message && err.message.includes("token")) {
                setSuccess("Usuario eliminado correctamente");
                fetchUsuarios();
                setTimeout(() => setSuccess(""), 3000);
            } else {
                setError(err.message || "Error al eliminar usuario");
            }
        }
    };

    const resetForm = () => {
        setFormData({
            username: "",
            password: "",
            email: "",
            nombre: "",
            apellido: "",
            rol: "ESTUDIANTE",
            activo: true,
        });
        setEditingId(null);
        setShowForm(false);
    };

    const getRoleBadgeColor = (rol) => {
        switch (rol) {
            case "ADMINISTRADOR":
                return "bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-200";
            case "DOCENTE":
                return "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-200";
            case "ESTUDIANTE":
                return "bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-200";
            default:
                return "bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-200";
        }
    };

    const getStatusBadgeColor = (activo) => {
        return activo
            ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200"
            : "bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-200";
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Gestión de Usuarios</h1>
                    <p className="text-slate-500 dark:text-slate-400">Administra todos los usuarios del sistema</p>
                </div>
                <button
                    onClick={() => (showForm ? resetForm() : setShowForm(true))}
                    className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white transition hover:bg-blue-700"
                >
                    <Plus className="h-5 w-5" />
                    Nuevo Usuario
                </button>
            </div>

            {/* Alerts */}
            {error && (
                <div className="flex items-center gap-3 rounded-lg border border-red-300 bg-red-50 p-4 dark:border-red-800 dark:bg-red-950">
                    <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
                    <p className="text-sm font-medium text-red-700 dark:text-red-200">{error}</p>
                </div>
            )}

            {success && (
                <div className="flex items-center gap-3 rounded-lg border border-green-300 bg-green-50 p-4 dark:border-green-800 dark:bg-green-950">
                    <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                    <p className="text-sm font-medium text-green-700 dark:text-green-200">{success}</p>
                </div>
            )}

            {/* Form */}
            {showForm && (
                <div className="rounded-lg border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-800">
                    <h2 className="mb-4 text-xl font-semibold text-slate-900 dark:text-white">
                        {editingId ? "Editar Usuario" : "Crear Nuevo Usuario"}
                    </h2>

                    <form
                        onSubmit={handleSubmit}
                        className="grid gap-4 md:grid-cols-2"
                    >
                        <div>
                            <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">Usuario (username)</label>
                            <input
                                type="text"
                                name="username"
                                value={formData.username}
                                onChange={handleInputChange}
                                className="w-full rounded-lg border border-slate-300 bg-slate-50 px-4 py-2 text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100 dark:placeholder-slate-500 dark:focus:ring-blue-900"
                                placeholder="juan_perez"
                                required
                            />
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">Contraseña</label>
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleInputChange}
                                className="w-full rounded-lg border border-slate-300 bg-slate-50 px-4 py-2 text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100 dark:placeholder-slate-500 dark:focus:ring-blue-900"
                                placeholder="miContraseña123"
                                required={!editingId}
                            />
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">Email</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                className="w-full rounded-lg border border-slate-300 bg-slate-50 px-4 py-2 text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100 dark:placeholder-slate-500 dark:focus:ring-blue-900"
                                placeholder="juan@example.com"
                                required
                            />
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">Nombre</label>
                            <input
                                type="text"
                                name="nombre"
                                value={formData.nombre}
                                onChange={handleInputChange}
                                className="w-full rounded-lg border border-slate-300 bg-slate-50 px-4 py-2 text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100 dark:placeholder-slate-500 dark:focus:ring-blue-900"
                                placeholder="Juan"
                                required
                            />
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">Apellido</label>
                            <input
                                type="text"
                                name="apellido"
                                value={formData.apellido}
                                onChange={handleInputChange}
                                className="w-full rounded-lg border border-slate-300 bg-slate-50 px-4 py-2 text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100 dark:placeholder-slate-500 dark:focus:ring-blue-900"
                                placeholder="Pérez"
                                required
                            />
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">Rol</label>
                            <select
                                name="rol"
                                value={formData.rol}
                                onChange={handleInputChange}
                                className="w-full rounded-lg border border-slate-300 bg-slate-50 px-4 py-2 text-slate-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100 dark:focus:ring-blue-900"
                            >
                                <option value="ESTUDIANTE">Estudiante</option>
                                <option value="DOCENTE">Docente</option>
                                <option value="ADMINISTRADOR">Administrador</option>
                            </select>
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">Estado</label>
                            <select
                                name="activo"
                                value={formData.activo}
                                onChange={(e) => setFormData({ ...formData, activo: e.target.value === "true" })}
                                className="w-full rounded-lg border border-slate-300 bg-slate-50 px-4 py-2 text-slate-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100 dark:focus:ring-blue-900"
                            >
                                <option value="true">Activo</option>
                                <option value="false">Inactivo</option>
                            </select>
                        </div>

                        <div className="flex gap-2 md:col-span-2">
                            <button
                                type="submit"
                                className="flex-1 rounded-lg bg-blue-600 px-4 py-2 font-medium text-white transition hover:bg-blue-700"
                            >
                                {editingId ? "Actualizar" : "Crear"}
                            </button>
                            <button
                                type="button"
                                onClick={resetForm}
                                className="flex-1 rounded-lg border border-slate-300 bg-white px-4 py-2 font-medium text-slate-700 transition hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600"
                            >
                                Cancelar
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Loading State */}
            {loading ? (
                <div className="flex h-64 items-center justify-center">
                    <div className="text-center">
                        <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600 dark:border-blue-900 dark:border-t-blue-400" />
                        <p className="text-slate-500 dark:text-slate-400">Cargando usuarios...</p>
                    </div>
                </div>
            ) : usuarios.length === 0 ? (
                <div className="rounded-lg border-2 border-dashed border-slate-300 bg-slate-50 p-12 text-center dark:border-slate-600 dark:bg-slate-900">
                    <p className="text-slate-500 dark:text-slate-400">No hay usuarios registrados</p>
                </div>
            ) : (
                <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-900">
                                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900 dark:text-white">Usuario</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900 dark:text-white">Email</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900 dark:text-white">Nombre</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900 dark:text-white">Rol</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900 dark:text-white">Estado</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900 dark:text-white">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {usuarios.map((usuario) => (
                                <tr
                                    key={usuario.id}
                                    className="border-b border-slate-200 transition hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-900"
                                >
                                    <td className="px-6 py-4 text-slate-900 dark:text-slate-100">{usuario.username}</td>
                                    <td className="px-6 py-4 text-slate-600 dark:text-slate-300">{usuario.email}</td>
                                    <td className="px-6 py-4 text-slate-900 dark:text-slate-100">
                                        {usuario.nombre} {usuario.apellido}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span
                                            className={cn(
                                                "inline-block rounded-full px-3 py-1 text-xs font-semibold",
                                                getRoleBadgeColor(usuario.rol),
                                            )}
                                        >
                                            {usuario.rol}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span
                                            className={cn(
                                                "inline-block rounded-full px-3 py-1 text-xs font-semibold",
                                                getStatusBadgeColor(usuario.activo),
                                            )}
                                        >
                                            {usuario.activo ? "Activo" : "Inactivo"}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => handleEdit(usuario)}
                                                className="rounded-lg bg-blue-100 p-2 text-blue-600 transition hover:bg-blue-200 dark:bg-blue-950 dark:text-blue-400 dark:hover:bg-blue-900"
                                                title="Editar"
                                            >
                                                <Edit2 className="h-4 w-4" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(usuario.id)}
                                                className="rounded-lg bg-red-100 p-2 text-red-600 transition hover:bg-red-200 dark:bg-red-950 dark:text-red-400 dark:hover:bg-red-900"
                                                title="Eliminar"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
