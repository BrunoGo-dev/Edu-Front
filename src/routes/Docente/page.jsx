import { useState, useEffect, useCallback } from "react";
import { Edit2, Save, X, AlertCircle, CheckCircle } from "lucide-react";
import { apiGet, apiPut } from "@/utils/api";
import { useAuth } from "@/hooks/use-auth";

export default function DocenteCalificaciones() {
    const { user } = useAuth();
    const [cursos, setCursos] = useState([]);
    const [selectedCurso, setSelectedCurso] = useState(null);
    const [estudiantes, setEstudiantes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [editingCell, setEditingCell] = useState(null);
    const [editValues, setEditValues] = useState({});

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
            // GET /api/cursos/docente/{id} - Obtener cursos del docente
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

    const fetchEstudiantesCurso = useCallback(async (cursoId) => {
        setError("");
        try {
            // GET /api/notas/curso/{id} - Obtener notas de un curso
            const data = await apiGet(`/notas/curso/${cursoId}`);
            setEstudiantes(data);
        } catch (err) {
            setError(err.message || "Error al cargar estudiantes");
        }
    }, []);

    // Obtener estudiantes del curso seleccionado
    useEffect(() => {
        if (selectedCurso) {
            fetchEstudiantesCurso(selectedCurso);
        }
    }, [selectedCurso, fetchEstudiantesCurso]);

    const handleStartEdit = (notaId, currentValue, estudianteId, evaluacionId, observaciones) => {
        setEditingCell(notaId);
        setEditValues({
            ...editValues,
            [notaId]: currentValue,
            [`${notaId}_estudianteId`]: estudianteId,
            [`${notaId}_evaluacionId`]: evaluacionId,
            [`${notaId}_observaciones`]: observaciones || "",
        });
    };

    const handleSaveEdit = async (notaId) => {
        const newValue = editValues[notaId];
        const estudianteId = editValues[`${notaId}_estudianteId`];
        const evaluacionId = editValues[`${notaId}_evaluacionId`];
        const observaciones = editValues[`${notaId}_observaciones`];

        if (newValue === undefined || newValue === "") {
            setError("La calificación no puede estar vacía");
            return;
        }

        try {
            // PUT /api/notas/{id} - Actualizar nota con estructura correcta
            await apiPut(`/notas/${notaId}`, {
                estudianteId: estudianteId,
                evaluacionId: evaluacionId,
                nota: parseFloat(newValue),
                observaciones: observaciones,
            });
            setSuccess("Calificación actualizada correctamente");
            setEditingCell(null);
            fetchEstudiantesCurso(selectedCurso);
            setTimeout(() => setSuccess(""), 3000);
        } catch (err) {
            setError(err.message || "Error al actualizar calificación");
        }
    };

    const handleCancelEdit = () => {
        setEditingCell(null);
    };

    const isEditing = (notaId) => {
        return editingCell === notaId;
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
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Gestión de Calificaciones</h1>
                <p className="text-slate-500 dark:text-slate-400">Edita las calificaciones de tus estudiantes</p>
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

            {/* Selector de Curso */}
            {cursos.length > 0 ? (
                <div className="rounded-lg border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-800">
                    <label className="mb-3 block text-sm font-medium text-slate-700 dark:text-slate-200">Selecciona un curso:</label>
                    <select
                        value={selectedCurso}
                        onChange={(e) => setSelectedCurso(Number(e.target.value))}
                        className="w-full rounded-lg border border-slate-300 bg-slate-50 px-4 py-2 text-slate-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none md:w-64 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100 dark:focus:ring-blue-900"
                    >
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
            ) : (
                <div className="rounded-lg border-2 border-dashed border-slate-300 bg-slate-50 p-12 text-center dark:border-slate-600 dark:bg-slate-900">
                    <p className="text-slate-500 dark:text-slate-400">No tienes cursos asignados</p>
                </div>
            )}

            {/* Tabla de Calificaciones */}
            {selectedCurso && estudiantes.length > 0 ? (
                <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-900">
                                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900 dark:text-white">Estudiante</th>
                                <th className="px-6 py-4 text-center text-sm font-semibold text-slate-900 dark:text-white">Evaluación</th>
                                <th className="px-6 py-4 text-center text-sm font-semibold text-slate-900 dark:text-white">Calificación</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900 dark:text-white">Observaciones</th>
                                <th className="px-6 py-4 text-center text-sm font-semibold text-slate-900 dark:text-white">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {estudiantes.map((nota) => (
                                <tr
                                    key={nota.id}
                                    className="border-b border-slate-200 transition hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-900"
                                >
                                    <td className="px-6 py-4 text-slate-900 dark:text-slate-100">{nota.estudianteNombre || "N/A"}</td>
                                    <td className="px-6 py-4 text-center text-slate-600 dark:text-slate-300">{nota.evaluacionNombre || "N/A"}</td>
                                    <td className="px-6 py-4 text-center">
                                        {isEditing(nota.id) ? (
                                            <input
                                                type="number"
                                                min="0"
                                                max="100"
                                                step="0.5"
                                                value={editValues[nota.id] || ""}
                                                onChange={(e) =>
                                                    setEditValues({
                                                        ...editValues,
                                                        [nota.id]: e.target.value,
                                                    })
                                                }
                                                className="w-20 rounded border border-blue-300 bg-blue-50 px-2 py-1 text-center text-slate-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none dark:border-blue-600 dark:bg-blue-900 dark:text-slate-100 dark:focus:ring-blue-700"
                                                autoFocus
                                            />
                                        ) : (
                                            <span className="inline-block rounded-full bg-blue-100 px-3 py-1 font-semibold text-blue-800 dark:bg-blue-950 dark:text-blue-200">
                                                {nota.nota}
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-slate-600 dark:text-slate-300">{nota.observaciones || "-"}</td>
                                    <td className="px-6 py-4 text-center">
                                        <div className="flex justify-center gap-2">
                                            {isEditing(nota.id) ? (
                                                <>
                                                    <button
                                                        onClick={() => handleSaveEdit(nota.id)}
                                                        className="rounded-lg bg-green-100 p-2 text-green-600 transition hover:bg-green-200 dark:bg-green-950 dark:text-green-400 dark:hover:bg-green-900"
                                                        title="Guardar"
                                                    >
                                                        <Save className="h-4 w-4" />
                                                    </button>
                                                    <button
                                                        onClick={handleCancelEdit}
                                                        className="rounded-lg bg-slate-100 p-2 text-slate-600 transition hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-400 dark:hover:bg-slate-600"
                                                        title="Cancelar"
                                                    >
                                                        <X className="h-4 w-4" />
                                                    </button>
                                                </>
                                            ) : (
                                                <button
                                                    onClick={() =>
                                                        handleStartEdit(nota.id, nota.nota, nota.estudianteId, nota.evaluacionId, nota.observaciones)
                                                    }
                                                    className="rounded-lg bg-blue-100 p-2 text-blue-600 transition hover:bg-blue-200 dark:bg-blue-950 dark:text-blue-400 dark:hover:bg-blue-900"
                                                    title="Editar"
                                                >
                                                    <Edit2 className="h-4 w-4" />
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : selectedCurso ? (
                <div className="rounded-lg border-2 border-dashed border-slate-300 bg-slate-50 p-12 text-center dark:border-slate-600 dark:bg-slate-900">
                    <p className="text-slate-500 dark:text-slate-400">No hay estudiantes en este curso</p>
                </div>
            ) : null}
        </div>
    );
}
