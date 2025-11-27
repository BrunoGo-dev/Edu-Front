import { useState, useEffect, useCallback } from "react";
import { Save, AlertCircle, CheckCircle, Calendar } from "lucide-react";
import { cn } from "@/utils/cn";
import { apiGet, apiPost } from "@/utils/api";
import { useAuth } from "@/hooks/use-auth";

export default function DocenteAsistencia() {
    const { user } = useAuth();
    const [cursos, setCursos] = useState([]);
    const [selectedCurso, setSelectedCurso] = useState(null);
    const [selectedFecha, setSelectedFecha] = useState(new Date().toISOString().split("T")[0]);
    const [estudiantes, setEstudiantes] = useState([]);
    const [asistencias, setAsistencias] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    // Obtener cursos del docente
    const fetchCursos = useCallback(async () => {
        setLoading(true);
        setError("");
        try {
            if (!user?.id) {
                setError("ID de usuario no disponible");
                setLoading(false);
                return;
            }
            console.log(`Fetching docente cursos con ID: ${user.id}`);
            const data = await apiGet(`/cursos/docente/${user.id}`);
            setCursos(data);
            if (data && Array.isArray(data) && data.length > 0) {
                setSelectedCurso(data[0].id);
            }
        } catch (err) {
            console.error("Error al cargar cursos:", err);
            setError(err.message || "Error al cargar cursos");
        } finally {
            setLoading(false);
        }
    }, [user?.id]);

    useEffect(() => {
        fetchCursos();
    }, [fetchCursos]);

    // Obtener estudiantes del curso seleccionado
    const fetchEstudiantes = useCallback(async (cursoId) => {
        setError("");
        try {
            // GET /api/cursos/{cursoId}/estudiantes - Obtener estudiantes del curso
            const data = await apiGet(`/cursos/${cursoId}/estudiantes`);
            setEstudiantes(data || []);
            // Inicializar asistencias vacías
            const newAsistencias = {};
            (data || []).forEach((est) => {
                newAsistencias[est.id] = "PRESENTE";
            });
            setAsistencias(newAsistencias);
        } catch (err) {
            console.error("Error al cargar estudiantes:", err);
            setError(err.message || "Error al cargar estudiantes");
        }
    }, []);

    useEffect(() => {
        if (selectedCurso) {
            fetchEstudiantes(selectedCurso);
        }
    }, [selectedCurso, fetchEstudiantes]);

    const handleAsistenciaChange = (estudianteId, estado) => {
        setAsistencias((prev) => ({
            ...prev,
            [estudianteId]: estado,
        }));
    };

    const handleGuardarAsistencia = async () => {
        setError("");
        setSuccess("");

        if (!selectedCurso || !selectedFecha) {
            setError("Selecciona curso y fecha");
            return;
        }

        try {
            // Preparar datos para enviar - un registro por estudiante
            for (const [estudianteId, estado] of Object.entries(asistencias)) {
                await apiPost("/asistencias", {
                    estudianteId: parseInt(estudianteId),
                    cursoId: selectedCurso,
                    fecha: selectedFecha,
                    estado: estado,
                    observaciones: null,
                });
            }
            setSuccess("Asistencia registrada correctamente");
            setTimeout(() => setSuccess(""), 3000);
        } catch (err) {
            setError(err.message || "Error al guardar asistencia");
        }
    };

    const getEstadoColor = (estado) => {
        switch (estado) {
            case "PRESENTE":
                return "bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-200";
            case "AUSENTE":
                return "bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-200";
            default:
                return "bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-200";
        }
    };

    if (loading) {
        return (
            <div className="flex h-64 items-center justify-center">
                <div className="text-center">
                    <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600 dark:border-blue-900 dark:border-t-blue-400" />
                    <p className="text-slate-500 dark:text-slate-400">Cargando asistencia...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Pasar Lista</h1>
                <p className="text-slate-500 dark:text-slate-400">Registra la asistencia de tus estudiantes</p>
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

            {/* Selectores */}
            <div className="grid gap-4 md:grid-cols-2">
                {/* Selector de Curso */}
                <div className="rounded-lg border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-800">
                    <label className="mb-3 block text-sm font-medium text-slate-700 dark:text-slate-200">Selecciona un curso:</label>
                    <select
                        value={selectedCurso || ""}
                        onChange={(e) => setSelectedCurso(Number(e.target.value))}
                        className="w-full rounded-lg border border-slate-300 bg-slate-50 px-4 py-2 text-slate-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100 dark:focus:ring-blue-900"
                    >
                        <option value="">Seleccionar curso...</option>
                        {cursos.map((curso) => (
                            <option
                                key={curso.id}
                                value={curso.id}
                            >
                                {curso.nombre} - {curso.codigo}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Selector de Fecha */}
                <div className="rounded-lg border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-800">
                    <label className="mb-3 block text-sm font-medium text-slate-700 dark:text-slate-200">Selecciona fecha:</label>
                    <div className="flex items-center gap-2">
                        <Calendar className="h-5 w-5 text-slate-500" />
                        <input
                            type="date"
                            value={selectedFecha}
                            onChange={(e) => setSelectedFecha(e.target.value)}
                            className="w-full rounded-lg border border-slate-300 bg-slate-50 px-4 py-2 text-slate-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100 dark:focus:ring-blue-900"
                        />
                    </div>
                </div>
            </div>

            {/* Tabla de Asistencia */}
            {selectedCurso && estudiantes.length > 0 ? (
                <div className="space-y-4">
                    <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-900">
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900 dark:text-white">Estudiante</th>
                                    <th className="px-6 py-4 text-center text-sm font-semibold text-slate-900 dark:text-white">Presente</th>
                                    <th className="px-6 py-4 text-center text-sm font-semibold text-slate-900 dark:text-white">Ausente</th>
                                    <th className="px-6 py-4 text-center text-sm font-semibold text-slate-900 dark:text-white">Estado</th>
                                </tr>
                            </thead>
                            <tbody>
                                {estudiantes.map((estudiante) => (
                                    <tr
                                        key={estudiante.id}
                                        className="border-b border-slate-200 transition hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-900"
                                    >
                                        <td className="px-6 py-4 text-slate-900 dark:text-slate-100">{estudiante.nombre}</td>
                                        <td className="px-6 py-4 text-center">
                                            <input
                                                type="radio"
                                                name={`asistencia-${estudiante.id}`}
                                                value="PRESENTE"
                                                checked={asistencias[estudiante.id] === "PRESENTE"}
                                                onChange={() => handleAsistenciaChange(estudiante.id, "PRESENTE")}
                                                className="cursor-pointer"
                                            />
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <input
                                                type="radio"
                                                name={`asistencia-${estudiante.id}`}
                                                value="AUSENTE"
                                                checked={asistencias[estudiante.id] === "AUSENTE"}
                                                onChange={() => handleAsistenciaChange(estudiante.id, "AUSENTE")}
                                                className="cursor-pointer"
                                            />
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <span
                                                className={cn(
                                                    "inline-block rounded-full px-3 py-1 text-xs font-semibold",
                                                    getEstadoColor(asistencias[estudiante.id]),
                                                )}
                                            >
                                                {asistencias[estudiante.id]}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Botón Guardar */}
                    <button
                        onClick={handleGuardarAsistencia}
                        className="flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-3 font-medium text-white transition hover:bg-blue-700"
                    >
                        <Save className="h-5 w-5" />
                        Guardar Asistencia
                    </button>
                </div>
            ) : selectedCurso ? (
                <div className="rounded-lg border-2 border-dashed border-slate-300 bg-slate-50 p-12 text-center dark:border-slate-600 dark:bg-slate-900">
                    <p className="text-slate-500 dark:text-slate-400">No hay estudiantes en este curso</p>
                </div>
            ) : (
                <div className="rounded-lg border-2 border-dashed border-slate-300 bg-slate-50 p-12 text-center dark:border-slate-600 dark:bg-slate-900">
                    <p className="text-slate-500 dark:text-slate-400">Selecciona un curso para comenzar</p>
                </div>
            )}
        </div>
    );
}
