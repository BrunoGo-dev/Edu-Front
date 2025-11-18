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
        nombre: "",
        email: "",
        rol: "Estudiante",
        estado: "activo",
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
            if (editingId) {
                await apiPut(`/usuarios/${editingId}`, formData);
                setSuccess("Usuario actualizado correctamente");
            } else {
                await apiPost("/usuarios", formData);
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
            nombre: usuario.nombre,
            email: usuario.email,
            rol: usuario.rol,
            estado: usuario.estado,
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
            setError(err.message || "Error al eliminar usuario");
        }
    };

    const resetForm = () => {
        setFormData({
            nombre: "",
            email: "",
            rol: "Estudiante",
            estado: "activo",
        });
        setEditingId(null);
        setShowForm(false);
    };

    const getRoleBadgeColor = (rol) => {
        switch (rol) {
            case "Administrador":
                return "bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-200";
            case "Docente":
                return "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-200";
            case "Estudiante":
                return "bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-200";
            default:
                return "bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-200";
        }
    };

    const getStatusBadgeColor = (estado) => {
        return estado === "activo"
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
                            <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">Nombre completo</label>
                            <input
                                type="text"
                                name="nombre"
                                value={formData.nombre}
                                onChange={handleInputChange}
                                className="w-full rounded-lg border border-slate-300 bg-slate-50 px-4 py-2 text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100 dark:placeholder-slate-500 dark:focus:ring-blue-900"
                                placeholder="Juan Pérez"
                                required
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
                                placeholder="juan@email.com"
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
                                <option value="Estudiante">Estudiante</option>
                                <option value="Docente">Docente</option>
                                <option value="Administrador">Administrador</option>
                            </select>
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">Estado</label>
                            <select
                                name="estado"
                                value={formData.estado}
                                onChange={handleInputChange}
                                className="w-full rounded-lg border border-slate-300 bg-slate-50 px-4 py-2 text-slate-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100 dark:focus:ring-blue-900"
                            >
                                <option value="activo">Activo</option>
                                <option value="inactivo">Inactivo</option>
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
                                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900 dark:text-white">Nombre</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900 dark:text-white">Email</th>
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
                                    <td className="px-6 py-4 text-slate-900 dark:text-slate-100">{usuario.nombre}</td>
                                    <td className="px-6 py-4 text-slate-600 dark:text-slate-300">{usuario.email}</td>
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
                                                getStatusBadgeColor(usuario.estado),
                                            )}
                                        >
                                            {usuario.estado === "activo" ? "Activo" : "Inactivo"}
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
