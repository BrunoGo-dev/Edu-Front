import { useState, useEffect, useCallback } from "react";
import { AlertCircle, Calendar, CheckCircle2, X } from "lucide-react";
import { cn } from "@/utils/cn";
import { apiGet } from "@/utils/api";
import { useAuth } from "@/hooks/use-auth";

export default function EstudianteAsistencia() {
    const { user } = useAuth();
    const [asistencias, setAsistencias] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // Obtener asistencias del estudiante
    const fetchAsistencias = useCallback(async () => {
        setLoading(true);
        setError("");
        try {
            if (!user?.id) {
                setError("ID de usuario no disponible");
                setLoading(false);
                return;
            }
            console.log(`Fetching asistencias para estudiante ID: ${user.id}`);
            // GET /api/asistencias/estudiante/{id} - Obtener asistencias de un estudiante
            const data = await apiGet(`/asistencias/estudiante/${user.id}`);
            console.log("Datos de asistencias recibidos:", data);
            setAsistencias(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error("Error al cargar asistencias:", err);
            setError(err.message || "Error al cargar asistencias");
        } finally {
            setLoading(false);
        }
    }, [user?.id]);

    useEffect(() => {
        fetchAsistencias();
    }, [fetchAsistencias]);

    // Agrupar asistencias por curso
    const cursoMap = {};
    asistencias.forEach((asistencia) => {
        const claseId = asistencia.claseId;
        if (claseId) {
            if (!cursoMap[claseId]) {
                cursoMap[claseId] = {
                    id: claseId,
                    nombre: asistencia.claseNombre || "Clase sin nombre",
                    codigo: asistencia.claseCodigo || `CLASE-${claseId}`,
                    asistencias: [],
                };
            }
            cursoMap[claseId].asistencias.push(asistencia);
        }
    });

    const cursos = Object.values(cursoMap);

    // Calcular porcentaje de asistencia
    const calcularPorcentaje = (asistencias) => {
        if (asistencias.length === 0) return 0;
        const presentes = asistencias.filter((a) => a.estado === "PRESENTE").length;
        return Math.round((presentes / asistencias.length) * 100);
    };

    // Obtener color basado en estado
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

    // Obtener color para el porcentaje
    const getColorPorcentaje = (porcentaje) => {
        if (porcentaje >= 90) return "text-green-600 dark:text-green-400";
        if (porcentaje >= 80) return "text-blue-600 dark:text-blue-400";
        if (porcentaje >= 70) return "text-yellow-600 dark:text-yellow-400";
        return "text-red-600 dark:text-red-400";
    };

    if (loading) {
        return (
            <div className="flex h-64 items-center justify-center">
                <div className="text-center">
                    <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600 dark:border-blue-900 dark:border-t-blue-400" />
                    <p className="text-slate-500 dark:text-slate-400">Cargando asistencias...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Mi Asistencia</h1>
                <p className="text-slate-500 dark:text-slate-400">Visualiza tu asistencia en todos los cursos</p>
            </div>

            {/* Alerts */}
            {error && (
                <div className="flex items-center gap-3 rounded-lg border border-red-300 bg-red-50 p-4 dark:border-red-800 dark:bg-red-950">
                    <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
                    <p className="text-sm font-medium text-red-700 dark:text-red-200">{error}</p>
                </div>
            )}

            {/* Cursos y Asistencias */}
            {cursos.length > 0 ? (
                <div className="space-y-6">
                    {cursos.map((curso) => {
                        const porcentaje = calcularPorcentaje(curso.asistencias);
                        return (
                            <div
                                key={curso.id}
                                className="rounded-lg border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800"
                            >
                                {/* Encabezado del Curso */}
                                <div className="border-b border-slate-200 bg-gradient-to-r from-blue-50 to-blue-100 p-6 dark:border-slate-700 dark:from-blue-950 dark:to-blue-900">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{curso.nombre}</h2>
                                            <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{curso.codigo}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm font-medium text-slate-600 dark:text-slate-300">Porcentaje de Asistencia</p>
                                            <p className={cn("text-4xl font-bold", getColorPorcentaje(porcentaje))}>{porcentaje}%</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Resumen Estadísticas */}
                                <div className="border-b border-slate-200 bg-slate-50 p-6 dark:border-slate-700 dark:bg-slate-900">
                                    <div className="grid gap-4 md:grid-cols-2">
                                        <div className="rounded-lg bg-green-50 p-4 dark:bg-green-950">
                                            <p className="text-sm font-medium text-slate-600 dark:text-slate-300">Presentes</p>
                                            <p className="mt-2 text-2xl font-bold text-green-600 dark:text-green-400">
                                                {curso.asistencias.filter((a) => a.estado === "PRESENTE").length}
                                            </p>
                                        </div>
                                        <div className="rounded-lg bg-red-50 p-4 dark:bg-red-950">
                                            <p className="text-sm font-medium text-slate-600 dark:text-slate-300">Ausentes</p>
                                            <p className="mt-2 text-2xl font-bold text-red-600 dark:text-red-400">
                                                {curso.asistencias.filter((a) => a.estado === "AUSENTE").length}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Tabla de Asistencias */}
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead>
                                            <tr className="border-b border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-900">
                                                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900 dark:text-white">
                                                    Estudiante
                                                </th>
                                                <th className="px-6 py-4 text-center text-sm font-semibold text-slate-900 dark:text-white">Estado</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {curso.asistencias.map((asistencia) => {
                                                return (
                                                    <tr
                                                        key={asistencia.id}
                                                        className="border-b border-slate-200 transition hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-900"
                                                    >
                                                        <td className="px-6 py-4 text-slate-900 dark:text-slate-100">
                                                            {asistencia.estudianteNombre || "N/A"}
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
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        );
                    })}
                </div>
            ) : (
                <div className="rounded-lg border-2 border-dashed border-slate-300 bg-slate-50 p-12 text-center dark:border-slate-600 dark:bg-slate-900">
                    <Calendar className="mx-auto mb-4 h-12 w-12 text-slate-400" />
                    <p className="text-slate-500 dark:text-slate-400">Aún no tienes registros de asistencia</p>
                </div>
            )}
        </div>
    );
}
