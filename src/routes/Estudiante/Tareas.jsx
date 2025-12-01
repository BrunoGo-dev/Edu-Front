import { useState, useEffect, useCallback } from "react";
import { FileText, CheckCircle, Clock, AlertCircle, Calendar } from "lucide-react";
import { cn } from "@/utils/cn";
import { apiGet, apiPost } from "@/utils/api";
import { useAuth } from "@/hooks/use-auth";

export default function EstudianteTareas() {
    const { user } = useAuth();
    const [cursos, setCursos] = useState([]);
    const [selectedCurso, setSelectedCurso] = useState(null);
    const [tareas, setTareas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    
    // Submission State
    const [selectedTarea, setSelectedTarea] = useState(null);
    const [contenido, setContenido] = useState("");

    // Fetch Cursos
    const fetchCursos = useCallback(async () => {
        setLoading(true);
        try {
            if (!user?.id) return;
            const data = await apiGet(`/cursos/estudiante/${user.id}`);
            setCursos(data || []);
            if (data && data.length > 0) setSelectedCurso(data[0].id);
        } catch (err) {
            setError("Error al cargar cursos");
        } finally {
            setLoading(false);
        }
    }, [user?.id]);

    // Fetch Tareas (Pendientes y Calificadas logic handled by backend or frontend filter)
    // For now fetching all tasks for the course and checking status
    const fetchTareas = useCallback(async () => {
        if (!selectedCurso || !user?.id) return;
        try {
            const tasksData = await apiGet(`/tareas/curso/${selectedCurso}`);
            const tasks = tasksData || [];

            // Fetch observations for the course
            let observaciones = [];
            try {
                observaciones = await apiGet(`/observaciones/estudiante/${user.id}/curso/${selectedCurso}`);
                if (!Array.isArray(observaciones)) observaciones = [];
            } catch (err) {
                console.error("Error fetching observations:", err);
            }

            // Helper to find matching observation
            const findObservation = (tareaTitulo) => {
                const matches = observaciones.filter(obs => {
                    const cleanTitle = obs.titulo.replace(/Devolución Entrega:\s*/i, "").trim();
                    return cleanTitle === tareaTitulo.trim();
                });
                
                if (matches.length === 0) return null;
                
                // Sort by date descending (newest first)
                matches.sort((a, b) => new Date(b.fechaCreacion) - new Date(a.fechaCreacion));
                return matches[0];
            };

            // Fetch submission status for each task
            const tasksWithStatus = await Promise.all(tasks.map(async (tarea) => {
                let taskData = { 
                    ...tarea, 
                    entregada: false, 
                    calificada: false,
                    nota: null,
                    retroalimentacion: null
                };

                try {
                    const entrega = await apiGet(`/tareas/${tarea.id}/entregas/estudiante/${user.id}`);
                    if (entrega) {
                        taskData = {
                            ...taskData,
                            entregada: true,
                            calificada: entrega.calificacion !== null && entrega.calificacion !== undefined,
                            nota: entrega.calificacion,
                            retroalimentacion: entrega.observaciones, // Default from submission
                            entregaId: entrega.id
                        };
                    }
                } catch (err) {
                    // No submission
                }

                // Override/Set feedback from Observations API if match found
                const matchingObs = findObservation(tarea.titulo);
                if (matchingObs) {
                    taskData.retroalimentacion = matchingObs.contenido;
                }

                return taskData;
            }));

            setTareas(tasksWithStatus);
        } catch (err) {
            console.error("Error fetching tasks:", err);
        }
    }, [selectedCurso, user?.id]);

    useEffect(() => { fetchCursos(); }, [fetchCursos]);
    useEffect(() => { fetchTareas(); }, [fetchTareas]);

    // Auto-dismiss notifications
    useEffect(() => {
        if (error || success) {
            const timer = setTimeout(() => {
                setError("");
                setSuccess("");
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [error, success]);



    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!selectedTarea) return;
        
        setError("");
        setSuccess("");

        try {
            await apiPost(`/tareas/${selectedTarea.id}/entrega`, {
                estudianteId: user.id,
                contenido: contenido
            });
            
            setSuccess("Tarea entregada correctamente");
            setSelectedTarea(null);
            setContenido("");
            fetchTareas(); // Refresh list
        } catch (err) {
            setError("Error al entregar la tarea");
        }
    };

    const getStatusBadge = (tarea) => {
        if (tarea.calificada) {
            return <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800 dark:bg-green-900/30 dark:text-green-400">
                <CheckCircle className="h-3 w-3" /> Calificada: {tarea.nota}/10
            </span>;
        }
        if (tarea.entregada) {
            return <span className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
                <Clock className="h-3 w-3" /> Entregada
            </span>;
        }
        return <span className="inline-flex items-center gap-1 rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-medium text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400">
            <AlertCircle className="h-3 w-3" /> Pendiente
        </span>;
    };

    const formatDate = (dateString) => {
        if (!dateString) return "Fecha inválida";
        const date = new Date(dateString);
        return isNaN(date.getTime()) ? "Fecha inválida" : date.toLocaleDateString();
    };

    if (loading) return <div className="p-8 text-center">Cargando...</div>;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Mis Tareas</h1>
                    <p className="text-slate-500 dark:text-slate-400">Revisa tus tareas pendientes y calificaciones</p>
                </div>
            </div>

            {/* Alerts */}
            {error && (
                <div className="rounded-lg bg-red-50 p-4 text-red-700 dark:bg-red-900/20 dark:text-red-400">
                    {error}
                </div>
            )}
            {success && (
                <div className="rounded-lg bg-green-50 p-4 text-green-700 dark:bg-green-900/20 dark:text-green-400">
                    {success}
                </div>
            )}

            {/* Course Selector */}
            <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
                <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">Selecciona un curso:</label>
                <select
                    value={selectedCurso || ""}
                    onChange={(e) => setSelectedCurso(Number(e.target.value))}
                    className="block w-full rounded-md border border-slate-300 bg-white p-2.5 text-sm text-slate-900 focus:border-blue-500 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-700 dark:text-white dark:placeholder-slate-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                >
                    {cursos.map(c => (
                        <option key={c.id} value={c.id}>{c.nombre}</option>
                    ))}
                </select>
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
                {/* Task List */}
                <div className="space-y-4 lg:col-span-2">
                    <h2 className="text-xl font-semibold dark:text-slate-300">Lista de Tareas</h2>
                    {tareas.length === 0 ? (
                        <div className="rounded-lg border border-dashed p-8 text-center text-slate-500">
                            No hay tareas asignadas en este curso.
                        </div>
                    ) : (
                        tareas.map(tarea => (
                            <div 
                                key={tarea.id}
                                className={cn(
                                    "cursor-pointer rounded-lg border p-6 transition-all hover:shadow-md",
                                    selectedTarea?.id === tarea.id 
                                        ? "border-blue-500 bg-blue-50 ring-1 ring-blue-500 dark:bg-blue-900/20 dark:ring-blue-400" 
                                        : "border-slate-200 bg-white hover:border-blue-300 dark:border-slate-700 dark:bg-slate-800 dark:hover:border-blue-700"
                                )}
                                onClick={() => setSelectedTarea(tarea)}
                            >
                                <div className="flex items-start justify-between">
                                    <div>
                                        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{tarea.titulo}</h3>
                                        <div className="mt-1 flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                                            <Calendar className="h-4 w-4" />
                                            Vence: {formatDate(tarea.fechaLimite)}
                                        </div>
                                    </div>
                                    {getStatusBadge(tarea)}
                                </div>
                                <p className="mt-4 text-slate-600 dark:text-slate-300">{tarea.descripcion}</p>
                                
                                {tarea.calificada && tarea.retroalimentacion && (
                                    <div className="mt-4 rounded-lg bg-green-50 p-4 border border-green-100 dark:bg-green-900/20 dark:border-green-900/30">
                                        <p className="font-semibold text-green-800 dark:text-green-300">Retroalimentación del Docente:</p>
                                        <p className="mt-1 text-green-700 dark:text-green-400">{tarea.retroalimentacion}</p>
                                    </div>
                                )}
                            </div>
                        ))
                    )}
                </div>

                {/* Submission Panel */}
                <div className="lg:col-span-1">
                    <div className="sticky top-6 rounded-lg border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-800">
                        {selectedTarea ? (
                            selectedTarea.calificada ? (
                                <div className="text-center">
                                    <CheckCircle className="mx-auto mb-4 h-12 w-12 text-green-500" />
                                    <h3 className="text-lg font-bold">Tarea Calificada</h3>
                                    <p className="text-slate-500">Ya no puedes editar esta entrega.</p>
                                    <div className="mt-6 text-4xl font-bold text-slate-900 dark:text-white">
                                        {selectedTarea.nota}<span className="text-xl text-slate-400">/10</span>
                                    </div>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">Entregar Tarea</h3>
                                    <p className="text-sm text-slate-500 dark:text-slate-400">Escribe tu respuesta o pega el enlace a tu trabajo.</p>
                                    
                                    <div>
                                        <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">Contenido de la entrega</label>
                                        <textarea
                                            required
                                            rows={6}
                                            value={contenido}
                                            onChange={e => setContenido(e.target.value)}
                                            className="block w-full rounded-md border border-slate-300 bg-white p-2.5 text-sm text-slate-900 focus:border-blue-500 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-700 dark:text-white dark:placeholder-slate-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                                            placeholder="Escribe aquí tu respuesta..."
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={!contenido.trim()}
                                        className="w-full rounded-lg bg-blue-600 py-2.5 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 disabled:opacity-50 dark:focus:ring-blue-800"
                                    >
                                        Enviar Entrega
                                    </button>
                                </form>
                            )
                        ) : (
                            <div className="text-center text-slate-500">
                                <FileText className="mx-auto mb-4 h-12 w-12 opacity-20" />
                                <p>Selecciona una tarea de la lista para ver detalles o entregar.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
