import { useState, useEffect, useCallback } from "react";
import { AlertCircle, Calendar, CheckCircle2, X } from "lucide-react";
import { cn } from "@/utils/cn";
import { apiGet } from "@/utils/api";
import { useAuth } from "@/hooks/use-auth";

export default function EstudianteAsistencia() {
    const { user } = useAuth();
    const [cursos, setCursos] = useState([]);
    const [cursoSeleccionado, setCursoSeleccionado] = useState(null);
    const [asistencias, setAsistencias] = useState([]);
    const [loadingCursos, setLoadingCursos] = useState(true);
    const [loadingAsistencias, setLoadingAsistencias] = useState(false);
    const [error, setError] = useState("");

    // 1. Obtener cursos del estudiante al cargar
    const fetchCursos = useCallback(async () => {
        setLoadingCursos(true);
        setError("");
        try {
            if (!user?.id) return;
            // GET /api/cursos/estudiante/{id}
            const data = await apiGet(`/cursos/estudiante/${user.id}`);
            setCursos(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error("Error al cargar cursos:", err);
            setError("No se pudieron cargar tus cursos.");
        } finally {
            setLoadingCursos(false);
        }
    }, [user?.id]);

    useEffect(() => {
        fetchCursos();
    }, [fetchCursos]);

    // 2. Obtener asistencias cuando se selecciona un curso
    const fetchAsistenciasCurso = useCallback(async (cursoId) => {
        if (!cursoId || !user?.id) return;
        
        setLoadingAsistencias(true);
        setError(""); // Limpiar errores previos
        try {
            // GET /api/asistencias/estudiante/{idEstudiante}/curso/{idCurso}
            const data = await apiGet(`/asistencias/estudiante/${user.id}/curso/${cursoId}`);
            setAsistencias(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error("Error al cargar asistencias del curso:", err);
            setError("No se pudieron cargar las asistencias de este curso.");
            setAsistencias([]);
        } finally {
            setLoadingAsistencias(false);
        }
    }, [user?.id]);

    const handleCursoChange = (e) => {
        const cursoId = e.target.value;
        const curso = cursos.find(c => c.id.toString() === cursoId);
        setCursoSeleccionado(curso || null);
        if (curso) {
            fetchAsistenciasCurso(curso.id);
        } else {
            setAsistencias([]);
        }
    };

    // Calcular estadísticas
    const calcularPorcentaje = (asistencias) => {
        if (asistencias.length === 0) return 0;
        const presentes = asistencias.filter((a) => a.estado === "PRESENTE").length;
        return Math.round((presentes / asistencias.length) * 100);
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

    const getEstadoIcon = (estado) => {
        switch (estado) {
            case "PRESENTE":
                return <CheckCircle2 className="h-5 w-5 text-green-600" />;
            case "AUSENTE":
                return <X className="h-5 w-5 text-red-600" />;
            default:
                return null;
        }
    };

    const getColorPorcentaje = (porcentaje) => {
        if (porcentaje >= 90) return "text-green-600 dark:text-green-400";
        if (porcentaje >= 80) return "text-blue-600 dark:text-blue-400";
        if (porcentaje >= 70) return "text-yellow-600 dark:text-yellow-400";
        return "text-red-600 dark:text-red-400";
    };

    if (loadingCursos) {
        return (
            <div className="flex h-64 items-center justify-center">
                <div className="text-center">
                    <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600 dark:border-blue-900 dark:border-t-blue-400" />
                    <p className="text-slate-500 dark:text-slate-400">Cargando tus cursos...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Mi Asistencia</h1>
                <p className="text-slate-500 dark:text-slate-400">Selecciona un curso para ver tu historial de asistencia</p>
            </div>

            {/* Selector de Curso */}
            <div className="rounded-lg border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-800">
                <label htmlFor="curso-select" className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                    Selecciona un curso
                </label>
                <select
                    id="curso-select"
                    className="block w-full rounded-md border border-slate-300 bg-white p-2.5 text-sm text-slate-900 focus:border-blue-500 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-700 dark:text-white dark:placeholder-slate-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                    onChange={handleCursoChange}
                    value={cursoSeleccionado?.id || ""}
                >
                    <option value="">-- Seleccionar curso --</option>
                    {cursos.map((curso) => (
                        <option key={curso.id} value={curso.id}>
                            {curso.nombre} {curso.codigo ? `(${curso.codigo})` : ""}
                        </option>
                    ))}
                </select>
            </div>

            {/* Alerts */}
            {error && (
                <div className="flex items-center gap-3 rounded-lg border border-red-300 bg-red-50 p-4 dark:border-red-800 dark:bg-red-950">
                    <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
                    <p className="text-sm font-medium text-red-700 dark:text-red-200">{error}</p>
                </div>
            )}

            {/* Contenido de Asistencia */}
            {loadingAsistencias ? (
                <div className="flex h-32 items-center justify-center">
                    <div className="text-center">
                        <div className="mb-2 h-8 w-8 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600 dark:border-blue-900 dark:border-t-blue-400 mx-auto" />
                        <p className="text-sm text-slate-500 dark:text-slate-400">Cargando historial...</p>
                    </div>
                </div>
            ) : cursoSeleccionado ? (
                <div className="space-y-6">
                    {asistencias.length > 0 ? (
                        <div className="rounded-lg border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800">
                            {/* Encabezado del Reporte */}
                            <div className="border-b border-slate-200 bg-gradient-to-r from-blue-50 to-blue-100 p-6 dark:border-slate-700 dark:from-blue-950 dark:to-blue-900">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{cursoSeleccionado.nombre}</h2>
                                        <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{cursoSeleccionado.codigo}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm font-medium text-slate-600 dark:text-slate-300">Porcentaje Global</p>
                                        <p className={cn("text-4xl font-bold", getColorPorcentaje(calcularPorcentaje(asistencias)))}>
                                            {calcularPorcentaje(asistencias)}%
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Resumen Estadísticas */}
                            <div className="border-b border-slate-200 bg-slate-50 p-6 dark:border-slate-700 dark:bg-slate-900">
                                <div className="grid gap-4 md:grid-cols-2">
                                    <div className="rounded-lg bg-green-50 p-4 dark:bg-green-950">
                                        <p className="text-sm font-medium text-slate-600 dark:text-slate-300">Clases Asistidas</p>
                                        <p className="mt-2 text-2xl font-bold text-green-600 dark:text-green-400">
                                            {asistencias.filter((a) => a.estado === "PRESENTE").length}
                                        </p>
                                    </div>
                                    <div className="rounded-lg bg-red-50 p-4 dark:bg-red-950">
                                        <p className="text-sm font-medium text-slate-600 dark:text-slate-300">Faltas</p>
                                        <p className="mt-2 text-2xl font-bold text-red-600 dark:text-red-400">
                                            {asistencias.filter((a) => a.estado === "AUSENTE").length}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Tabla de Asistencias */}
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-900">
                                            <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900 dark:text-white">Fecha</th>
                                            <th className="px-6 py-4 text-center text-sm font-semibold text-slate-900 dark:text-white">Estado</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {asistencias.map((asistencia) => (
                                            <tr
                                                key={asistencia.id}
                                                className="border-b border-slate-200 transition hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-900"
                                            >
                                                <td className="px-6 py-4 text-slate-900 dark:text-slate-100">
                                                    {(() => {
                                                        if (!asistencia.fechaRegistro) return "Sin fecha";
                                                        const date = new Date(asistencia.fechaRegistro);
                                                        return isNaN(date.getTime()) ? "Sin fecha" : date.toLocaleDateString();
                                                    })()}
                                                </td>
                                                <td className="px-6 py-4 text-center">
                                                    <div className="flex items-center justify-center gap-2">
                                                        {getEstadoIcon(asistencia.estado)}
                                                        <span
                                                            className={cn(
                                                                "inline-block rounded-full px-3 py-1 text-xs font-semibold",
                                                                getEstadoColor(asistencia.estado),
                                                            )}
                                                        >
                                                            {asistencia.estado}
                                                        </span>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    ) : (
                        <div className="rounded-lg border-2 border-dashed border-slate-300 bg-slate-50 p-12 text-center dark:border-slate-600 dark:bg-slate-900">
                            <Calendar className="mx-auto mb-4 h-12 w-12 text-slate-400" />
                            <p className="text-slate-500 dark:text-slate-400">No hay registros de asistencia para este curso.</p>
                        </div>
                    )}
                </div>
            ) : (
                <div className="rounded-lg border border-slate-200 bg-slate-50 p-12 text-center dark:border-slate-700 dark:bg-slate-800">
                    <p className="text-slate-500 dark:text-slate-400">Selecciona un curso arriba para ver los detalles.</p>
                </div>
            )}
        </div>
    );
}
