import { useState, useEffect, useCallback } from "react";
import { AlertCircle, Award } from "lucide-react";
import { cn } from "@/utils/cn";
import { apiGet } from "@/utils/api";
import { useAuth } from "@/hooks/use-auth";

export default function EstudianteCalificaciones() {
    const { user } = useAuth();
    const [calificaciones, setCalificaciones] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // Obtener calificaciones del estudiante
    const fetchCalificaciones = useCallback(async () => {
        setLoading(true);
        setError("");
        try {
            if (!user?.id) {
                setError("ID de usuario no disponible");
                setLoading(false);
                return;
            }
            // GET /api/notas/estudiante/{id} - Obtener notas de un estudiante
            console.log(`Fetching calificaciones para estudiante ID: ${user.id}`);
            const data = await apiGet(`/notas/estudiante/${user.id}`);
            setCalificaciones(data || []);
        } catch (err) {
            console.error("Error al cargar calificaciones:", err);
            setError(err.message || "Error al cargar calificaciones");
        } finally {
            setLoading(false);
        }
    }, [user?.id]);

    useEffect(() => {
        fetchCalificaciones();
    }, [fetchCalificaciones]);

    // Agrupar calificaciones por curso
    const courseMap = {};
    calificaciones.forEach((nota) => {
        // Como no tenemos cursoId en la respuesta, agrupamos por evaluacionNombre
        const cursoKey = `curso_${nota.evaluacionId}`;
        if (!courseMap[cursoKey]) {
            courseMap[cursoKey] = {
                id: nota.evaluacionId,
                nombre: nota.evaluacionNombre || "Curso sin nombre",
                codigo: `EVA-${nota.evaluacionId}`,
                notas: [],
            };
        }
        courseMap[cursoKey].notas.push(nota);
    });

    const cursos = Object.values(courseMap);

    // Calcular promedio de un curso
    const calcularPromedio = (notas) => {
        if (notas.length === 0) return 0;
        const suma = notas.reduce((acc, nota) => acc + (nota.nota || 0), 0);
        return (suma / notas.length).toFixed(2);
    };

    // Obtener color basado en calificación
    const getGradeColor = (valor) => {
        if (valor >= 90) return "bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-200";
        if (valor >= 80) return "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-200";
        if (valor >= 70) return "bg-yellow-100 text-yellow-800 dark:bg-yellow-950 dark:text-yellow-200";
        if (valor >= 60) return "bg-orange-100 text-orange-800 dark:bg-orange-950 dark:text-orange-200";
        return "bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-200";
    };

    const getStatusText = (valor) => {
        if (valor >= 90) return "Excelente";
        if (valor >= 80) return "Muy Bien";
        if (valor >= 70) return "Bien";
        if (valor >= 60) return "Aprobado";
        return "Reprobado";
    };

    if (loading) {
        return (
            <div className="flex h-64 items-center justify-center">
                <div className="text-center">
                    <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600 dark:border-blue-900 dark:border-t-blue-400" />
                    <p className="text-slate-500 dark:text-slate-400">Cargando calificaciones...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Mis Calificaciones</h1>
                <p className="text-slate-500 dark:text-slate-400">Visualiza tus calificaciones en todos los cursos</p>
            </div>

            {/* Alerts */}
            {error && (
                <div className="flex items-center gap-3 rounded-lg border border-red-300 bg-red-50 p-4 dark:border-red-800 dark:bg-red-950">
                    <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
                    <p className="text-sm font-medium text-red-700 dark:text-red-200">{error}</p>
                </div>
            )}

            {/* Cursos y Calificaciones */}
            {cursos.length > 0 ? (
                <div className="space-y-6">
                    {cursos.map((curso) => {
                        const promedio = calcularPromedio(curso.notas);
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
                                            <p className="text-sm font-medium text-slate-600 dark:text-slate-300">Promedio General</p>
                                            <p
                                                className={cn(
                                                    "text-3xl font-bold",
                                                    promedio >= 90
                                                        ? "text-green-600 dark:text-green-400"
                                                        : promedio >= 80
                                                          ? "text-blue-600 dark:text-blue-400"
                                                          : promedio >= 70
                                                            ? "text-yellow-600 dark:text-yellow-400"
                                                            : promedio >= 60
                                                              ? "text-orange-600 dark:text-orange-400"
                                                              : "text-red-600 dark:text-red-400",
                                                )}
                                            >
                                                {promedio}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Tabla de Calificaciones */}
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead>
                                            <tr className="border-b border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-900">
                                                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900 dark:text-white">
                                                    Evaluación
                                                </th>
                                                <th className="px-6 py-4 text-center text-sm font-semibold text-slate-900 dark:text-white">
                                                    Calificación
                                                </th>
                                                <th className="px-6 py-4 text-center text-sm font-semibold text-slate-900 dark:text-white">Estado</th>
                                                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900 dark:text-white">
                                                    Observaciones
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {curso.notas.map((nota) => (
                                                <tr
                                                    key={nota.id}
                                                    className="border-b border-slate-200 transition hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-900"
                                                >
                                                    <td className="px-6 py-4 text-slate-900 dark:text-slate-100">{nota.evaluacionNombre || "N/A"}</td>
                                                    <td className="px-6 py-4 text-center">
                                                        <span
                                                            className={cn("inline-block rounded-full px-3 py-1 font-bold", getGradeColor(nota.nota))}
                                                        >
                                                            {nota.nota}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 text-center">
                                                        <span
                                                            className={cn(
                                                                "inline-block rounded-full px-3 py-1 text-xs font-semibold",
                                                                getGradeColor(nota.nota),
                                                            )}
                                                        >
                                                            {getStatusText(nota.nota)}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 text-slate-600 dark:text-slate-300">{nota.observaciones || "-"}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        );
                    })}
                </div>
            ) : (
                <div className="rounded-lg border-2 border-dashed border-slate-300 bg-slate-50 p-12 text-center dark:border-slate-600 dark:bg-slate-900">
                    <Award className="mx-auto mb-4 h-12 w-12 text-slate-400" />
                    <p className="text-slate-500 dark:text-slate-400">Aún no tienes calificaciones registradas</p>
                </div>
            )}
        </div>
    );
}
