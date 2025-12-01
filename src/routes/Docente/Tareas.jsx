import { useState, useEffect, useCallback } from "react";
import { Plus, FileText, Download, CheckCircle, AlertCircle, Calendar, Save } from "lucide-react";
import { cn } from "@/utils/cn";
import { apiGet, apiPost } from "@/utils/api";
import { useAuth } from "@/hooks/use-auth";

export default function DocenteTareas() {
    const { user } = useAuth();
    const [cursos, setCursos] = useState([]);
    const [selectedCurso, setSelectedCurso] = useState(null);
    const [tareas, setTareas] = useState([]);
    const [selectedTarea, setSelectedTarea] = useState(null);
    const [entregas, setEntregas] = useState([]);
    const [estudiantes, setEstudiantes] = useState([]);
    
    // UI States
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [viewMode, setViewMode] = useState("list"); // list, create, review

    // Form States
    const [newTask, setNewTask] = useState({ titulo: "", descripcion: "", fechaLimite: "" });
    const [feedback, setFeedback] = useState({ calificacion: "", observaciones: "" });
    const [selectedEntrega, setSelectedEntrega] = useState(null);

    // Fetch Cursos
    const fetchCursos = useCallback(async () => {
        setLoading(true);
        try {
            if (!user?.id) return;
            const data = await apiGet(`/cursos/docente/${user.id}`);
            setCursos(data || []);
            if (data && data.length > 0) setSelectedCurso(data[0].id);
        } catch (err) {
            setError("Error al cargar cursos");
        } finally {
            setLoading(false);
        }
    }, [user?.id]);

    // Fetch Tareas
    const fetchTareas = useCallback(async () => {
        if (!selectedCurso) return;
        try {
            const data = await apiGet(`/tareas/curso/${selectedCurso}`);
            setTareas(data || []);
        } catch (err) {
            console.error("Error fetching tasks:", err);
        }
    }, [selectedCurso]);

    // Fetch Estudiantes
    const fetchEstudiantes = useCallback(async () => {
        if (!selectedCurso) return;
        try {
            // Assuming endpoint to get students enrolled in a course
            // Adjust endpoint if necessary based on actual API
            const data = await apiGet(`/cursos/${selectedCurso}/estudiantes`);
            setEstudiantes(data || []);
        } catch (err) {
            console.error("Error fetching students:", err);
        }
    }, [selectedCurso]);

    useEffect(() => { fetchCursos(); }, [fetchCursos]);
    useEffect(() => { 
        fetchTareas(); 
        fetchEstudiantes();
    }, [fetchTareas, fetchEstudiantes]);

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

    // Create Task
    const handleCreateTask = async (e) => {
        e.preventDefault();
        setError("");
        try {
            await apiPost("/tareas", {
                ...newTask,
                cursoId: selectedCurso,
                fechaCreacion: new Date().toISOString()
            });
            setSuccess("Tarea creada exitosamente");
            setViewMode("list");
            setNewTask({ titulo: "", descripcion: "", fechaLimite: "" });
            fetchTareas();
        } catch (err) {
            setError("Error al crear la tarea");
        }
    };

    // Review Logic
    const handleReviewClick = async (tarea) => {
        setSelectedTarea(tarea);
        setViewMode("review");
        try {
            const data = await apiGet(`/tareas/${tarea.id}/entregas`);
            setEntregas(data || []);
        } catch (err) {
            setError("Error al cargar entregas");
        }
    };

    const handleSendFeedback = async (e) => {
        e.preventDefault();
        if (!selectedEntrega) return;
        try {
            await apiPost(`/entregas/${selectedEntrega.id}/feedback`, {
                calificacion: Number(feedback.calificacion),
                observaciones: feedback.observaciones,
                docenteId: user.id,
                tipo: "GENERAL" // Default type
            });
            setSuccess("Calificación enviada");
            setSelectedEntrega(null);
            setFeedback({ calificacion: "", observaciones: "" });
            // Refresh entregas
            const data = await apiGet(`/tareas/${selectedTarea.id}/entregas`);
            setEntregas(data || []);
        } catch (err) {
            setError("Error al enviar calificación");
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return "Fecha inválida";
        const date = new Date(dateString);
        return isNaN(date.getTime()) ? "Fecha inválida" : date.toLocaleString();
    };

    const getStudentName = (estudianteId) => {
        const student = estudiantes.find(s => s.id === estudianteId);
        return student ? `${student.nombre} ${student.apellido || ""}` : `Estudiante #${estudianteId}`;
    };

    if (loading) return <div className="p-8 text-center">Cargando...</div>;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Gestión de Tareas</h1>
                    <p className="text-slate-500 dark:text-slate-400">Crea tareas y califica entregas</p>
                </div>
                {viewMode === "list" && (
                    <button
                        onClick={() => setViewMode("create")}
                        className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                    >
                        <Plus className="h-4 w-4" /> Nueva Tarea
                    </button>
                )}
                {viewMode !== "list" && (
                    <button
                        onClick={() => setViewMode("list")}
                        className="text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                    >
                        Volver a la lista
                    </button>
                )}
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
            {viewMode === "list" && (
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
            )}

            {/* Views */}
            {viewMode === "list" && (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {tareas.map(tarea => (
                        <div key={tarea.id} className="group rounded-lg border border-slate-200 bg-white p-6 shadow-sm transition-all hover:shadow-md dark:border-slate-700 dark:bg-slate-800">
                            <h3 className="mb-2 text-lg font-semibold text-slate-900 dark:text-white">{tarea.titulo}</h3>
                            <p className="mb-4 text-sm text-slate-500 line-clamp-2 dark:text-slate-400">{tarea.descripcion}</p>
                            <div className="mb-4 flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                                <Calendar className="h-4 w-4" />
                                {formatDate(tarea.fechaLimite)}
                            </div>
                            <button
                                onClick={() => handleReviewClick(tarea)}
                                className="w-full rounded-lg border border-blue-600 py-2.5 text-sm font-medium text-blue-600 transition-colors hover:bg-blue-50 dark:border-blue-500 dark:text-blue-500 dark:hover:bg-blue-950/30"
                            >
                                Revisar Entregas
                            </button>
                        </div>
                    ))}
                    {tareas.length === 0 && (
                        <div className="col-span-full py-12 text-center text-slate-500">
                            No hay tareas creadas para este curso.
                        </div>
                    )}
                </div>
            )}

            {viewMode === "create" && (
                <div className="mx-auto max-w-2xl rounded-lg border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-700 dark:bg-slate-800">
                    <h2 className="mb-6 text-2xl font-bold text-slate-900 dark:text-white">Crear Nueva Tarea</h2>
                    <form onSubmit={handleCreateTask} className="space-y-5">
                        <div>
                            <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">Título</label>
                            <input
                                type="text"
                                required
                                value={newTask.titulo}
                                onChange={e => setNewTask({...newTask, titulo: e.target.value})}
                                className="block w-full rounded-md border border-slate-300 bg-white p-2.5 text-sm text-slate-900 focus:border-blue-500 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-700 dark:text-white dark:placeholder-slate-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                                placeholder="Ej: Tarea 1 - Introducción"
                            />
                        </div>
                        <div>
                            <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">Descripción</label>
                            <textarea
                                required
                                rows={4}
                                value={newTask.descripcion}
                                onChange={e => setNewTask({...newTask, descripcion: e.target.value})}
                                className="block w-full rounded-md border border-slate-300 bg-white p-2.5 text-sm text-slate-900 focus:border-blue-500 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-700 dark:text-white dark:placeholder-slate-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                                placeholder="Describe los detalles de la tarea..."
                            />
                        </div>
                        <div>
                            <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">Fecha de Entrega</label>
                            <input
                                type="datetime-local"
                                required
                                value={newTask.fechaLimite}
                                onChange={e => setNewTask({...newTask, fechaLimite: e.target.value})}
                                className="block w-full rounded-md border border-slate-300 bg-white p-2.5 text-sm text-slate-900 focus:border-blue-500 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-700 dark:text-white dark:placeholder-slate-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                            />
                        </div>
                        <div className="flex justify-end gap-3 pt-4">
                            <button
                                type="button"
                                onClick={() => setViewMode("list")}
                                className="rounded-lg px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700"
                            >
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-800"
                            >
                                Crear Tarea
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {viewMode === "review" && selectedTarea && (
                <div className="space-y-6">
                    <div className="rounded-lg bg-blue-50 p-4 dark:bg-blue-900/20">
                        <h2 className="text-lg font-bold text-blue-900 dark:text-blue-100">{selectedTarea.titulo}</h2>
                        <p className="text-blue-700 dark:text-blue-300">{selectedTarea.descripcion}</p>
                    </div>

                    <div className="grid gap-6 lg:grid-cols-2">
                        {/* List of Submissions */}
                        <div className="space-y-4">
                            <h3 className="font-semibold text-slate-900 dark:text-white">Entregas Recibidas ({entregas.length})</h3>
                            {entregas.map(entrega => (
                                <div
                                    key={entrega.id}
                                    onClick={() => setSelectedEntrega(entrega)}
                                    className={cn(
                                        "cursor-pointer rounded-lg border p-4 transition-all hover:shadow-md",
                                        selectedEntrega?.id === entrega.id
                                            ? "border-blue-500 bg-blue-50 ring-1 ring-blue-500 dark:bg-blue-900/20 dark:ring-blue-400"
                                            : "border-slate-200 bg-white hover:border-blue-300 dark:border-slate-700 dark:bg-slate-800 dark:hover:border-blue-700"
                                    )}
                                >
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <p className="font-medium text-slate-900 dark:text-white">
                                                {getStudentName(entrega.estudianteId)}
                                            </p>
                                            <p className="text-sm text-slate-500 dark:text-slate-400">
                                                Entregado: {formatDate(entrega.fechaEntrega)}
                                            </p>
                                        </div>
                                        {entrega.calificada && <CheckCircle className="h-5 w-5 text-green-500 dark:text-green-400" />}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Grading Panel */}
                        <div className="rounded-lg border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-800">
                            {selectedEntrega ? (
                                <div className="space-y-6">
                                    <div className="border-b pb-4 dark:border-slate-700">
                                        <h3 className="text-lg font-bold dark:text-white">Calificar Entrega</h3>
                                        <p className="text-sm text-slate-500">Estudiante: {getStudentName(selectedEntrega.estudianteId)}</p>
                                    </div>

                                    {/* Submission Content */}
                                    <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-900">
                                        <p className="mb-2 text-sm font-medium text-slate-700 dark:text-slate-300">Contenido de la entrega:</p>
                                        <p className="whitespace-pre-wrap text-sm text-slate-600 dark:text-slate-400">
                                            {selectedEntrega.contenido || "Sin contenido."}
                                        </p>
                                    </div>

                                    <div className="space-y-4">
                                        <div>
                                            <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">Calificación (0-10)</label>
                                            <input
                                                type="number"
                                                min="0"
                                                max="10"
                                                step="0.1"
                                                value={feedback.calificacion}
                                                onChange={e => setFeedback({...feedback, calificacion: e.target.value})}
                                                className="block w-full rounded-md border border-slate-300 bg-white p-2.5 text-sm text-slate-900 focus:border-blue-500 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-700 dark:text-white dark:placeholder-slate-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                                            />
                                        </div>
                                        <div>
                                            <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">Observaciones</label>
                                            <textarea
                                                rows={4}
                                                value={feedback.observaciones}
                                                onChange={e => setFeedback({...feedback, observaciones: e.target.value})}
                                                className="block w-full rounded-md border border-slate-300 bg-white p-2.5 text-sm text-slate-900 focus:border-blue-500 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-700 dark:text-white dark:placeholder-slate-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                                                placeholder="Escribe tus observaciones aquí..."
                                            />
                                        </div>
                                        <button
                                            onClick={handleSendFeedback}
                                            className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 py-2.5 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-800"
                                        >
                                            <Save className="h-4 w-4" /> Guardar Calificación
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex h-full flex-col items-center justify-center text-center text-slate-500">
                                    <FileText className="mb-4 h-12 w-12 opacity-20" />
                                    <p>Selecciona una entrega para calificar</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
